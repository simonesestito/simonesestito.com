/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito. 
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const COOKIES_ACCEPTED_EVENT = 'cookiesAccepted';
exports.COOKIES_ACCEPTED_EVENT = COOKIES_ACCEPTED_EVENT;

const COOKIES_ACCEPT_POLICY_KEY = 'cookie-agreement'; // In localStorage
const banner = document.getElementById('cookie-banner');

// Load saved preference if any
let cookieAgreement = null;
try {
    cookieAgreement = JSON.parse(localStorage.getItem(COOKIES_ACCEPT_POLICY_KEY));
} catch (e) {}

if (cookieAgreement && cookieAgreement.accepted === true && cookieAgreement.date < Date.now()) {
    // Already accepted
    loadCookies();
} else {
    // Not accepted yet
    banner.classList.add('visible');

    document.body.addEventListener('click', cookieOnClickListener);
    window.addEventListener('scroll', cookieOnScrollListener);
}

function loadCookies() {
    document.dispatchEvent(new Event(COOKIES_ACCEPTED_EVENT));
}

function acceptCookies() {
    document.body.removeEventListener('click', cookieOnClickListener);
    window.removeEventListener('scroll', cookieOnScrollListener);

    localStorage.setItem(COOKIES_ACCEPT_POLICY_KEY, JSON.stringify({
        accepted: true,
        date: Date.now()
    }));
    banner.classList.remove('visible');
    loadCookies();
}

let initialY = null; // User scrollY when page loaded
function cookieOnScrollListener() {
    if (initialY === null) {
        if (document.readyState === 'complete') {
            initialY = window.scrollY;
        } else {
            return; // Not ready yet
        }
    }

    if (Math.abs(window.scrollY - initialY) >= 500) {
        acceptCookies();
    }
}

function cookieOnClickListener() {
    acceptCookies();
}