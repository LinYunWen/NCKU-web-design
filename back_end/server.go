package main

import "github.com/gin-gonic/gin"
import "github.com/gin-contrib/static"
//import "github.com/gin-gonic/autotls"
//import "golang.org/x/crypto/acme/autocert"
//import "crypto/tls"
import "net/http"
//import "log"

func main() {

	/***************************/
    router := gin.Default();
    router.Use(static.Serve("/", static.LocalFile("../introduction", true)));

    router.GET("/", func(c *gin.Context) {
        c.HTML(http.StatusOK, "index.html", nil);
    });

	/***************************
	m := autocert.Manager{
        Prompt:     autocert.AcceptTOS,
        HostPolicy: autocert.HostWhitelist("ee.ncku.edu.tw"),
        Cache:      autocert.DirCache("./.cache"),
    }

	s := &http.Server{
        Addr:      ":2996",
        TLSConfig: &tls.Config{GetCertificate: m.GetCertificate},
        Handler:   router,
    }*/

    http.ListenAndServeTLS(":2996", "ssl/certificate.crt", "ssl/private.key", router);
	/**************************/

    //log.Fatal(autotls.RunWithManager(router, &m));
    //router.Run(":2996");
}



