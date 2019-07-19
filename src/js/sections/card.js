/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

import { TweenLite } from 'gsap/TweenLite';
import 'gsap/ScrollToPlugin';

document.getElementById('card-arrow').addEventListener('click', () => {
    TweenLite.to(window, 0.5, { scrollTo: '#content' });
});