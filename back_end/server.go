package main

import "github.com/gin-gonic/gin"
import "github.com/gin-contrib/static"
import "golang.org/x/crypto/bcrypt"
import "github.com/SherClockHolmes/webpush-go"
import "github.com/gin-contrib/sessions"
import "bytes"
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

/****push notification VAPID private_key****/
const vapid_private_key = "VVGcRo-7fylWWP86OmqncvChDMOmEchHE37FoBlfQQA";

var db *sql.DB;

func main() {

    router := gin.Default();
    store := sessions.NewCookieStore([]byte(vapid_private_key));     //use vapid_private_key for convenience

    router.Use(static.Serve("/", static.LocalFile("../front_end/", true)));
    router.Use(sessions.Sessions("sessionID", store));

    router.GET("/", func(c *gin.Context) {
        c.HTML(http.StatusOK, "index.html", nil);
    });
    router.GET("/get_illegal_post", get_illegal_post);
    router.GET("/get_top_post", get_top_post);
    router.GET("/get_records", get_records);
    router.GET("/get_session", get_session);

    router.POST("/report_illegal", report_illegal);
    router.POST("/publish", publish);
    router.POST("/signin", signin);
    router.POST("/signout", signout);
    router.POST("/signup", signup);
    router.POST("/get_fb_info", get_fb_info);
    router.POST("/store_subscription", store_subscription);
    router.POST("/update_status", update_status);

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

func report_illegal(c *gin.Context) {
    location := c.PostForm("location");
    name := c.PostForm("name");
    picture := c.PostForm("picture");
    car_num := c.PostForm("car_num");
    longitude, _ := strconv.ParseFloat(c.PostForm("longitude"), 64);
    latitude, _ := strconv.ParseFloat(c.PostForm("latitude"), 64);

    /**********************insert to database******************/
    //id, time, car_number, parking_lot, longitude, latitude, name, picture, process_status, process_time, processor
    stmtIns, err := db.Prepare("INSERT INTO illegal_info VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, '尚未處理', '尚未處理', '尚未處理')");
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
    /*********************************************************/

    c.JSON(http.StatusOK, gin.H {
        "result": 1,
        "message": "post success",
    });
}

func get_illegal_post(c *gin.Context) {
    //return time, car_number, location, picture
    var time [5]string;
    var car_number [5]string;
    var location [5]string;
    var picture [5]string;

    /******select time, car_number, location, picture********/
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
    /*********************************************************/

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

    /********select count picture location car_number********/
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
    /*******************************************************/

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

func get_records(c *gin.Context) {
    var id [15]string;
    var time [15]string;
    var parking_lot [15]string;
    var picture [15]string;
    var process_status [15]string;
    var process_time [15]string;
    var processor [15]string;

    /******select id, time, parking_lot, picture, process_status, process_time, processor********/
    //Execute the query
    rows, err := db.Query("SELECT id, time, parking_lot, picture, process_status, process_time, processor FROM illegal_info ORDER BY id DESC LIMIT 15");
    if err != nil {
        panic(err.Error());
    }

    //fetch data
    var i int = 0;
    for rows.Next() {
        err = rows.Scan(&id[i], &time[i], &parking_lot[i], &picture[i], &process_status[i], &process_time[i], &processor[i]);
        if err != nil {
            panic(err.Error());
        }

        i++;
    }
    /*********************************************************/

    var data []gin.H;

    for j:=0; j<i; j++ {
        data = append(data, gin.H{
            "id": id[j],
            "time": time[j],
            "parking": parking_lot[j],
            "picture": picture[j],
            "processStatus": process_status[j],
            "processTime": process_time[j],
            "processPerson": processor[j],
        })
    }

    c.JSON(http.StatusOK, gin.H {
        "data": data,
    });
}

func publish(c *gin.Context) {
    //name := c.PostForm("name");
    longitude := c.PostForm("longitude");
    latitude := c.PostForm("latitude");
    var subscription string;

    options := `{
        "longitude": "`+longitude+`",
        "latitude": "`+latitude+`"
    }`;

    /**********select all push subscription**********/
    //Execute the query
    rows, err := db.Query("SELECT push_subscription FROM push_subscription");
    if err != nil {
        panic(err.Error());
    }

    //fetch data
    for rows.Next() {
        err = rows.Scan(&subscription);
        if err != nil {
            panic(err.Error());
        }

        subJSON := subscription;

        s := webpush.Subscription{};
	    if err := json.NewDecoder(bytes.NewBufferString(subJSON)).Decode(&s); err != nil {
	        panic(err.Error());
        }
	    _, err := webpush.SendNotification([]byte(options), &s, &webpush.Options{
		    Subscriber:      "apple113611361@gmail.com",
		    VAPIDPrivateKey: vapid_private_key,
	    })
	    if err != nil {
	        panic(err.Error());
	    }
   }

    c.JSON(http.StatusOK, gin.H {
        "result": 1,
        "message": "post success",
    });
}

func signin(c *gin.Context) {
    account := c.PostForm("account");
    password := c.PostForm("password");
    session := sessions.Default(c);

    var class int;
    var signin_status bool;
    var if_account_exist bool;
    var database_password string;

    v := session.Get("signin_status");
    if v == nil {
        fmt.Printf("have not signined\n");
    } else {
        signin_status = v.(bool);

        if signin_status {
            fmt.Printf("have signined\n");
        } else {
            fmt.Printf("have not signined\n");
        }
    }


    /*******check if there is the account, if yes, return the password, if no, return empty string******/
    //Prepare the query
    stmtSel, err := db.Prepare("SELECT password, class FROM user_account WHERE account=?");
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
        err = rows.Scan(&database_password, &class);
        if err != nil {
            panic(err.Error());
        }

        if_account_exist = true;
    } else {                        //there is no that account
        if_account_exist = false;
        database_password = "";
    }
    /*************************************************************************/

    if if_account_exist {

        err := bcrypt.CompareHashAndPassword([]byte(database_password), []byte(password));

        if err==nil {       //password correct
            signin_status = true;
            session.Set("signin_status", signin_status);
            session.Set("account", account);
            session.Set("class", class);
            session.Save();

            c.JSON(http.StatusOK, gin.H {
                "result": 1,
                "message": "登入成功",
            });
        } else {            //password wrong
            c.JSON(http.StatusOK, gin.H {
                "result": -1,
                "message": "帳號或密碼輸入錯誤",
            });
        }

    } else {                //these is no account
        c.JSON(http.StatusOK, gin.H {
            "result": -1,
            "message": "帳號或密碼輸入錯誤",
        });
    }

}

func signout(c *gin.Context) {
    session := sessions.Default(c);

    session.Set("signin_status", false);
    session.Save();

    c.JSON(http.StatusOK, gin.H {
        "result": 1,
        "message": "登出成功",
    });
}

func signup(c *gin.Context) {
    account := c.PostForm("account");
    password := c.PostForm("password");
    car_number := c.PostForm("car_number");
    email := c.PostForm("email");

    var if_account_exist bool;
    var if_email_exist bool;

    /***********check if there is the account*********/
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

    if rows.Next() {                //there is the account
        if_account_exist = true;
    } else {                        //there is no that account
        if_account_exist = false;
    }
    /**************************************************/

    if if_account_exist {
        c.JSON(http.StatusOK, gin.H {
            "result": -2,
            "message": "此帳號已存在",
        });
    } else {
        /***********check if there is the email*********/
        //Prepare the query
        stmtSel, err := db.Prepare("SELECT account FROM user_account WHERE email=?");
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
            if_email_exist = true;
        } else {                        //there is no that eamil
            if_email_exist = false;
        }

        if if_email_exist {
            c.JSON(http.StatusOK, gin.H {
                "result": -3,
                "message": "電子信箱已被使用過",
            });
        } else {
            bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14);
            if err != nil {
                panic(err.Error());
            }

            /*****************insert to database***************/
            //id, account, password, car_number
            stmtIns, err := db.Prepare("INSERT INTO user_account VALUES(NULL, ?, ?, ?, ?, 1)");
            if err != nil {
                panic(err.Error());
            }
            defer stmtIns.Close();

            _, err = stmtIns.Exec(account, string(bytes), car_number, email);
            if err != nil {
                panic(err.Error());
            }
            /***************************************************/

            c.JSON(http.StatusOK, gin.H {
                "result": 1,
                "message": "註冊成功",
            });
        }
    }
}

func get_fb_info(c *gin.Context) {

    sender_id := c.PostForm("sender_id");
    first_name := c.PostForm("first_name");
    last_name := c.PostForm("last_name");
    profile_pic := c.PostForm("profile_pic");
    locale := c.PostForm("locale");
    timezone, _ := strconv.Atoi(c.PostForm("timezone"));
    gender := c.PostForm("gender");

    /*******************insert to database********************/
    //id, sender_id, first_name, last_name, profile_pic, locale, timezone, gender
    stmtIns, err := db.Prepare("INSERT INTO fb_info VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)");
	if err != nil {
        panic(err.Error());
    }
    defer stmtIns.Close();

    _, err = stmtIns.Exec(sender_id, first_name, last_name, profile_pic, locale, timezone, gender);
    if err != nil {
        panic(err.Error());
    }
    /*********************************************************/

    c.JSON(http.StatusOK, gin.H {
        "result": 1,
        "message": "post success",
    });
}

func store_subscription(c *gin.Context) {
    push_subscription := c.PostForm("subscription");

    /********先找資料庫有這筆嗎**********/
    stmtSel, err := db.Prepare("SELECT push_subscription FROM push_subscription WHERE push_subscription=?");
    if err != nil {
        panic(err.Error());
    }
    defer stmtSel.Close();

    //Execute the query
    rows, err := stmtSel.Query(push_subscription);
    if err != nil {
        panic(err.Error());
    }
    /***********************************/

    if rows.Next() {        //有這筆資料

    } else {                //沒有這筆資料
        stmtIns, err := db.Prepare("INSERT INTO push_subscription VALUES (NULL, ?)");
        if err != nil {
            panic(err.Error());
        }
        defer stmtIns.Close();

        _, err = stmtIns.Exec(push_subscription);
        if err != nil {
            panic(err.Error());
        }
    }
}

func update_status(c *gin.Context) {
    id := c.PostForm("id");
    status := c.PostForm("status");

    /****get time****/
    now := time.Now().Format("2006-01-02 15:04:05");
    /****************/

   /*******************update to database********************/
    stmtIns, err := db.Prepare("UPDATE illegal_info SET process_status=?, process_time=? WHERE id=?");
	if err != nil {
        panic(err.Error());
    }
    defer stmtIns.Close();

    if status == "處理完畢" {                   //process finish
       _, err = stmtIns.Exec(status, now, id);
        if err != nil {
            panic(err.Error());
        }
    } else {                                    //process not finish
        _, err = stmtIns.Exec(status, nil, id);
        if err != nil {
            panic(err.Error());
        }
    }
    /*********************************************************/

    c.JSON(http.StatusOK, gin.H {
        "result": 1,
        "message": "update success",
        "data": gin.H {
            "id": id,
            "status": status,
            "time": now,
        },
    });

}

func get_session(c *gin.Context) {
    var signin_status bool;
    var account string;
    var class int;

    session := sessions.Default(c);

    v := session.Get("signin_status");
    if v == nil {                       //do not have a session
        c.JSON(http.StatusOK, gin.H {
            "signin_status": false,
        });
    } else {                            //have a session
        signin_status = v.(bool);

        if signin_status {                  //the state is signin
            v = session.Get("account");
            account = v.(string);
            v = session.Get("class");
            class = v.(int);

            c.JSON(http.StatusOK, gin.H {
                "signin_status": signin_status,
                "account": account,
                "calss": class,
            });
        } else {                        //the state is not signin
            c.JSON(http.StatusOK, gin.H {
                "signin_status": signin_status,
            });
        }
    }


}


