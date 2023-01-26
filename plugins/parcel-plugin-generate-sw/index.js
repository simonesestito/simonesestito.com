/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2023 Simone Sestito. 
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-es');

const SW_OUT_FILE = 'sw.js';
const SW_IN_FILE = 'sw-template.js';
const HTML_OUT_FILE = 'index.html';
const EXTERNAL_CACHED_FILES = Object.freeze([
    '/'
]);

module.exports = bundler => {
    const { production, outDir } = bundler.options;

    bundler.on('bundled', () => {
        const outputSwFile = path.resolve(outDir, SW_OUT_FILE);

        if (!production) {
            if (fs.existsSync(outputSwFile)) {
                fs.unlinkSync(outputSwFile);
            }
            return;
        }

        const toCacheFiles = [
            ...fs.readdirSync(outDir).map(f => '/' + f),
            ...EXTERNAL_CACHED_FILES,
        ];

        // Add Service Worker JS
        const templateSwFile = path.resolve(__dirname, SW_IN_FILE);
        let templateSwSrc = fs.readFileSync(templateSwFile, 'utf-8');
        templateSwSrc = `
        const PRECACHE_FILES = ${JSON.stringify(toCacheFiles)};
        const CACHE_ID = ${Date.now()}
        ${templateSwSrc}
        `;
        fs.writeFileSync(outputSwFile, UglifyJS.minify(templateSwSrc).code);

        // Add Service Worker register script inside HTML
        const jsScript = `
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/${SW_OUT_FILE}').then(reg => {
                if (reg.waiting) {
                    // Already in waiting state
                    document.dispatchEvent(new Event('serviceworkerupdate'));
                    return;
                }

                reg.addEventListener('updatefound', () => {
                    var newWorker = reg.installing;
                    newWorker.addEventListener('statechange', () => {
                        // Check if it's an update, not the first installation
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            document.dispatchEvent(new Event('serviceworkerupdate'));
                        }
                    });
                });
            });
        }
        `;
        const htmlScript = `<script async defer>${UglifyJS.minify(jsScript).code}</script>`;

        const htmlFile = path.resolve(outDir, HTML_OUT_FILE);
        let htmlCode = fs.readFileSync(htmlFile, 'utf-8');
        htmlCode = htmlCode.replace('</body>', htmlScript + '</body>');
        fs.writeFileSync(htmlFile, htmlCode);
    });
};