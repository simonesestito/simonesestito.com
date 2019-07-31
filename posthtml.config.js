module.exports = {
    plugins: [
        require('posthtml-svg-inline')({
            root: 'src',
        }),
        require('posthtml-webp')({
            replaceExtension: true,
        })
    ]
}