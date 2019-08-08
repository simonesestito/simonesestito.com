/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

const section = document.getElementById('projects');
const appScreenshots = [...section.getElementsByClassName('app-screenshot')];
const appInfos = section.querySelectorAll('.phone-apps .phone-app');

// Change app screenshot based on current scroll position
const OBSERVER_THRESHOLD = 0.5;
const appInfosObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
        // Edge triggers the observer callback at 0 and 1 ratios too
        // Ignore ratios very different from specified treshold
        if (Math.abs(entry.intersectionRatio - OBSERVER_THRESHOLD) > OBSERVER_THRESHOLD / 2.0) {
            continue;
        }

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
}, { threshold: OBSERVER_THRESHOLD });

appInfos.forEach(e => appInfosObserver.observe(e));