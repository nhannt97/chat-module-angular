let path = require('path');
module.exports = {
    mode: 'development',
    devtool: 'inline-sourcemap',
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.html$/, use: 'html-loader' }
        ]
    },
    entry: [
        '../js/app.js'
    ],
    output: {
        path: path.join(__dirname, '../../wi-angular/source/vendor/js'),
        filename: 'chat-module.webpack.js'
    }
}