/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2023 Simone Sestito. 
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

import { doOnNextFrame, px, waitMillis, loadScriptUrl } from '../utils';

const SAVED_EMAIL_DRAFT_KEY = 'email-draft';

const paper = document.querySelector('#contacts form.paper');
const mailContainer = document.querySelector('#contacts .mail-container');

const errorResultMark = mailContainer.querySelector('.result.error');
const successResultMark = mailContainer.querySelector('.result.success');
const envelopeBack = mailContainer.querySelector('.envelope-back');
const closureFlap = mailContainer.querySelector('.closure-flap');
const emailErrorDisplay = mailContainer.querySelector('.email-error');
const mailLoading = mailContainer.querySelector('.mail-loading');

const submitButton = paper.querySelector('input[type=submit]');
const messageDiv = paper.querySelector('[contenteditable][name="message"]');
const formError = paper.querySelector('.form-error');

let emailPromise;

// Restore unsent email draft, if any
const emailDraftJson = sessionStorage.getItem(SAVED_EMAIL_DRAFT_KEY);
if (emailDraftJson) {
    const {
        userName,
        userMessage,
        userEmail
    } = JSON.parse(emailDraftJson);
    paper.elements.name.value = userName;
    paper.elements.email.value = userEmail;
    messageDiv.innerText = userMessage;
}

/**
 * Function used in HTML ReCaptcha widget
 */
window.onContactsRecaptchaSuccess = function(recaptchaToken) {
    emailPromise = sendEmail(recaptchaToken);
    sendEmailAnimation();
}

// On form submit
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
    submitButton.style.opacity = '0';
    allInputs.forEach(e => e.setAttribute('readonly', true));
    allEditables.forEach(e => {
        e.setAttribute('contenteditable', false);
        e.setAttribute('aria-readonly', true);
    });

    // Execute ReCaptcha challenge
    grecaptcha.execute();
});

/**
 * First animation step.
 * Should be called after captcha challenge.
 */
async function sendEmailAnimation() {
    const envelopeHeight = px(window.getComputedStyle(envelopeBack).height);
    const {
        height,
        paddingTop
    } = window.getComputedStyle(paper);
    const newPaperHeight = envelopeHeight - px(paddingTop) - 20;

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

    await doOnNextFrame(() => {
        mailLoading.style.opacity = '1';
    });
    // Keep loading indicator for at least 500ms to avoid flashing
    await waitMillis(500);

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
                emailErrorDisplay.textContent = 'Server error processing the request.';
                break;
            case 'INVALID_BODY_INPUT':
                emailErrorDisplay.textContent = 'Invalid data inserted.';
                break;
            case 'INVALID_RECAPTCHA':
                emailErrorDisplay.textContent = 'ReCaptcha verification failed.'
                break;
            case 'TOO_MANY_EMAILS':
                emailErrorDisplay.textContent = 'You\'ve sent too many emails.';
                break;
            default:
                emailErrorDisplay.textContent = 'An error occurred sending the email.';
        }
        emailErrorDisplay.innerHTML += '<br>Refresh the page and retry, or send an email directly to <a href="mailto:simone@simonesestito.com">simone@simonesestito.com</a>.';
    });
    await doOnNextFrame(() => {
        mailLoading.style.opacity = '0';
    });
}

/**
 * Send the email calling the remote endpoint
 */
async function sendEmail(clientCaptcha) {
    const userName = paper.elements.name.value;
    const userEmail = paper.elements.email.value;
    const userMessage = messageDiv.innerText;

    // Save email data in sessionStorage
    // If there's the need to refresh the page (after an error maybe)
    // the email written in the form will be restored
    sessionStorage.setItem(SAVED_EMAIL_DRAFT_KEY, JSON.stringify({
        userName,
        userEmail,
        userMessage
    }));

    try {
        const response = await fetch('https://www-api.simonesestito.com/api/emails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName,
                userEmail,
                userMessage,
                clientCaptcha
            })
        });

        if (response.ok) {
            // Success
            // Remove saved email draft
            sessionStorage.removeItem(SAVED_EMAIL_DRAFT_KEY);
            return;
        }

        const { error } = await response.json();
        return Promise.reject(new Error(error));
    } catch (e) {
        return Promise.reject(new Error('INTERNET_ERROR'));
    }
}