package api

import (
	"fmt"
	"net/http"
	"www-api/src/model"
)

func (r *_router) sendEmail(res http.ResponseWriter, req *http.Request) {
	var sendEmailRequest model.SendEmailRequest
	displayError, err := readJsonBody(req, res, r.context.Validator, &sendEmailRequest)
	if err != nil {
		r.context.Log.Warnf("sendEmail: error reading JSON body: %v", err)
		http.Error(res, displayError, http.StatusBadRequest)
		return
	}

	_, _ = res.Write([]byte("Send email endpoint is not implemented yet"))
	_, _ = res.Write([]byte(fmt.Sprintf("\n%v", sendEmailRequest)))
}
