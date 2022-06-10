/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2022 Simone Sestito. 
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const cardArrow = document.getElementById('card-arrow');

// Scroll up on click
cardArrow.addEventListener('click', () => {
    document.getElementById('content').scrollIntoView({ behavior: 'smooth' });
});

// Effect on card scroll up
const main = document.getElementById('main');
const contentCard = document.getElementsByClassName('content-card')[0];
let animationFrameRequested = false;
window.addEventListener('scroll', () => {
    if (animationFrameRequested)
        return;

    animationFrameRequested = true;
    requestAnimationFrame(() => {
        animationFrameRequested = false;

        const scrollTop = (
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop
        );
        const viewportHeight = (
            document.documentElement.clientHeight ||
            window.innerHeight
        );
        const cardHeight = cardArrow.clientHeight;
        const totalScroll = viewportHeight - cardHeight;

        // Must be between 1 and 0
        const progress = fixInRange(scrollTop / totalScroll, 0, 1);
        // Easing function
        const visibility = 1 - Math.pow(progress, 5);

        // Set #main opacity
        main.style.opacity = visibility;

        // Set content-card box shadow
        const y = -3 * visibility;
        const blur = 6 * visibility;
        const alpha = 0.3 * visibility;
        contentCard.style.boxShadow = `0 ${y}px ${blur}px rgba(0,0,0,${alpha})`;
    });
}, { passive: true });

function fixInRange(num, min, max) {
    if (num < min) return min;
    if (num > max) return max;
    return num;
}