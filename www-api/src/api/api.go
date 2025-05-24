package api

import "net/http"
import "github.com/gorilla/mux"

type Router interface {
	Handler() http.Handler
}

type _router struct {
	router  *mux.Router
	context *apiContext
}

func (r *_router) Handler() http.Handler {
	// Also register the routes here
	r.router.HandleFunc("/api/emails", r.sendEmail).Methods("POST")
	r.router.HandleFunc("/api/emails/reply", r.replyToEmail).Methods("GET")
	return r.router
}

func NewRouter() Router {
	r := &_router{
		router:  mux.NewRouter(),
		context: &apiContext{},
	}
	return r
}
