package model

type SendEmailRequest struct {
	UserName      string `json:"userName" validate:"required"`
	UserEmail     string `json:"userEmail" validate:"required,email"`
	UserMessage   string `json:"userMessage" validate:"required"`
	ClientCaptcha string `json:"clientCaptcha" validate:"required"`
}
