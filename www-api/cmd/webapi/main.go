package main

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"net/http"
	"os"
	"www-api/src/api"
	"www-api/src/config"
)

// main is the program entry point.
// The only purpose of this function is to call run() and set the exit code if there is any error
func main() {
	if err := run(); err != nil {
		_, _ = fmt.Fprintln(os.Stderr, "error: ", err)
		os.Exit(1)
	}
}

func run() error {
	log := logrus.New()
	log.SetOutput(os.Stdout)

	log.Infoln("Application initializing...")

	cfg := config.Config{
		Log: log,
	}

	apiRouter := api.NewRouter(cfg)
	handler := apiRouter.Handler()
	http.Handle("/", handler)

	port := 8080
	log.Infof("Listening on port %d", port)

	return http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
}
