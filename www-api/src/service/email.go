package service

import (
	"fmt"
	"github.com/gorilla/schema"
	"html"
	"net/url"
	"www-api/src/model"
)

type EmailService interface {
	ReceiveEmail(request model.SendEmailRequest) error
	ReplyToEmail(request model.ReplyEmailRequest) (mailToLink string, gmailWebLink string, err error)
}

type emailService struct {
	apiDomain string
	telegram  Telegram
}

func NewEmailService(apiDomain string, telegram Telegram) EmailService {
	return &emailService{
		apiDomain: apiDomain,
		telegram:  telegram,
	}
}

func (s *emailService) ReceiveEmail(request model.SendEmailRequest) error {
	// First, send a mock message to obtain a valid message ID
	messageId, err := s.telegram.SendMessage("New email!")
	if err != nil {
		return fmt.Errorf("failed to send telegram message: %w", err)
	}

	// Then, edit that message with the actual content.
	// At this point, we also have the real message ID

	notificationHeadline := "New mail received from Portfolio Website!"
	telegramTextMessage := fmt.Sprintf("<b>%s</b>\n\n<b>From:</b> %s (%s)\n<b>Message:</b> %s",
		notificationHeadline,
		html.EscapeString(request.UserName),
		request.UserEmail,
		html.EscapeString(request.UserMessage),
	)
	replyUrl, err := s.buildReplyURL(request, messageId)

	err = s.telegram.EditMessageWithButton(messageId, telegramTextMessage, "Reply", replyUrl)
	if err != nil {
		return fmt.Errorf("failed to edit telegram message: %w", err)
	}

	err = s.telegram.PinMessage(messageId)
	if err != nil {
		return fmt.Errorf("failed to pin telegram message: %w", err)
	}

	return nil
}

func (s *emailService) ReplyToEmail(request model.ReplyEmailRequest) (mailToLink string, gmailWebLink string, err error) {

}

// BuildReplyURL allows to build the URL to reply to an email.
func (s *emailService) buildReplyURL(request model.SendEmailRequest, messageId uint64) (string, error) {
	u := fmt.Sprintf("%s/api/emails/reply", s.apiDomain)
	paramsStruct := model.ReplyEmailRequest{
		UserName:    request.UserName,
		UserEmail:   request.UserEmail,
		UserMessage: request.UserMessage,
		MessageID:   messageId,
	}

	paramsMap := make(url.Values)
	err := schema.NewEncoder().Encode(paramsStruct, paramsMap)
	if err != nil {
		return "", fmt.Errorf("failed to encode parameters: %w", err)
	}

	return fmt.Sprintf("%s?%s", u, paramsMap.Encode()), nil
}
