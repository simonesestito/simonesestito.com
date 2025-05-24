package errors

import "net/http"

type serverError struct {
	internalError error
}

func NewServerError(err error) HTTPError {
	return &serverError{
		internalError: err,
	}
}

func (e *serverError) Error() string {
	return e.internalError.Error()
}

func (e *serverError) InternalError() error {
	return e.internalError
}

func (e *serverError) StatusCode() int {
	return http.StatusInternalServerError
}

func (e *serverError) ErrorCode() string {
	return "SERVER_ERROR"
}
