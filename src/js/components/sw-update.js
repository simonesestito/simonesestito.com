/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito. 
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const swUpdateBanner = document.getElementById('sw-update-banner');
const swUpdateButton = swUpdateBanner.querySelector('.update-btn');

document.addEventListener('serviceworkerupdate', async() => {
    // Dispatched from parcel-plugin-sw-generate
    const swRegistration = await navigator.serviceWorker.getRegistration();
    const newServiceWorker = swRegistration.waiting;

    if (!newServiceWorker) {
        console.error('Failed requesting SW update to the user.');
        return;
    }

    swUpdateBanner.classList.add('visible');
    swUpdateButton.addEventListener('click', () => {
        newServiceWorker.postMessage({ action: 'skipWaiting' });
    });
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });
}