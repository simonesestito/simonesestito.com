/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2022 Simone Sestito. 
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const section = document.getElementById('projects');
const appScreenshots = [...section.getElementsByClassName('app-screenshot')];
const appInfos = section.querySelectorAll('.phone-apps .phone-app');

// Change app screenshot based on current scroll position
const OBSERVER_THRESHOLD = 0.7;
const appInfosObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
        // Edge triggers the observer callback at 0 and 1 ratios too
        // Ignore ratios very different from specified treshold
        if (Math.abs(entry.intersectionRatio - OBSERVER_THRESHOLD) > 0.3) {
            continue;
        }

        const entryScreenshotId = entry.target.getAttribute('data-app');
        const entryScreenshot = appScreenshots.find(s => s.id === entryScreenshotId);
        if (!entryScreenshot) {
            console.error('Unable to find screenshot with ID ' + entryScreenshotId);
            return;
        }

        // Don't use isIntersecting property.
        // On Edge, it is true if ratio > 0, without considering the threshold
        if (entry.intersectionRatio >= OBSERVER_THRESHOLD) {
            // This item has became visible
            onNewVisibleItem(entryScreenshot);
        }
    }
}, { threshold: [OBSERVER_THRESHOLD] });

appInfos.forEach(e => appInfosObserver.observe(e));

let prevVisibleItem;

/**
 * Call this function to trigger the screenshot change.
 * Set the previous screenshot as invisible only when there's a new visible one,
 * to avoid the risk of having no screenshot inside the phone mockup.
 * 
 * @param {HTMLElement} newVisibleItem The new item marked as visible
 */
function onNewVisibleItem(newVisibleItem) {
    if (prevVisibleItem) {
        prevVisibleItem.classList.remove('visible');
    }
    newVisibleItem.classList.add('visible');
    prevVisibleItem = newVisibleItem;
}