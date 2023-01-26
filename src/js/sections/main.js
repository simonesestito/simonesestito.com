/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2023 Simone Sestito. 
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

// Scroll down to Contacts section on "Contact me" button click
document.getElementById('btn-contacts').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('contacts').scrollIntoView({ behavior: 'smooth' });
});