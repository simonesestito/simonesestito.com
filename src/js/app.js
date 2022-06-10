/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2022 Simone Sestito. 
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

import supportsWebP from 'supports-webp';
import 'intersection-observer-polyfill/index.global';
import smoothscroll from 'smoothscroll-polyfill';
import { loadScriptUrl } from './utils';

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

// Handle mobile viewport resizing on Android
if (/(android)/i.test(navigator.userAgent)) {
    window.addEventListener('load', () => {
        const vh = window.innerHeight;
        const viewport = document.querySelector('meta[name=viewport]');
        const contentValues = viewport.getAttribute('content')
            .split(',')
            .map(v => v.trim())
            .reduce((acc, i) => {
                const [key, value] = i.split('=');
                acc[key] = value;
                return acc;
            }, {});

        contentValues['height'] = vh;

        const newContent = Object.keys(contentValues)
            .map(k => `${k}=${contentValues[k]}`)
            .join(', ');
        viewport.setAttribute('content', newContent);
    });
}

import './sections';
import './components';