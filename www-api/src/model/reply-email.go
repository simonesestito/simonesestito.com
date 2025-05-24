package model

type ReplyEmailRequest struct {
	UserName    string `json:"userName" validate:"required"`
	UserEmail   string `json:"userEmail" validate:"required,email"`
	UserMessage string `json:"userMessage" validate:"required"`
	MessageID   int    `json:"messageId" validate:"required"` // ID of the Telegram notification message to unpin
}
