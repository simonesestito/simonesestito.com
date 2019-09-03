/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */
const {
    RECAPTCHA_SECRET_KEY
} = require('./constants');
const rp = require('request-promise');

exports.isValidRecaptcha = async function(clientCode) {
    try {
        const { success } = await rp('https://recaptcha.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            json: true,
            formData: {
                secret: RECAPTCHA_SECRET_KEY,
                response: clientCode
            }
        })
        return success;
    } catch (e) {
        console.error(e);
        return false;
    }
}