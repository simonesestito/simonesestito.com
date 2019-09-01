/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

import supportsWebP from 'supports-webp';
import 'intersection-observer-polyfill/index.global';
import smoothscroll from 'smoothscroll-polyfill';

// Smooth-scroll polyfill for Safari
smoothscroll.polyfill();

// WebP support accessible from CSS
supportsWebP
    .then(supported => supported ? 'webp' : 'no-webp')
    .then(clazz => document.body.classList.add(clazz));

// Online/offline detection in CSS
function updateConnectionStatus() {
    if (navigator.onLine) {
        document.body.classList.remove('offline');
    } else {
        document.body.classList.add('offline');
    }
}
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);
updateConnectionStatus();

import './sections';
import './chips';