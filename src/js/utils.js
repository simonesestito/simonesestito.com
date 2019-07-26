/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019 Simone Sestito
 */

// Required plugin imports
import 'gsap/ScrollToPlugin';
import 'gsap/CSSPlugin';
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';

import * as ScrollMagic from 'scrollmagic';

export const scrollMagicController = (() => {
    return new ScrollMagic.Controller();
})();

export function vh(n) {
    var unit = vh.unit || (vh.unit = (() => {
        var vhDiv = document.getElementById("viewport");
        return vhDiv.clientHeight / 90.0;
    })());

    return n * unit;
}