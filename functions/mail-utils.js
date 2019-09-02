/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

const dns = require('dns');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const {
    DNS_SERVERS,
    GMAIL_CLIENT_ID,
    GMAIL_SECRET,
    GMAIL_REDIRECT_URL,
    GMAIL_REFRESH_TOKEN,
    MAIL_SELF_FROM,
    MAIL_SELF_TO
} = require('./constants');
const { stringifyHeaders } = require('./utils');

dns.setServers(DNS_SERVERS);

exports.mxLookup = async function(host) {
    return new Promise(res => {
        dns.resolveMx(host, (err, addrs) => {
            if (err) {
                console.error(err);
                return void res(null);
            }

            const { exchange } = addrs.reduce((prev, curr) => {
                if (!prev || prev.priority > curr.priority)
                    return curr;
                else
                    return prev;
            });
            return void res(exchange);
        });
    });
}

exports.createGmailClient = function() {
    const oauthClient = new OAuth2(
        GMAIL_CLIENT_ID,
        GMAIL_SECRET,
        GMAIL_REDIRECT_URL
    );

    oauthClient.setCredentials({
        refresh_token: GMAIL_REFRESH_TOKEN
    });

    return google.gmail({
        version: 'v1',
        auth: oauthClient
    });
}

exports.sendSelfMail = async function(gmail, {
    userEmail,
    userMessage,
    userName
}) {
    return sendMail(gmail, {
        from: MAIL_SELF_FROM,
        to: MAIL_SELF_TO,
        replyTo: `"${userName}" <${userEmail}>`,
        subject: `"${userName}" via simonesestito.com`,
        message: userMessage
    });
}

exports.deleteMail = async function(gmail, mailId) {
    return gmail.users.messages.delete({
        userId: 'me',
        id: mailId
    });
}

/* private */
async function sendMail(gmail, {
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

    const res = await gmail.users.messages.send({
        userId: 'me',
        resource: {
            raw: encodedRaw
        }
    });

    return res.data.id;
}