/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

// Variables added after bundling:
// const PRECACHE_FILES = [...];
// const CACHE_ID = <millis>;

const CACHE_PREFIX = 'portfolio-';
const CACHE_NAME = CACHE_PREFIX + CACHE_ID;
const CROSS_ORIGIN_CACHE_NAME = CACHE_PREFIX + 'cross-origin';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(PRECACHE_FILES);
        })
    );
});

self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheKeys => {
            const oldCaches = cacheKeys.filter(c =>
                c.startsWith(CACHE_PREFIX) &&
                c !== CACHE_NAME &&
                c !== CROSS_ORIGIN_CACHE_NAME);

            return Promise.all(oldCaches.map(c => {
                return caches.delete(c);
            }));
        }));
});

self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
        event.respondWith(cacheFirst(event));
    } else {
        event.respondWith(fetch(event.request));
    }
});

function cacheFirst(event) {
    return caches.match(event.request.url).then(cacheResponse => {
        if (cacheResponse) {
            // Cache HIT
            return cacheResponse;
        }
        // Cache MISS
        return fetch(event.request).then(onlineResponse => {
            if (onlineResponse.ok) {
                // Network request succeded
                const isSameOrigin = event.request.url.startsWith(self.location.origin);
                // Save cross-origin requests in a different cache
                const cacheName = isSameOrigin ? CACHE_NAME : CROSS_ORIGIN_CACHE_NAME;
                return caches.open(cacheName)
                    .then(cache => cache.put(event.request.url, onlineResponse.clone()))
                    .then(() => onlineResponse);
            } else {
                return onlineResponse;
            }
        });
    });
}