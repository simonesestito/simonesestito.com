package api

import (
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/gorilla/schema"
	"net/http"
	"www-api/src/config"
)

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

func NewRouter(cfg config.Config) Router {
	r := &_router{
		router: mux.NewRouter(),
		context: &apiContext{
			Log:              cfg.Log,
			JsonValidator:    validator.New(),
			UrlValuesDecoder: schema.NewDecoder(),
		},
	}
	return r
}
