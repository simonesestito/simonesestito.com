/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2021 Simone Sestito
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const Joi = require('@hapi/joi');

exports.sendEmailSchema = Joi.object().keys({
    userName: Joi.string().min(1).required(),
    userEmail: Joi.string().email({ minDomainSegments: 2 }).required(),
    userMessage: Joi.string().min(1).required(),
    clientCaptcha: Joi.string().required()
});