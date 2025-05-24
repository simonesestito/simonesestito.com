package main

import (
	"fmt"
	"net/http"
	"os"
	"www-api/src/api"
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
	apiRouter := api.NewRouter()
	handler := apiRouter.Handler()
	http.Handle("/", handler)

	port := 8080
	fmt.Println("Listening on port", port)

	return http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
}
