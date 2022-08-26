const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const fs = require('fs');

const pjson = JSON.parse(fs.readFileSync('package.json').toString());

const base = {
    devtool: 'source-map',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    plugins: [
        new webpack.DefinePlugin({
            'process.env.VERSION': JSON.stringify(pjson.version),
        }),
    ],
};

module.exports = [
    {
        ...base,
        entry: './src/index.ts',
        output: {
            filename: 'rita-smt.js',
            path: path.resolve(__dirname, 'dist'),
            library: {
                name: 'rita-smt',
                type: 'umd',
            },
            globalObject: 'this',
        },
    },
    {
        ...base,
        entry: './src/bin.ts',
        output: {
            filename: 'bin.js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.VERSION': JSON.stringify(pjson.version),
            }),
            new webpack.BannerPlugin({
                banner: '#!/usr/bin/env node',
                raw: true,
            }),
        ],
    },
];
