/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}

import './sections';