package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/schema"
	"io"
	"net/http"
)

func readJsonBody(r *http.Request, w http.ResponseWriter, validate *validator.Validate, out interface{}) (displayError string, err error) {
	// Read the request body, as a JSON object
	// It takes the request body and decodes it into the provided struct.
	//
	// It returns the request body as a string and an error if any.
	// The string is the error message that can be used to send a response to the client.
	// The error is the actual internal error that can be logged.
	// If everything is ok, it returns an empty string and nil error.

	// Check the content type
	if r.Header.Get("Content-Type") != "application/json" {
		displayError = "Content-Type is not application/json"
		err = fmt.Errorf("%s", displayError)
		return
	}

	// Enforce a maximum size for the request body
	r.Body = http.MaxBytesReader(w, r.Body, 1024*1024) // 1 MB

	// Decode the request body into the provided struct
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields() // Disallow unknown fields in the JSON
	err = decoder.Decode(out)
	if err != nil {
		displayError = "Malformed JSON body"
		return
	}

	// Call decode again, using a pointer to an empty anonymous struct as
	// the destination. If the request body only contained a single JSON
	// object this will return an io.EOF error. So if we get anything else,
	// we know that there is additional data in the request body.
	err = decoder.Decode(&struct{}{})
	if !errors.Is(err, io.EOF) {
		displayError = "Request body must only contain a single JSON object"
		err = fmt.Errorf("%s: %w", displayError, err)
		return
	}

	err = validateStruct(validate, out)
	if err != nil {
		displayError = "Invalid JSON body"
		return
	}

	return "", nil
}

func readGetQueryParameters(r *http.Request, decoder *schema.Decoder, validate *validator.Validate, out interface{}) (displayError string, err error) {
	// Read the GET query parameters from the request and decode them into the provided struct.
	// It returns the request body as a string and an error if any.
	// The string is the error message that can be used to send a response to the client.
	// The error is the actual internal error that can be logged.
	// If everything is ok, it returns an empty string and nil error.
	decoder.MaxSize(1024 * 1024)

	// Decode the request body into the provided struct
	query := r.URL.Query()
	err = decoder.Decode(out, query)
	if err != nil {
		displayError = "Invalid query parameters"
		return
	}

	err = validateStruct(validate, out)
	if err != nil {
		displayError = "Invalid query parameters"
		return
	}

	return "", nil
}

func validateStruct(validate *validator.Validate, out interface{}) error {
	// Validate the struct using the validator
	err := validate.Struct(out)
	if err != nil {
		validationErrors := validator.ValidationErrors{}
		if !errors.As(err, &validationErrors) {
			return fmt.Errorf("%s: %w", "Unexpected error validating body input", err)
		}

		msg := "Validation error"
		if len(validationErrors) > 0 {
			validationError := validationErrors[0]
			msg = fmt.Sprintf("%s %s %s",
				validationError.Namespace(),
				validationError.Tag(),
				validationError.Param())
		}
		return fmt.Errorf("%s: %s", "Invalid struct", msg)
	}

	return nil
}
