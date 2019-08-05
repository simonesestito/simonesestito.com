/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

const cardArrow = document.getElementById('card-arrow');

// Scroll up on click
cardArrow.addEventListener('click', () => {
    document.getElementById('content').scrollIntoView({ behavior: 'smooth' });
});

// Effect on card scroll up
const main = document.getElementById('main');
const contentCard = document.getElementsByClassName('content-card')[0];
window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
        const scrollTop = cardArrow.getBoundingClientRect().top;
        // Start animation when scrollTop is <= threshold
        const threshold = 150.0;

        let progress; // Must be between 1 and 0
        if (scrollTop > threshold)
            progress = 1;
        else if (scrollTop < 0)
            progress = 0;
        else
            progress = scrollTop / threshold;

        // Set #main opacity
        main.style.opacity = progress;

        // Set content-card box shadow
        const y = -3 * progress;
        const blur = 6 * progress;
        const alpha = 0.3 * progress;
        contentCard.style.boxShadow = `0 ${y}px ${blur}px rgba(0,0,0,${alpha})`;
    });
}, { passive: true });