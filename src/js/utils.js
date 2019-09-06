/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito. 
 * All rights reserved, including the right to copy, modify, and redistribute.
 */


/**
 * Converts pixel string to number
 * @param {string} string Pixels in string
 */
export function px(string) {
    const numString = String(string).replace('px', '');
    return Number.parseFloat(numString);
}

/**
 * Executes the action inside requestAnimationFrame and returns a Promise
 * @param {Function} action 
 */
export async function doOnNextFrame(action) {
    return new Promise(res => {
        requestAnimationFrame(() => {
            action();
            setTimeout(res, 0);
        });
    });
}

/**
 * Resolve the returned Promise after at least X millis.
 * @param {number} millis
 */
export async function waitMillis(millis) {
    return new Promise(res => {
        setTimeout(res, millis);
    });
}