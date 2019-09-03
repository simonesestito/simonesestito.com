/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

const functions = require('firebase-functions');
const express = require('express');
const Joi = require('@hapi/joi');
const { isValidRecaptcha } = require('./captcha');
const { htmlEncode, asyncHandler } = require('./utils');
const {
    createGmailClient,
    sendSelfMail,
    deleteMail,
    mxLookup
} = require('./mail-utils');
const {
    ERROR_INVALID_BODY_INPUT,
    ERROR_INVALID_RECAPTCHA,
    ERROR_INVALID_USER_EMAIL
} = require('./constants');

const app = express();

/*
 * Requires Content-Type: application/json
 */
app.use(express.json());

// TODO -- Add CORS

const sendEmailSchema = Joi.object().keys({
    userName: Joi.string().min(1).required(),
    userEmail: Joi.string().email({ minDomainSegments: 2 }).required(),
    userMessage: Joi.string().min(1).required(),
    clientCaptcha: Joi.string().required()
});
app.post('/api/sendEmail', asyncHandler(async(req, res) => {
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
    userMessage = htmlEncode(userMessage);

    // Validate email against MX record
    const host = userEmail.split('@')[1];
    const exchange = await mxLookup(host);
    if (!exchange) {
        return void res.status(400).send({
            error: ERROR_INVALID_USER_EMAIL
        });
    }

    // Send email to myself with user's message
    const gmail = createGmailClient();
    const mailId = await sendSelfMail(gmail, {
        userEmail,
        userName,
        userMessage
    });
    await deleteMail(gmail, mailId);

    return void res.status(200).send({});
}));

exports.apiBackend = functions.https.onRequest(app);