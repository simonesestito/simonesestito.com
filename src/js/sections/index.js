/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

import * as ScrollMagic from 'scrollmagic';
import { scrollMagicController, vh } from '../utils';

// Fixed header inside sections
const sectionHeaders = document.querySelectorAll("section.page-section > .section-header");
sectionHeaders.forEach(header => {
    const section = header.parentElement;

    new ScrollMagic.Scene({
            triggerElement: section,
            triggerHook: 0,
            duration: section.clientHeight - vh(100)
        })
        .setPin(section, {
            pushFollowers: false
        })
        .addTo(scrollMagicController);
});

export * from './card';
export * from './main';