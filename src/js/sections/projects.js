/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

import { scrollMagicController } from "../utils";
import * as ScrollMagic from 'scrollmagic';
import TweenLite from "gsap/TweenLite";

// Fixed smartphone frame inside projects section
const section = document.getElementById('projects');
const sectionContent = section.getElementsByClassName('section-content')[0];
const phoneFrame = sectionContent.getElementsByClassName('phone-container')[0];
const appScreenshots = phoneFrame.getElementsByClassName('app-screenshot');
const appTexts = sectionContent.getElementsByClassName('phone-app');

// Change app screenshot based on current scroll position
for (let i = 0; i < appTexts.length; i++) {
    const appText = appTexts[i];

    new ScrollMagic.Scene({
            triggerElement: appText,
            triggerHook: 0.5,
            duration: () => appText.offsetHeight
        })
        .on("enter", () => {
            TweenLite.to(appScreenshots[i], .3, { opacity: 1 });
        })
        .on("leave", () => {
            TweenLite.to(appScreenshots[i], .3, { opacity: 0 });
        })
        .addTo(scrollMagicController);
}