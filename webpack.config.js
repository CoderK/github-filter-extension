'use strict';

const webpack = require('webpack');
const envIndex = process.argv.indexOf('--env');

let env = null;
if (envIndex > -1) { env = process.argv[envIndex + 1]; }

module.exports = {
    entry: './src/app.js',
    output: {
        path: __dirname,
        filename: `dist/bundle.js`
    },
    devtool: env === 'production' ? false : 'inline-source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /(\.tpl|\.html)$/,
                loader: 'lodash-template-webpack',
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: `${env}`
            }
        })
    ],
};