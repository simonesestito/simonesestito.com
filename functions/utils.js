/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

const { ERROR_SERVER } = require('./constants');

exports.htmlEncode = function(unsafe) {
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

exports.stringifyHeaders = function(headers) {
    return Object.keys(headers)
        .map(key => ({ key, value: headers[key] }))
        .map(({ key, value }) => {
            // Remove newlines from value
            value = String(value)
                .replace(/(\r\n|\n|\r)/gm, ' ')
                .trim();

            return `${key.trim()}: ${value}`;
        }).join('\n');
}

exports.asyncHandler = function(handler) {
    return (req, res, next) => {
        handler(req, res, next).catch(err => {
            console.error(err);
            res.status(500).send({
                error: ERROR_SERVER
            })
        });
    };
}