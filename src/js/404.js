/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2023 Simone Sestito. 
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

/**
 * Import only in 404.html
 * Not in app.js
 */
const page404Title = document.querySelector('.title-404');

page404Title.addEventListener('click', () => {
    page404Title.textContent = (404).toString(2);
    page404Title.style.fontFamily = 'monospace';
});