package service

// Structs for Telegram API message

type inlineKeyboardButton struct {
	Text string `json:"text"`
	URL  string `json:"url"`
}

type inlineKeyboardMarkup struct {
	InlineKeyboard [][]inlineKeyboardButton `json:"inline_keyboard"`
}

type telegramMessage struct {
	ChatID uint64 `json:"chat_id"`
	Text   string `json:"text"`
}

type telegramEditMessageWithReplyMarkup struct {
	ChatID      uint64               `json:"chat_id"`
	Text        string               `json:"text"`
	MessageID   uint64               `json:"message_id"`
	ReplyMarkup inlineKeyboardMarkup `json:"reply_markup"`
}
