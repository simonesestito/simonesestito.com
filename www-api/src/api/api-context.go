package api

import (
	"github.com/go-playground/validator/v10"
	"github.com/sirupsen/logrus"
)

type apiContext struct {
	Log       *logrus.Logger      // Logger for logging purposes
	Validator *validator.Validate // Validator for validating request data
	// TODO: Add services and other dependencies here
}
