import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import pkg from './package.json';
import analyzer from 'vite-bundle-analyzer';

export default defineConfig({
    define: {
        'process.env.VERSION': JSON.stringify(pkg.version),
    },
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'rita',
            formats: ['es', 'cjs'],
        },
    },
    plugins: [
        externalizeDeps(),
        dts({ entryRoot: 'src', exclude: ['**/test/**', 'vite.config.ts'] }),
        // analyzer()
    ],
});
