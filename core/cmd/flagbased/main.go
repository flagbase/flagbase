package flagbased

import (
	"context"
	"flag"
	"io/ioutil"
	"log"
	"os"

	"core/internal/db"
	"core/internal/http"

	"github.com/sirupsen/logrus"
)

// Exec flagbased with args
func Exec() {
	host := flag.String("host", "localhost", "Server Host Address")
	httpPort := flag.String("httpPort", "5051", "HTTP Server Port Number")
	dbURL := flag.String("dbURL", "postgres://flagbase:BjrvWmjQ3dykPu@127.0.0.1:5432/flagbase", "Postgres Connection URL")
	debug := flag.Bool("debug", false, "Enable logging to stdout")
	flag.Parse()

	logrus.WithFields(logrus.Fields{
		"host":     *host,
		"httpPort": *httpPort,
		"dbURL":    *dbURL,
		"debug":    *debug,
	}).Info("Starting flagbased with the following flags")

	if *debug == false {
		log.SetOutput(ioutil.Discard)
		logrus.SetOutput(ioutil.Discard)
	}

	ctx := context.Background()

	if err := db.NewPool(ctx, *dbURL, *debug); err != nil {
		logrus.Error("Unable to connect to db: ", err)
		os.Exit(1)
	}
	defer db.Pool.Close()

	http.NewHTTPServer(*host, *httpPort, *debug)
}
