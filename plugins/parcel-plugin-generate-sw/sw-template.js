/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

const CACHE_NAME = 'portfolio-cache';
// const PRECACHE_FILES = [...]; added after bundled

self.addEventListener('install', event => {
    console.log('Installing SW...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(PRECACHE_FILES);
        })
    );
});

self.addEventListener('activate', event => {
    let cache;
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(c => {
            cache = c;
            return c.keys();
        })
        .then(keys => Promise.all(
            keys
            .map(key => key.url)
            .filter(url => url.startsWith(self.location.origin))
            .map(url => url.replace(self.location.origin, ''))
            .filter(url => PRECACHE_FILES.indexOf(url) === -1)
            .map(url => cache.delete(url))
        ))
    )
});

self.addEventListener('fetch', event => {
    event.respondWith(cacheFirst(event));
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