/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const { firestore } = require('firebase-admin');

exports.UserRepository = class {
    async getUserByIp(ipAddress) {
        const usersQuery = await firestore()
            .collection('users')
            .where('ipAddress', '==', ipAddress)
            .get();

        if (usersQuery.empty) {
            // User not found
            return null;
        }

        const userRef = usersQuery.docs[0];
        const userData = userRef.data();
        userData.id = userRef.id;
        return userData;
    }

    async getOrCreateUserByIp(ipAddress) {
        const existingUser = await this.getUserByIp(ipAddress);
        if (existingUser) {
            // User already exists

            // Add empty emailDates if not included
            if (!existingUser.emailDates) {
                existingUser.emailDates = [];
            }
            
            return existingUser;
        }

        const newUserData = {
            ipAddress,
            emailDates: []
        };

        const { id } = await firestore()
            .collection('users')
            .add({ ipAddress });

        newUserData.id = id;
        return newUserData;
    }
    async addEmailDateToUser(userId, emailDate) {
        await firestore()
            .doc(`users/${userId}`)
            .update({
                emailDates: firestore.FieldValue.arrayUnion(emailDate)
            });
    }
    async removeEmailDateFromUser(userId, emailDate) {
        await firestore()
            .doc(`users/${userId}`)
            .update({
                emailDates: firestore.FieldValue.arrayRemove(emailDate)
            });
    }
}