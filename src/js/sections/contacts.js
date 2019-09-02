/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

import { doOnNextFrame, px, waitMillis } from '../utils';

const envelope = document.querySelector('#contacts .envelope');
const paper = document.querySelector('#contacts form.paper');
const paperFilling = document.querySelector('#contacts .paper-filling');
const closureFlap = document.querySelector('#contacts .closure-flap');
const submitCheck = document.querySelector('#contacts .paper .submit-check');
const submitButton = document.querySelector('#contacts .paper input[type=submit]');
const emailErrorDisplay = document.getElementById('contacts-email-error');

const recaptchaContainerId = 'contacts-recaptcha';
let emailPromise;

/**
 * First animation step.
 * Should be called on submit.
 */
async function showCaptcha() {
    const currEnvelopeMarginTop = px(window.getComputedStyle(envelope).marginTop);
    const submitCheckHeight = px(window.getComputedStyle(submitCheck).height);

    await doOnNextFrame(() => {
        envelope.style.marginTop = currEnvelopeMarginTop + submitCheckHeight + 'px';
        submitCheck.style.opacity = '1';
        submitButton.style.opacity = '0';
    });

    // Explicitly load ReCaptcha
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    grecaptcha.render(recaptchaContainerId, {
        sitekey: '6LeRJ7YUAAAAADY5ZFtshqLYuRSjyA3tGbtt6azi',
        theme: isDark ? 'dark' : 'light',
        callback(recaptchaToken) {
            emailPromise = sendEmail(recaptchaToken);
            sendEmailAnimation();
        }
    });
}

paper.addEventListener('submit', e => {
    e.preventDefault();
    showCaptcha();
});

/**
 * Second animation step.
 * Should be called after captcha challenge.
 */
async function sendEmailAnimation() {
    const envelopeHeight = px(window.getComputedStyle(envelope).height);
    const {
        height,
        paddingTop
    } = window.getComputedStyle(paper);
    const newPaperHeight = envelopeHeight - px(paddingTop);

    await doOnNextFrame(() => {
        paper.style.height = height;
    });

    await doOnNextFrame(() => {
        paper.style.paddingBottom = '0px';
        paper.style.height = newPaperHeight + 'px';
        paperFilling.style.height = '100px';
        envelope.style.marginTop = `-${envelopeHeight}px`;
    });

    await waitMillis(1000);
    // Attribute triggers transform animation from CSS
    closureFlap.setAttribute('data-flipped', 'true');

    await waitMillis(1000);
    // Handle emailPromise
    await emailPromise.then(() => {
        // TODO Display success
    }, err => {
        // TODO Display error mark

        console.error(err);
        switch (err.message) {
            case 'INTERNET_ERROR':
                emailErrorDisplay.textContent = 'Internet connection required.'
                break;
            case 'SERVER_ERROR':
                emailErrorDisplay.textContent = 'Server error processing the request';
                break;
            case 'INVALID_BODY_INPUT':
                emailErrorDisplay.textContent = 'Invalid data inserted. Refresh the page and retry inserting correct data';
                break;
            case 'INVALID_RECAPTCHA':
                emailErrorDisplay.textContent = 'ReCaptcha verification failed'
                break;
            case 'INVALID_USER_EMAIL':
                emailErrorDisplay.textContent = 'Invalid email address inserted';
                break;
            default:
                emailErrorDisplay.textContent = 'An error occurred sending the email';
        }
    });
}

/**
 * Send the email calling the remote endpoint
 */
async function sendEmail(recaptchaToken) {
    const messageDiv = document.querySelector('#contacts form.paper [contenteditable][name="message"]');
    try {
        const response = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: paper.elements.name.value,
                userEmail: paper.elements.email.value,
                userMessage: messageDiv.textContent,
                clientCaptcha: recaptchaToken
            })
        });

        if (response.ok) {
            return; // Success
        }

        const { error } = await response.json();
        return Promise.reject(new Error(error));
    } catch (e) {
        return Promise.reject(new Error('INTERNET_ERROR'));
    }
}