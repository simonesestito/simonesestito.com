/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

import { scrollMagicController } from '../utils';
import { TweenLite } from 'gsap/TweenLite';
import * as ScrollMagic from 'scrollmagic';
import { TimelineLite } from 'gsap/TimelineLite';
import { Circ } from 'gsap';

// Effect on page loading
window.addEventListener('load', () => {
    TweenLite.to('.wrapper-card', .8, { paddingTop: 0, ease: Circ.easeOut });
});

// Scroll up on click
document.getElementById('card-arrow').addEventListener('click', () => {
    document.getElementById('content').scrollIntoView({ behavior: 'smooth' });
});

// Fade effect on scroll up
const timeline = new TimelineLite()
    .to("#main", 2, { opacity: 0 }, 0.8)
    .to(".content-card", 1, { boxShadow: "0px 0px 0px 0px" }, 1.8);

new ScrollMagic.Scene({
        triggerElement: "#card-arrow",
        triggerHook: 0.8,
        duration: () => window.innerHeight - document.getElementById("card-arrow").clientHeight
    })
    .setTween(timeline)
    .addTo(scrollMagicController);