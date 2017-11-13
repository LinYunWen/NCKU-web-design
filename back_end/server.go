package main

import "github.com/gin-gonic/gin"
import "github.com/gin-contrib/static"
import "net/http"

func main() {

    router := gin.Default();
    router.Use(static.Serve("/", static.LocalFile("../front_end", true)));

    router.GET("/", func(c *gin.Context) {
        c.HTML(http.StatusOK, "index.html", nil);
    });

    http.ListenAndServeTLS(":2996", "ssl/certificate.crt", "ssl/private.key", router);
}



