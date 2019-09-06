/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

// Variables added after bundling:
// const PRECACHE_FILES = [...];
// const CACHE_ID = <millis>;

const CACHE_PREFIX = 'portfolio-';
const CACHE_NAME = CACHE_PREFIX + CACHE_ID;

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
                c.startsWith(CACHE_PREFIX) && c !== CACHE_NAME);

            // TODO Copy old cross origin cached requests

            return Promise.all(oldCaches.map(c => {
                return caches.delete(c);
            }));
        }));
});

self.addEventListener('fetch', event => {
    if (
        event.request.method === 'GET' ||
        event.request.method === 'HEAD' ||
        event.request.method === 'OPTIONS'
    ) {
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
                return caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request.url, onlineResponse.clone()))
                    .then(() => onlineResponse);
            } else {
                return onlineResponse;
            }
        });
    });
}