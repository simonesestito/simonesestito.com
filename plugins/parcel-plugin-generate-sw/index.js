/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
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
            return void console.log('Service Worker disabled in debug mode');
        }

        const toCacheFiles = [
            ...fs.readdirSync(outDir).map(f => '/' + f),
            ...EXTERNAL_CACHED_FILES,
        ];

        // Add Service Worker JS
        const templateSwFile = path.resolve(__dirname, SW_IN_FILE);
        let templateSwSrc = fs.readFileSync(templateSwFile, 'utf-8');
        templateSwSrc += `
        const PRECACHE_FILES = ${JSON.stringify(toCacheFiles)};
        `;
        fs.writeFileSync(outputSwFile, UglifyJS.minify(templateSwSrc).code);

        // Add Service Worker register script inside HTML
        const htmlScript = `<script>if ('serviceWorker' in navigator) navigator.serviceWorker.register('/${SW_OUT_FILE}');</script>`;
        const htmlFile = path.resolve(outDir, HTML_OUT_FILE);
        let htmlCode = fs.readFileSync(htmlFile, 'utf-8');
        htmlCode = htmlCode.replace('</body>', htmlScript + '</body>');
        fs.writeFileSync(htmlFile, htmlCode);
    });
};