package errors

type HTTPError interface {
	error
	InternalError() error
	StatusCode() int
	ErrorCode() string
}
