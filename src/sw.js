/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

const CACHE_NAME = 'portfolio-cache';

self.addEventListener('install', event => {
    console.log('Installing SW...');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    console.log('SW activated');
    event.waitUntil(Promise.resolve());
});

self.addEventListener('fetch', event => {
    if (event.request.url === self.location.origin + '/') {
        event.respondWith(onlineFirst(event));
    } else {
        event.respondWith(cacheFirst(event));
    }
});

function cacheFirst(event) {
    return caches.match(event.request.url).then(cacheResponse => {
        if (cacheResponse) {
            // Cache HIT
            return cacheResponse;
        }
        // Cache MISS
        return fetch(event.request.url).then(onlineResponse => {
            if (onlineResponse.ok) {
                // Network request succeded
                return caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request.url, onlineResponse.clone()))
                    .then(() => onlineResponse);
            } else {
                return onlineResponse;
            }
        });
    });
}

function onlineFirst(event) {
    return fetch(event.request.url)
        .then(onlineResponse => {
            if (onlineResponse.ok) {
                // Network request succeded
                return caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request.url, onlineResponse.clone()))
                    .then(() => onlineResponse);
            } else {
                return Promise.reject(new Error('Online request failed'));
            }
        }).catch(networkError => {
            // Network error, try cache
            return caches.match(event.request.url)
                .then(cacheResponse => {
                    if (cacheResponse) {
                        // Cache HIT
                        return cacheResponse;
                    } else {
                        // Cache MISS
                        return Promise.reject(networkError);
                    }
                });
        });
}