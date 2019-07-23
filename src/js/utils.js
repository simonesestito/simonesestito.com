// Required plugin imports
import 'gsap/ScrollToPlugin';
import 'gsap/CSSPlugin';
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';

import * as ScrollMagic from 'scrollmagic';

export const scrollMagicController = (() => {
    return new ScrollMagic.Controller();
})();