package api

import "net/http"

func (r *_router) sendEmail(res http.ResponseWriter, req *http.Request) {
	_, _ = res.Write([]byte("Send email endpoint is not implemented yet"))
}
