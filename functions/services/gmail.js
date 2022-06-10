/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2022 Simone Sestito
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const {
    GMAIL_CLIENT_ID,
    GMAIL_SECRET,
    GMAIL_REDIRECT_URL,
    GMAIL_REFRESH_TOKEN,
    MAIL_SELF_FROM,
    MAIL_SELF_TO
} = require('../constants');
const { stringifyHeaders } = require('../utils');

exports.GmailApi = class {
    constructor() {
        const oauthClient = new OAuth2(
            GMAIL_CLIENT_ID,
            GMAIL_SECRET,
            GMAIL_REDIRECT_URL
        );

        oauthClient.setCredentials({
            refresh_token: GMAIL_REFRESH_TOKEN,
            scope: "https://mail.google.com/",
            token_type: "Bearer",
        });

        this.gmail = google.gmail({
            version: 'v1',
            auth: oauthClient
        });
    }

    async sendMail({
        from,
        to,
        replyTo,
        subject,
        message
    }) {
        const headers = stringifyHeaders({
            'From': from,
            'To': to,
            'Content-type': 'text/html;charset=iso-8859-1',
            'MIME-Version': '1.0',
            'Subject': subject,
            'Reply-To': replyTo || from
        });

        const raw = `${headers}\n` +
            '\n' +
            `${message}\n`;

        const encodedRaw = Buffer.from(raw)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        const res = await this.gmail.users.messages.send({
            userId: 'me',
            resource: {
                raw: encodedRaw
            }
        });

        return res.data.id;
    }

    async sendSelfMail({
        userEmail,
        userMessage,
        userName
    }) {
        return this.sendMail({
            from: MAIL_SELF_FROM,
            to: MAIL_SELF_TO,
            replyTo: `"${userName}" <${userEmail}>`,
            subject: `"${userName}" via simonesestito.com`,
            message: userMessage
        });
    }

    async deleteMail(mailId) {
        return this.gmail.users.messages.delete({
            userId: 'me',
            id: mailId
        });
    }
}