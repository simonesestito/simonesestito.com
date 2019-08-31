/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

import { doOnNextFrame, px } from '../utils';

const envelope = document.querySelector('#contacts .envelope');
const paper = document.querySelector('#contacts .paper');
const paperFilling = document.querySelector('#contacts .paper-filling');
const closureFlap = document.querySelector('#contacts .closure-flap');
const submitCheck = document.querySelector('#contacts .paper .submit-check');
const submitButton = document.querySelector('#contacts .paper input[type=submit]');

/**
 * First animation step.
 * Should be called on submit.
 */
function showCaptcha() {
    doOnNextFrame(() => {
        envelope.style.marginTop = '0px';
        submitCheck.style.opacity = '1';
        submitButton.style.opacity = '0';
    });

    // TODO TEST ONLY
    setTimeout(sendEmailAnimation, 3000);
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

    setTimeout(() => {
        // Attribute triggers transform animation from CSS
        closureFlap.setAttribute('data-flipped', 'true');

        // Finally, send the email for real.
        sendEmail();
    }, 1000);
}

/**
 * Send the email calling the remote endpoint
 */
function sendEmail() {
    // TODO
    console.log('TODO');
}