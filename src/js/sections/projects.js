/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

const section = document.getElementById('projects');
const appScreenshots = [...section.getElementsByClassName('app-screenshot')];
const appInfos = section.querySelectorAll('.phone-apps .phone-app');

// Change app screenshot based on current scroll position
const appInfosObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
        const entryScreenshotId = entry.target.getAttribute('data-app');
        const entryScreenshot = appScreenshots.find(s => s.id === entryScreenshotId);
        if (!entryScreenshot) {
            console.error('Unable to find screenshot with ID ' + entryScreenshotId);
            return;
        }

        if (entry.isIntersecting) {
            entryScreenshot.classList.add('visible');
        } else {
            entryScreenshot.classList.remove('visible');
        }
    }
}, { threshold: 0.7 });

appInfos.forEach(e => appInfosObserver.observe(e));