import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

export default defineConfig({
    build: {
        lib: {
            entry: 'lib/index.ts',
            name: 'smtlib',
            formats: ['es', 'cjs', 'umd'],
        },
    },
    plugins: [externalizeDeps(), dts()],
});
