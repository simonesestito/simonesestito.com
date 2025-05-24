package api

import (
	"fmt"
	"net/http"
	"www-api/src/model"
)

func (r *router) replyToEmail(res http.ResponseWriter, req *http.Request) {
	var replyEmailRequest model.ReplyEmailRequest
	err := readGetQueryParameters(req, r.context.UrlValuesDecoder, r.context.JsonValidator, &replyEmailRequest)
	if err != nil {
		r.context.Log.Warnf("replyToEmail: error reading params: %v", err.InternalError())
		http.Error(res, err.ErrorCode(), err.StatusCode())
		return
	}

	_, _ = res.Write([]byte("Reply to email endpoint is not implemented yet"))
	_, _ = res.Write([]byte(fmt.Sprintf("\n%+v", replyEmailRequest)))
}
