/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2022 Simone Sestito
 * All rights reserved, including the right to copy, modify, and redistribute.
 */


const Joi = require('@hapi/joi');
const { isValidRecaptcha } = require('../services/captcha');
const { asyncHandler } = require('../utils');
const { EmailService } = require('../services/email');
const {
    ERROR_INVALID_BODY_INPUT,
    ERROR_INVALID_RECAPTCHA,
    ERROR_TOO_MANY_EMAILS
} = require('../constants');
const { sendEmailSchema } = require('../models/input/send-mail');

exports.registerEndpoints = function(router) {
    router.post('/', asyncHandler(sendEmail));
}

const emailClient = new EmailService();

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

    const userIp = req.header('fastly-temp-xff').split(', ')[0];

    // Send email to myself with user's message
    try {
        await emailClient.sendUserEmail(
            userIp,
            userName,
            userEmail,
            userMessage
        );
    } catch (e) {
        if (e.message === ERROR_TOO_MANY_EMAILS) {
            return void res.status(429).send({
                error: ERROR_TOO_MANY_EMAILS
            });
        } else {
            throw e;
        }
    }

    return void res.status(200).send({});
}