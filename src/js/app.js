/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

import supportsWebP from 'supports-webp';
import smoothscroll from 'smoothscroll-polyfill';

// Smooth-scroll polyfill for Safari
smoothscroll.polyfill();

supportsWebP
    .then(supported => supported ? 'webp' : 'no-webp')
    .then(clazz => document.body.classList.add(clazz));

import './sections';