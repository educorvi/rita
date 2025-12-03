import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import pkg from './package.json';

export default defineConfig({
    define: {
        'process.env.VERSION': JSON.stringify(pkg.version),
    },
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'rita-smt',
            formats: ['es', 'cjs', 'umd'],
        },
    },
    plugins: [externalizeDeps(), dts()],
});
