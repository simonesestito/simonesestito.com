/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2022 Simone Sestito
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

exports.RECAPTCHA_SECRET_KEY = assertDeclared('RECAPTCHA_SECRET_KEY');
exports.TELEGRAM_BOT_TOKEN = assertDeclared('TELEGRAM_BOT_TOKEN');
exports.TELEGRAM_RCPT_USER = assertDeclared('TELEGRAM_RCPT_USER');
exports.API_DOMAIN = process.env.API_DOMAIN || 'https://www-api.simonesestito.com';

exports.ERROR_SERVER = 'SERVER_ERROR';
exports.ERROR_INVALID_BODY_INPUT = 'INVALID_BODY_INPUT';
exports.ERROR_INVALID_RECAPTCHA = 'INVALID_RECAPTCHA';

function assertDeclared(environmentVariableName) {
    const envVar = process.env[environmentVariableName];
    if (envVar === undefined) {
        console.log(process.env);
        throw Error('Required environment variable ' + environmentVariableName + ' not defined.');
    }
    return envVar;
}