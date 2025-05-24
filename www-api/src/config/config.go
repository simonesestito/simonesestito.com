package config

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"log"
	"os"
)

type Config struct {
	Log *logrus.Logger

	// Environment variables configuration
	CaptchaSecretKey string
	TelegramBotToken string
	TelegramChatId   uint64
	ApiDomain        string
}

func LoadConfig() *Config {
	config := &Config{
		Log: logrus.New(),
	}

	// Load environment variables or set defaults
	config.CaptchaSecretKey = requireEnv("RECAPTCHA_SECRET_KEY")
	config.TelegramBotToken = requireEnv("TELEGRAM_BOT_TOKEN")

	telegramChatIdStr := requireEnv("TELEGRAM_RCPT_USER")
	n, err := fmt.Sscanf(telegramChatIdStr, "%d", &config.TelegramChatId)
	if err != nil || n != 1 {
		log.Fatalf("Invalid TELEGRAM_RCPT_USER: %s, must be an integer", telegramChatIdStr)
	}

	config.ApiDomain = requireEnv("API_DOMAIN")

	return config
}

func requireEnv(key string) string {
	value := os.Getenv(key)
	if value == "" {
		log.Fatalf("Required environment variable '%s' is not set\n", key)
	}
	return value
}
