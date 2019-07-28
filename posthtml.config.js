module.exports = {
    plugins: [
        require('posthtml-svg-inline')({
            root: 'src',
        })
    ]
}