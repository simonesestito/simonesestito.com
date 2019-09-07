/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const functions = require('firebase-functions');
const express = require('express');
const email = require('./endpoints/mail');

const app = express();

/*
 * Requires Content-Type: application/json
 */
app.use(express.json());

const emailRouter = express.Router();
email.registerEndpoints(emailRouter);
app.use('/api/emails', emailRouter);

exports.apiBackend = functions.https.onRequest(app);