/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2023 Simone Sestito
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const express = require('express');
const cors = require('cors');
const email = require('./endpoints/mail');

const app = express();

app.use(cors({
    origin: 'https://simonesestito.com',
    methods: [ 'POST' ],
}));

/*
 * Requires Content-Type: application/json
 */
app.use(express.json());

const emailRouter = express.Router();
email.registerEndpoints(emailRouter);
app.use('/api/emails', emailRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Server started on port', port));