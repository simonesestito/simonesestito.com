/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2023 Simone Sestito. 
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

/*
 * Apply tint on every bubble based on its meta, avoiding a lot of CSS
 */
document.querySelectorAll('.bubble[data-bubble-color]').forEach(bubble => {
    const color = bubble.getAttribute('data-bubble-color');
    bubble.style.backgroundColor = color;

    // Set shadow color by "color" CSS property.
    // If box-shadow doesn't set any shadow color,
    // "color" CSS property value is used instead.
    bubble.style.color = color;
});