package api

import (
	"fmt"
	"net/http"
	"www-api/src/model"
)

func (r *router) sendEmail(res http.ResponseWriter, req *http.Request) {
	var sendEmailRequest model.SendEmailRequest
	err := readJsonBody(req, res, r.context.JsonValidator, &sendEmailRequest)
	if err != nil {
		r.context.Log.Warnf("sendEmail: error reading JSON body: %v", err.InternalError())
		http.Error(res, err.ErrorCode(), err.StatusCode())
		return
	}

	_, _ = res.Write([]byte("Send email endpoint is not implemented yet"))
	_, _ = res.Write([]byte(fmt.Sprintf("\n%+v", sendEmailRequest)))
}
