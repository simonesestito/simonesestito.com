/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

// Scroll down to Contacts section on "Contact me" button click
document.getElementById('btn-contacts').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('contacts').scrollIntoView({ behavior: 'smooth' });
});