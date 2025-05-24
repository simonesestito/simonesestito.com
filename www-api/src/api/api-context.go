package api

import (
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/schema"
	"github.com/sirupsen/logrus"
	"www-api/src/service"
)

type apiContext struct {
	Log              *logrus.Logger      // Logger for logging purposes
	JsonValidator    *validator.Validate // Validator for validating request JSON data
	UrlValuesDecoder *schema.Decoder     // Decoder for decoding URL values, like query parameters

	// Services and other dependencies here
	emailService   service.EmailService
	captchaService service.CaptchaService
}
