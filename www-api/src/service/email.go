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
	// Unpin message (equivalent as "Mark as read" in standard email clients)
	err = s.telegram.UnpinMessage(request.MessageID)
	if err != nil {
		return "", "", fmt.Errorf("failed to unpin telegram message: %w", err)
	}

	emailText := fmt.Sprintf("\n\n\n----- Original Message -----\nFrom: %s <%s>\nMessage: %s",
		html.EscapeString(request.UserName),
		html.EscapeString(request.UserEmail),
		html.EscapeString(request.UserMessage),
	)

	replyMailSubject := "Re: Your message to simonesestito.com"
	mailToLink = fmt.Sprintf("mailto:%s?subject=%s&body=%s",
		html.EscapeString(request.UserEmail),
		html.EscapeString(replyMailSubject),
		html.EscapeString(emailText),
	)

	gmailBaseUrl := "https://mail.google.com/mail/"
	gmailUrlParams := url.Values{
		"authuser": {"0"},
		"view":     {"cm"},
		"fs":       {"1"},
		"to":       {html.EscapeString(request.UserEmail)},
		"su":       {html.EscapeString(replyMailSubject)},
		"body":     {html.EscapeString(emailText)},
	}
	gmailWebLink = fmt.Sprintf("%s?%s", gmailBaseUrl, gmailUrlParams.Encode())

	return
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
