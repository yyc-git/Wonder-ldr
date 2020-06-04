const path = require('path');

// const isProd = process.env.NODE_ENV === 'production';
const isProd = false;

var config = {
    entry: {
        "ldr": "./src/Index.js"
    },
    mode: isProd ? 'production' : 'development',
    output: {
        filename: '[name].js',
        path: path.join(__dirname, "dist"),
        library: 'ldr',
        libraryTarget: 'umd'
    },
    target: "web"
};

module.exports = [config];
