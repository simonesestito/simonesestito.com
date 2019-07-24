/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

import { scrollMagicController } from '../utils';
import { TweenLite } from 'gsap/TweenLite';
import * as ScrollMagic from 'scrollmagic';
import { TimelineLite } from 'gsap/TimelineLite';

// Scroll up on click
document.getElementById('card-arrow').addEventListener('click', () => {
    TweenLite.to(window, 0.5, { scrollTo: '#content' });
});

// Fade effect on scroll up
const timeline = new TimelineLite()
    .to("#main", 2, { opacity: 0 }, 0.8)
    .to("body", 2, { backgroundColor: "#fafafa" }, 0.8)
    .to(".content-card", 1, { boxShadow: "0px 0px 0px 0px" }, 1.8);

new ScrollMagic.Scene({
        triggerElement: "#card-arrow",
        triggerHook: 0.8,
        duration: () => window.innerHeight - document.getElementById("card-arrow").clientHeight
    })
    .setTween(timeline)
    .addTo(scrollMagicController);