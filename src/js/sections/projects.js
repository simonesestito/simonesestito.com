/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

import { vh, scrollMagicController } from "../utils";
import * as ScrollMagic from 'scrollmagic';
import TweenLite from "gsap/TweenLite";

// Fixed smartphone frame inside projects section
const section = document.getElementById('projects');
const phoneFrame = section.getElementsByClassName('phone-container')[0];
const firstAppScreenshot = phoneFrame.getElementsByClassName('app-screenshot')[0];

new ScrollMagic.Scene({
        triggerElement: section,
        triggerHook: 0,
        duration: section.offsetHeight - vh(100)
    })
    .setPin(phoneFrame, {
        pushFollowers: false
    })
    .addTo(scrollMagicController);

// When the display fully enters the screen...
new ScrollMagic.Scene({
        triggerElement: phoneFrame,
        triggerHook: .1
    })
    .setTween(TweenLite.fromTo(firstAppScreenshot, .5, { opacity: 0 }, { opacity: 1 }))
    .addTo(scrollMagicController);