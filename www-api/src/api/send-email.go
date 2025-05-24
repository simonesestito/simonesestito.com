package api

import (
	"net/http"
	"www-api/src/api/errors"
	"www-api/src/model"
)

func (r *router) sendEmail(res http.ResponseWriter, req *http.Request) {
	var sendEmailRequest model.SendEmailRequest
	httpErr := readJsonBody(req, res, r.context.JsonValidator, &sendEmailRequest)
	if httpErr != nil {
		r.context.Log.Warnf("sendEmail: error reading JSON body: %v", httpErr.InternalError())
		http.Error(res, httpErr.ErrorCode(), httpErr.StatusCode())
		return
	}

	isCaptchaValid, err := r.context.captchaService.IsCaptchaValid(sendEmailRequest.ClientCaptcha)
	if err != nil {
		httpErr = errors.NewServerError(err)
		r.context.Log.Errorf("sendEmail: error validating captcha: %v", httpErr.InternalError())
		http.Error(res, httpErr.ErrorCode(), httpErr.StatusCode())
		return
	}

	if !isCaptchaValid {
		httpErr = errors.NewInvalidCaptcha()
		r.context.Log.Warnf("sendEmail: invalid captcha")
		http.Error(res, httpErr.ErrorCode(), httpErr.StatusCode())
		return
	}

	err = r.context.emailService.ReceiveEmail(sendEmailRequest)
	if err != nil {
		httpErr = errors.NewServerError(err)
		r.context.Log.Errorf("sendEmail: error sending email: %v", httpErr.InternalError())
		http.Error(res, httpErr.ErrorCode(), httpErr.StatusCode())
		return
	}

	res.WriteHeader(http.StatusOK)
	_, _ = res.Write([]byte("{}"))
}
