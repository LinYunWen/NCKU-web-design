package main

import "github.com/gin-gonic/gin"
import "github.com/gin-contrib/static"
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

    router.GET("/report_illegal", report_illegal);
    router.GET("/publish", publish);
    router.GET("/signin", signin);
    router.GET("/signup", signup);
    //router.POST("/get_user_info", get_user_info);

    init_database();

    http.ListenAndServeTLS(":2996", "ssl/certificate.crt", "ssl/private.key", router);
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

func insert_user_account() {
    //id, account, password, car_number
    stmtIns, err := db.Prepare("INSERT INTO user_account VALUES(NULL, ?, ?, ?)");
    if err != nil {
        panic(err.Error());
    }
    defer stmtIns.Close();

    _, err = stmtIns.Exec("apple11361", "i'm a hash", "956-NWM");
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

//return car_number
func select_top_3_illegal_car_number(index int) [3]string {
    var car_number [3]string;

    //Prepare the query
    stmtSel, err := db.Prepare("SELECT COUNT(*) AS count, car_number FROM illegal_info GROUP BY car_number ORDER BY count DESC LIMIT ?, ?");
    if err != nil {
        panic(err.Error());
    }
    defer stmtSel.Close();

    //Execute the query
    rows, err := stmtSel.Query(index*3, 3);
    if err != nil {
        panic(err.Error());
    }
    //fetch data
    var i int = 0;
    var count int;
    for rows.Next() {
        err = rows.Scan(&count, &car_number[i]);
        if err != nil {
            panic(err.Error());
        }

        i++;
    }

    return car_number;
}

func report_illegal(c *gin.Context) {
    location := c.Query("location");
    name := c.Query("name");
    picture := c.Query("picture");
    car_num := c.Query("car_num");
    longitude, _ := strconv.ParseFloat(c.Query("longitude"), 64);
    latitude, _ := strconv.ParseFloat(c.Query("latitude"), 64);

    insert_illegal_info(car_num, location, longitude, latitude, name, picture);
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
    var car_number [3]string;
    index, _ := strconv.Atoi(c.Query("index"));

    car_number = select_top_3_illegal_car_number(index);

    c.JSON(http.StatusOK, gin.H {
        "data": []interface{} {
            gin.H{
                "picture": "p",
                "location": "l",
                "car_num": car_number[0],
            },
            gin.H{
                "picture": "p2",
                "location": "l2",
                "car_num": car_number[1],
            },
            gin.H{
                "picture": "p3",
                "location": "l3",
                "car_num": car_number[2],
            },
        },
    });
}

func publish(c *gin.Context) {
    //longitude, _ := strconv.ParseFloat(c.Query("longitude"), 64);
    //latitude, _ := strconv.ParseFloat(c.Query("latitude"), 64);

    c.String(http.StatusOK, "success");
}

func signin(c *gin.Context) {
    account := c.Query("account");
    password := c.Query("password");

    c.String(http.StatusOK, "account: " + account + "\npassword: " + password);
}

func signup(c *gin.Context) {
    account := c.Query("account");
    password := c.Query("password");
    email := c.Query("email");

    c.String(http.StatusOK, "account: " + account + "\npassword: " + password + "\nemail" + email);
}


