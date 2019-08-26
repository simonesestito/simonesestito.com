/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

/*
 * Apply tint on every chip based on its meta, avoiding a lot of CSS
 */
document.querySelectorAll('.chip[data-chip-color]>svg').forEach(svg => {
    const chip = svg.parentElement;
    const color = chip.getAttribute('data-chip-color');

    chip.style.borderColor = color;
    svg.style.fill = color;
});