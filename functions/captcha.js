/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */
const {
    RECAPTCHA_SECRET_KEY
} = require('./constants');
const axios = require('axios').default;

exports.isValidRecaptcha = async function(clientCode) {
    try {
        const response = await axios.post('https://recaptcha.google.com/recaptcha/api/siteverify', {
            secret: RECAPTCHA_SECRET_KEY,
            response: clientCode
        });
        return response.success;
    } catch (e) {
        console.error(e);
        return false;
    }
}