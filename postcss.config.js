module.exports = {
    plugins: [
        require('postcss-assets')({
            basePath: 'src/',
            loadPaths: ['res/svg/', 'res/', 'res/img/']
        }),
        require('postcss-css-variables')
    ]
}