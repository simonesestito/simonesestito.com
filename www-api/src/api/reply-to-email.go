package api

import "net/http"

func (r *_router) replyToEmail(res http.ResponseWriter, req *http.Request) {
	_, _ = res.Write([]byte("Reply to email endpoint is not implemented yet"))
}
