package main

import "github.com/gin-gonic/gin"
import "github.com/gin-contrib/static"
import "net/http"
import "database/sql"
import "encoding/json"
import "io/ioutil"
import "fmt"

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

    router.GET("/report_illegal", report_illegal);

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
    db, err := sql.Open("mysql", connection_str);
    if err != nil {
        panic(err.Error());
    }
    defer db.Close();
}

func report_illegal(c *gin.Context) {
    location := c.Query("location");
    name := c.Query("name");
    picture := c.Query("picture");

    c.String(http.StatusOK, "location: %s, name: %s, picture: %s\n", location, name, picture);
    fmt.Printf("location: %s, name: %s, picture: %s\n", location, name, picture);
}



