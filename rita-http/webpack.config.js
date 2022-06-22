const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/index.ts',
    target: 'node',
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
    output: {
        filename: 'ritaAPI.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        globalObject: 'this',
    },
    externalsPresets: { node: true },
    externals: [nodeExternals()],
};
