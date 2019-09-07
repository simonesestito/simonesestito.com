/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const { GmailApi } = require('./gmail');
const { UserRepository } = require('../repositories/user-repository')
const {
    ANTISPAM_PROTECTION_ENABLED,
    ANTISPAM_MILLIS_LIMIT,
    ANTISPAM_EMAILS_LIMIT,
    ERROR_TOO_MANY_EMAILS
} = require('../constants');
const { htmlEncode } = require('../utils');

exports.EmailService = class {
    constructor() {
        this.api = new GmailApi();
        this.userRepository = new UserRepository();
    }

    async sendUserEmail(userIp, userName, userEmail, userMessage) {
        let user = null; // Null if antispam is disabled
        if (ANTISPAM_PROTECTION_ENABLED) {
            user = await this.userRepository.getOrCreateUserByIp(userIp);

            const oldRequests = user.emailDates
                .filter(reqDate => reqDate < Date.now() - ANTISPAM_MILLIS_LIMIT);
            const recentRequests = user.emailDates
                .filter(reqDate => reqDate >= Date.now() - ANTISPAM_MILLIS_LIMIT);

            // Remove old requests from database
            if (oldRequests.length > 0) {
                await Promise.all(oldRequests.map(oldDate => {
                    return this.userRepository.removeEmailDateFromUser(user.id, oldDate);
                }));
            }

            if (recentRequests.length >= ANTISPAM_EMAILS_LIMIT) {
                throw new Error(ERROR_TOO_MANY_EMAILS);
            }
            // Else, continue and add the current request to the database
            // only if the email is successfully sent
        }

        // Sanitize user input
        userName = htmlEncode(userName).replace(/['"]+/g, '');
        userMessage = htmlEncode(userMessage).replace(/\n/gm, '<br>');

        const mailId = await this.api.sendSelfMail({
            userEmail,
            userMessage,
            userName
        });
        await this.api.deleteMail(mailId);

        // Email successfully sent
        if (ANTISPAM_PROTECTION_ENABLED) {
            // Add the current request to the database
            await this.userRepository.addEmailDateToUser(user.id, Date.now());
        }
    }
}