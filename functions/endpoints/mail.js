/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 * All rights reserved, including the right to copy, modify, and redistribute.
 */


const Joi = require('@hapi/joi');
const { isValidRecaptcha } = require('../services/captcha');
const { htmlEncode, asyncHandler } = require('../utils');
const {
    createGmailClient,
    sendSelfMail,
    deleteMail
} = require('../services/mail-service');
const {
    ERROR_INVALID_BODY_INPUT,
    ERROR_INVALID_RECAPTCHA,
} = require('../constants');
const { sendEmailSchema } = require('../models/input/send-mail');

exports.registerEndpoints = function(router) {
    router.post('/', asyncHandler(sendEmail));
}

async function sendEmail(req, res) {
    // Validate body with Joi
    const { value, error } = Joi.validate(req.body, sendEmailSchema);
    if (error) {
        return void res.status(422).send({
            error: ERROR_INVALID_BODY_INPUT
        });
    }
    let {
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

    // Sanitize user input
    userName = htmlEncode(userName).replace(/['"]+/g, '');
    userMessage = htmlEncode(userMessage).replace(/\n/gm, '<br>');

    // Send email to myself with user's message
    const gmail = createGmailClient();
    const mailId = await sendSelfMail(gmail, {
        userEmail,
        userName,
        userMessage
    });
    await deleteMail(gmail, mailId);

    return void res.status(200).send({});
}