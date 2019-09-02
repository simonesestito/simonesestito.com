/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */
const functions = require('firebase-functions');

exports.DNS_SERVERS = Object.freeze([
    '8.8.8.8',
    '8.8.4.4',
    '1.1.1.1'
]);

exports.RECAPTCHA_SECRET_KEY = functions.config().recaptcha.secretkey;
exports.GMAIL_CLIENT_ID = functions.config().gmail.clientid;
exports.GMAIL_SECRET = functions.config().gmail.secret;
exports.GMAIL_REDIRECT_URL = functions.config().gmail.redirect;
exports.GMAIL_REFRESH_TOKEN = functions.config().gmail.refreshtoken;
exports.MAIL_SELF_FROM = functions.config().mailself.from;
exports.MAIL_SELF_TO = functions.config().mailself.to;

exports.ERROR_SERVER = 'SERVER_ERROR';
exports.ERROR_INVALID_BODY_INPUT = 'INVALID_BODY_INPUT';
exports.ERROR_INVALID_RECAPTCHA = 'INVALID_RECAPTCHA';
exports.ERROR_INVALID_USER_EMAIL = 'INVALID_USER_EMAIL';