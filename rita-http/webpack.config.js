const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function modifyPackageJSON(buffer) {
    // copy-webpack-plugin passes a buffer
    const manifest = JSON.parse(buffer.toString());

    // make any modifications you like, such as
    manifest.main = manifest.main.replace("dist", ".")
    manifest.scripts = {}

    // pretty print to JSON with two spaces
    return JSON.stringify(manifest, null, 2);
}

module.exports = {
    entry: './src/index.ts',
    target: "node",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'ritaAPI.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    externals: [nodeExternals()],
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'package.json',
                    transform(content) {
                        return modifyPackageJSON(content);
                    }
                },
                {from: 'yarn.lock'},
                {from: 'postInstall.js'},
                {
                    from: '.env.template',
                    noErrorOnMissing: true
                },
                {
                    from: 'README.md',
                    noErrorOnMissing: true
                },
                {from: 'docs/swagger.json', to: "docs"},
            ]
        })
    ]
};
