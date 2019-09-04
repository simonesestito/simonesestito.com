/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

import { doOnNextFrame, px, waitMillis } from '../utils';

const envelopeBack = document.querySelector('#contacts .envelope-back');
const paper = document.querySelector('#contacts form.paper');
const closureFlap = document.querySelector('#contacts .closure-flap');
const submitCheck = document.querySelector('#contacts .paper .submit-check');
const submitButton = document.querySelector('#contacts .paper input[type=submit]');
const emailErrorDisplay = document.getElementById('contacts-email-error');
const errorResultMark = document.querySelector('#contacts .mail-container .result.error');
const successResultMark = document.querySelector('#contacts .mail-container .result.success');
const messageDiv = document.querySelector('#contacts form.paper [contenteditable][name="message"]');
const formError = document.querySelector('#contacts form.paper .form-error')

const recaptchaContainerId = 'contacts-recaptcha';
let emailPromise;

/**
 * First animation step.
 * Should be called on submit.
 */
async function showCaptcha() {
    const envelopeHeight = px(window.getComputedStyle(envelopeBack).height);

    // Keep a small piece of paper inside the envelope
    const paperInsideEnvelope = 24;

    await doOnNextFrame(() => {
        paper.style.marginBottom = (envelopeHeight - paperInsideEnvelope) + 'px';
        paper.style.paddingBottom = paperInsideEnvelope + 'px';
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

    const allInputs = [...paper.querySelectorAll('input[name]')];
    const allEditables = [...paper.querySelectorAll('[contenteditable]')];

    // Validate form input
    const allFieldsFilled = [
        ...allInputs,
        ...allEditables
    ].reduce((prev, curr) => {
        if (curr.hasAttribute('contenteditable'))
            return prev && !!curr.textContent;
        else
            return prev && !!curr.value;
    }, true);

    if (!allFieldsFilled) {
        // More granular validation is performed server-side
        formError.textContent = 'All fields are required';
        return;
    } else {
        formError.textContent = '';
    }

    // Freeze form input
    allInputs.forEach(e => e.setAttribute('readonly', true));
    allEditables.forEach(e => e.setAttribute('contenteditable', false));

    showCaptcha();
});

/**
 * Second animation step.
 * Should be called after captcha challenge.
 */
async function sendEmailAnimation() {
    const envelopeHeight = px(window.getComputedStyle(envelopeBack).height);
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
        paper.style.marginBottom = '0px';
        paper.style.height = newPaperHeight + 'px';
    });

    await waitMillis(1000);
    // Attribute triggers transform animation from CSS
    closureFlap.setAttribute('data-flipped', 'true');

    await waitMillis(1000);
    // Handle emailPromise
    await emailPromise.then(() => {
        successResultMark.classList.add('visible');
    }, err => {
        errorResultMark.classList.add('visible');

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
            default:
                emailErrorDisplay.textContent = 'An error occurred sending the email';
        }
    });
}

/**
 * Send the email calling the remote endpoint
 */
async function sendEmail(recaptchaToken) {
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