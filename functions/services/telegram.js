/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2023 Simone Sestito
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const { htmlEncode } = require('../utils');
const rp = require('request-promise');
const { TELEGRAM_BOT_TOKEN, TELEGRAM_RCPT_USER, API_DOMAIN } = require('../constants');

exports.TelegramService = class {
    async sendUserEmail(userName, userEmail, userMessage) {
        userName = htmlEncode(userName);
        userMessage = htmlEncode(userMessage);

        // Compose Telegram message to send to myself
        const telegramMessage = `<b>New mail received from Portfolio Website!</b>

        <b>From:</b> ${userName} (${userEmail})
        <b>Message:</b> ${userMessage}`.split('\n').map(s => s.trim()).join('\n');

        // First, send a mock message to obtain a valid message ID
        const sentMessage = await rp(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            json: true,
            body: {
                chat_id: TELEGRAM_RCPT_USER,
                text: 'New email!',
            },
        });

        // Then, edit that message with the actual content.
        // At this point, we also have the real message ID
        await rp(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
            method: 'POST',
            json: true,
            body: {
                chat_id: TELEGRAM_RCPT_USER,
                text: telegramMessage,
                message_id: sentMessage.result.message_id,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Reply',
                                url: `${API_DOMAIN}/api/emails/reply
                                ?userName=${encodeURIComponent(userName)}
                                &userEmail=${encodeURIComponent(userEmail)}
                                &userMessage=${encodeURIComponent(userMessage)}
                                &messageId=${sentMessage.result.message_id}`.split('\n').map(s => s.trim()).join(''),
                            },
                        ],
                    ],
                },
            },
        });

        // Pin sent message
        await rp(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/pinChatMessage`, {
            method: 'POST',
            json: true,
            body: {
                chat_id: TELEGRAM_RCPT_USER,
                message_id: sentMessage.result.message_id,
            },
        });
    }

    async unpinMessage(messageId) {
        await rp(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/unpinChatMessage`, {
            method: 'POST',
            json: true,
            body: {
                chat_id: TELEGRAM_RCPT_USER,
                message_id: messageId,
            },
        });
    }
}