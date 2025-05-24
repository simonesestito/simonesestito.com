package model

type ReplyEmailRequest struct {
	UserName    string `schema:"userName,required"`
	UserEmail   string `schema:"userEmail,required"`
	UserMessage string `schema:"userMessage,required"`
	MessageID   int    `schema:"messageId,required" validate:"required,min=1"`
}
