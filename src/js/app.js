/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito. 
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

// When cookies are accepted, start Analytics
window.dataLayer = window.dataLayer || [];
window.gtag = function() { window.dataLayer.push(arguments); }
document.addEventListener('cookiesaccepted', () => {
    // Google Analytics
    loadScriptUrl('https://www.googletagmanager.com/gtag/js?id=UA-80600108-4');
    gtag('js', new Date());
    gtag('config', 'UA-80600108-4', {
        'anonymize_ip': true
    });

    // Google Tag Manager
    (function(w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-MFQT3SW');
});

import './sections';
import './components';