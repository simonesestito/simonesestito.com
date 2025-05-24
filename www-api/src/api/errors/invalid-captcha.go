package errors

import (
	"fmt"
	"net/http"
)

type invalidCaptcha struct {
	internalError error
}

func NewInvalidCaptcha() HTTPError {
	return &invalidCaptcha{
		internalError: fmt.Errorf("invalid captcha"),
	}
}

func (e *invalidCaptcha) Error() string {
	return e.internalError.Error()
}

func (e *invalidCaptcha) InternalError() error {
	return e.internalError
}

func (e *invalidCaptcha) StatusCode() int {
	return http.StatusBadRequest
}

func (e *invalidCaptcha) ErrorCode() string {
	return "INVALID_RECAPTCHA"
}
