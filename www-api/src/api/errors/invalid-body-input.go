package errors

import "net/http"

type invalidBodyInput struct {
	internalError error
}

func NewInvalidBodyInput(err error) HTTPError {
	return &invalidBodyInput{
		internalError: err,
	}
}

func (e *invalidBodyInput) Error() string {
	return e.internalError.Error()
}

func (e *invalidBodyInput) InternalError() error {
	return e.internalError
}

func (e *invalidBodyInput) StatusCode() int {
	return http.StatusUnprocessableEntity
}

func (e *invalidBodyInput) ErrorCode() string {
	return "INVALID_BODY_INPUT"
}
