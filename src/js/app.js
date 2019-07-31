/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}

import supportsWebP from 'supports-webp';
supportsWebP
    .then(supported => supported ? 'webp' : 'no-webp')
    .then(clazz => document.body.classList.add(clazz));

import './sections';