package main

import "github.com/gin-gonic/gin"
import "github.com/gin-contrib/static"
import "golang.org/x/crypto/bcrypt"
import "net/http"
import "database/sql"
import "encoding/json"
import "io/ioutil"
import "fmt"
import "strconv"
import "time"

import _ "github.com/go-sql-driver/mysql"


/****database confugure file****/
type Conf struct {
    Host string
    Database string
    User string
    Password string
}

var db *sql.DB;

func main() {

    router := gin.Default();
    router.Use(static.Serve("/", static.LocalFile("../front_end", true)));

    router.GET("/", func(c *gin.Context) {
        c.HTML(http.StatusOK, "index.html", nil);
    });

    router.GET("/get_illegal_post", get_illegal_post);
    router.GET("/get_top_post", get_top_post);

    router.POST("/report_illegal", report_illegal);
    router.POST("/publish", publish);
    router.POST("/signin", signin);
    router.POST("/signup", signup);
    //router.POST("/get_user_info", get_user_info);

    init_database();

    http.ListenAndServeTLS(":2997", "ssl/certificate.crt", "ssl/private.key", router);
}


func init_database() {

    /******read configure file******/
    file, err := ioutil.ReadFile("conf.json");
    if err != nil {
        panic(err.Error());
    }
    conf := Conf{};
    err = json.Unmarshal(file, &conf);

    var connection_str = fmt.Sprintf("%s:%s@tcp(%s:3306)/%s", conf.User, conf.Password, conf.Host, conf.Database);

    /*********connection*********/
    db, err = sql.Open("mysql", connection_str);
    if err != nil {
        panic(err.Error());
    }
}

func insert_illegal_info(car_num string, location string, longitude float64, latitude float64, name string, picture string) {
    //id, time, car_number, parking_lot, longitude, latitude, name, picture
    stmtIns, err := db.Prepare("INSERT INTO illegal_info VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)");
    if err != nil {
        panic(err.Error());
    }
    defer stmtIns.Close();

    /****get time****/
    now := time.Now().Format("2006-01-02 15:04:05");
    /****************/

    _, err = stmtIns.Exec(now, car_num, location, longitude, latitude, name, picture);
    if err != nil {
        panic(err.Error());
    }
}

func insert_fb_info() {
    //id, sender_id, first_name, last_name, profile_pic, locale, timezone, gender
    stmtIns, err := db.Prepare("INSERT INTO fb_info VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)");
	if err != nil {
        panic(err.Error());
    }
    defer stmtIns.Close();

    _, err = stmtIns.Exec("1234567890", "Li", "junder", "asdasdasd", "here", 8, "male");
    if err != nil {
        panic(err.Error());
    }
}

func insert_user_account(account string, password string, car_number string, email string) {
    //id, account, password, car_number
    stmtIns, err := db.Prepare("INSERT INTO user_account VALUES(NULL, ?, ?, ?, ?)");
    if err != nil {
        panic(err.Error());
    }
    defer stmtIns.Close();

    _, err = stmtIns.Exec(account, password, car_number, email);
    if err != nil {
        panic(err.Error());
    }
}

//return time, car_number, location, picture
func select_illegal_info() ([5]string, [5]string, [5]string, [5]string){
    var time [5]string;
    var car_number [5]string;
    var location [5]string;
    var picture [5]string;

    //Execute the query
    rows, err := db.Query("SELECT time, car_number, parking_lot, picture FROM illegal_info ORDER BY id DESC LIMIT 5");
    if err != nil {
        panic(err.Error());
    }

    //fetch data
    var i int = 0;
    for rows.Next() {
        err = rows.Scan(&time[i], &car_number[i], &location[i], &picture[i]);
        if err != nil {
            panic(err.Error());
        }

        i++;
    }

    return time, car_number, location, picture;
}

//return count picture location car_number
func select_top_3_illegal_car_number(index int) ([3]int, [3]string, [3]string, [3]string) {
    var count [3]int;
    var picture [3]string;
    var location [3]string;
    var car_number [3]string;

    //Prepare the query
    stmtSel, err := db.Prepare("SELECT COUNT(*) AS count, picture, parking_lot, car_number FROM (SELECT * FROM illegal_info ORDER BY id DESC) AS total GROUP BY car_number ORDER BY count DESC LIMIT ?, ?");
    if err != nil {
        panic(err.Error());
    }
    defer stmtSel.Close();

    //Execute the query
    rows, err := stmtSel.Query(index*3, 3);
    if err != nil {
        panic(err.Error());
    }
    //fetch the data
    var i int = 0;
    for rows.Next() {
        err = rows.Scan(&count[i], &picture[i], &location[i], &car_number[i]);
        if err != nil {
            panic(err.Error());
        }

        i++;
    }

    return count, picture, location, car_number;
}

//return if there is the account, if yes, return the password, if no, return empty string 
func select_password(account string) (bool, string) {
    var password string;

    //Prepare the query
    stmtSel, err := db.Prepare("SELECT password FROM user_account WHERE account=?");
    if err != nil {
        panic(err.Error());
    }
    defer stmtSel.Close();


    //Execute the query
    rows, err := stmtSel.Query(account);
    if err != nil {
        panic(err.Error());
    }

    //Fetch the data
    if rows.Next() {                //there is the account
        err = rows.Scan(&password);
        if err != nil {
            panic(err.Error());
        }
        return true, password;
    } else {                        //there is no that account
        return false, "";
    }
}

func check_if_email_exist(email string) bool {
    var account string;

    //Prepare the query
    stmtSel, err := db.Prepare("SELECT account FROM user_account WHERE car_number=?");
    if err != nil {
        panic(err.Error());
    }
    defer stmtSel.Close();


    //Execute the query
    rows, err := stmtSel.Query(email);
    if err != nil {
        panic(err.Error());
    }

    //Fetch the data
    if rows.Next() {                //there is the email
        err = rows.Scan(&account);
        if err != nil {
            panic(err.Error());
        }
        return true;
    } else {                        //there is no that eamil
        return false;
    }
}

func report_illegal(c *gin.Context) {
    location := c.PostForm("location");
    name := c.PostForm("name");
    picture := c.PostForm("picture");
    car_num := c.PostForm("car_num");
    longitude, _ := strconv.ParseFloat(c.PostForm("longitude"), 64);
    latitude, _ := strconv.ParseFloat(c.PostForm("latitude"), 64);

    insert_illegal_info(car_num, location, longitude, latitude, name, picture);
    c.JSON(http.StatusOK, gin.H {
        "result": "1",
        "message": "post success",
    });
}

func get_illegal_post(c *gin.Context) {
    //return time, car_number, location, picture
    var time [5]string;
    var car_number [5]string;
    var location [5]string;
    var picture [5]string;

    time, car_number, location, picture = select_illegal_info();
    fmt.Printf("%s %s %s %s %s", time[1], car_number[1], location[1], picture[1]);

    c.JSON(http.StatusOK, gin.H {
        "data": []interface{} {
            gin.H{
                "picture": picture[0],
                "location": location[0],
                "car_num": car_number[0],
                "time": time[0],
            },
            gin.H{
                "picture": picture[1],
                "location": location[1],
                "car_num": car_number[1],
                "time": time[1],
            },
            gin.H{
                "picture": picture[2],
                "location": location[2],
                "car_num": car_number[2],
                "time": time[2],
            },
            gin.H{
                "picture": picture[3],
                "location": location[3],
                "car_num": car_number[3],
                "time": time[3],
            },
            gin.H{
                "picture": picture[4],
                "location": location[4],
                "car_num": car_number[4],
                "time": time[4],
            },
        },
    });
}

func get_top_post(c *gin.Context) {
    var count [3]int;
    var picture [3]string;
    var location [3]string;
    var car_number [3]string;

    index, _ := strconv.Atoi(c.Query("index"));

    count, picture, location, car_number = select_top_3_illegal_car_number(index);

    c.JSON(http.StatusOK, gin.H {
        "data": []interface{} {
            gin.H{
                "count": count[0],
                "picture": picture[0],
                "location": location[0],
                "car_num": car_number[0],
            },
            gin.H{
                "count": count[1],
                "picture": picture[1],
                "location": location[1],
                "car_num": car_number[1],
            },
            gin.H{
                "count": count[2],
                "picture": picture[2],
                "location": location[2],
                "car_num": car_number[2],
            },
        },
    });
}

func publish(c *gin.Context) {
    //name := c.PostForm("name");
    //longitude, _ := strconv.ParseFloat(c.PostForm("longitude"), 64);
    //latitude, _ := strconv.ParseFloat(c.PostForm("latitude"), 64);

    c.JSON(http.StatusOK, gin.H {
        "result": "1",
        "message": "post success",
    });
}

func signin(c *gin.Context) {
    account := c.PostForm("account");
    password := c.PostForm("password");

    var if_account_exist bool;
    var database_password string;

    if_account_exist, database_password = select_password(account);

    if if_account_exist {
        bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14);
        if err != nil {
            panic(err.Error());
        }

        err = bcrypt.CompareHashAndPassword([]byte(database_password), bytes);

        if err==nil {       //password correct
            //to do...
        } else {            //password wrong
            //to do...
        }

    } else {                //these is no account
        //to do...
    }

    c.JSON(http.StatusOK, gin.H {
        "result": "1",
        "message": "post success",
    });
}

func signup(c *gin.Context) {
    account := c.PostForm("account");
    password := c.PostForm("password");
    car_number := c.PostForm("car_number");
    email := c.PostForm("email");

    if_account_exist, _ := select_password(account);

    if if_account_exist {
        //to do...
    } else {
        if check_if_email_exist(email) {
            //to do...
        } else {
            bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14);
            if err != nil {
                panic(err.Error());
            }

            insert_user_account(account, string(bytes), car_number, email);
        }
    }

    c.JSON(http.StatusOK, gin.H {
        "result": "1",
        "message": "post success",
    });
}


