/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2022 Simone Sestito
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const Joi = require('@hapi/joi');
const { isValidRecaptcha } = require('../services/captcha');
const { asyncHandler } = require('../utils');
const { ERROR_INVALID_BODY_INPUT, ERROR_INVALID_RECAPTCHA } = require('../constants');
const { sendEmailSchema, replyEmailSchema } = require('../models/input/send-mail');
const { TelegramService } = require('../services/telegram');


exports.registerEndpoints = function (router) {
    router.post('/', asyncHandler(sendEmail));
    router.get('/reply', replyToEmail);
}

const telegramBot = new TelegramService();

async function sendEmail(req, res) {
    // Validate body with Joi
    const { value, error } = Joi.validate(req.body, sendEmailSchema);
    if (error) {
        return void res.status(422).send({
            error: ERROR_INVALID_BODY_INPUT
        });
    }

    const {
        userName,
        userEmail,
        userMessage,
        clientCaptcha
    } = value;

    // Check ReCaptcha
    if (!(await isValidRecaptcha(clientCaptcha))) {
        return void res.status(400).send({
            error: ERROR_INVALID_RECAPTCHA
        });
    }

    // Send email to myself with user's message
    await telegramBot.sendUserEmail(
        userName,
        userEmail,
        userMessage
    );

    return void res.status(200).send({});
}

function replyToEmail(req, res) {
    // Validate body with Joi
    const { value, error } = Joi.validate(req.query, replyEmailSchema);
    if (error) {
        return void res.status(422).send({
            error: ERROR_INVALID_BODY_INPUT
        });
    }

    const { userName, userEmail, userMessage } = value;

    const mailText = `\n\n
        ----- Original Message -----
        From: ${userName} <${userEmail}>
        Message: ${userMessage}`.split('\n').map(s => s.trim()).join('\n');

    const mailToLink = `mailto:${userEmail}&text=${encodeURIComponent(mailText)}`;
    const gmailWebLink = `https://mail.google.com/mail/?authuser=1&view=cm&fs=1&to=${userEmail}&body=${encodeURIComponent(mailText)}`;

    return void res.status(200).send(`
    <html>
    <body>
    <p><a href="${mailToLink}">Reply (mailto)</a></p>
    <p><a href="${gmailWebLink}">Reply (Gmail web)</a></p>
    </body>
    </html>
    `);
}