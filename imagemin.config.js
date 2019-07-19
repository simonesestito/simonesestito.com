// https://www.npmjs.com/package/parcel-plugin-imagemin
module.exports = {
    'svgo': {
        // https://github.com/svg/svgo#what-it-can-do
        'plugins': [{
            'removeUnknownsAndDefaults': {
                'keepDataAttrs': false // Remove useless data-*
            }
        }, ]
    }
};