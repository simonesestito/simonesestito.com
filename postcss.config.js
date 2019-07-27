module.exports = {
    plugins: [
        require('postcss-assets')({
            basePath: 'src/',
            loadPaths: ['res/svg/']
        }),
        require('postcss-css-variables'),
        require('cssnano')({
            preset: 'default'
        })
    ]
}