package service

type Telegram interface {
	SendMessage(text string) (uint64, error)
	EditMessageWithButton(messageID uint64, text string, buttonText string, buttonURL string) error
	PinMessage(messageID uint64) error
	UnpinMessage(messageID uint64) error
}

type telegram struct {
	httpClient  HttpClient
	botToken    string
	ownerChatID uint64
}

func NewTelegramService(botToken string, ownerChatID uint64, httpClient HttpClient) Telegram {
	return &telegram{
		httpClient:  httpClient,
		botToken:    botToken,
		ownerChatID: ownerChatID,
	}
}

func (t *telegram) SendMessage(text string) (uint64, error) {
	// TODO: Implement the logic to send a message using the Telegram Bot API
	return 0, nil
}

func (t *telegram) editMessage(messageID uint64, text string, replyMarkup inlineKeyboardMarkup) error {
	// TODO: Implement the logic to edit a message using the Telegram Bot API
	return nil
}

func (t *telegram) EditMessageWithButton(messageID uint64, text string, buttonText string, buttonURL string) error {
	replyMarkup := inlineKeyboardMarkup{
		InlineKeyboard: [][]inlineKeyboardButton{
			{
				{
					Text: buttonText,
					URL:  buttonURL,
				},
			},
		},
	}
	return t.editMessage(messageID, text, replyMarkup)
}

func (t *telegram) PinMessage(messageID uint64) error {
	// TODO: Implement the logic to pin a message using the Telegram Bot API
	return nil
}

func (t *telegram) UnpinMessage(messageID uint64) error {
	// TODO: Implement the logic to unpin a message using the Telegram Bot API
	return nil
}
