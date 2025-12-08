import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'rita-plugin-http',
            formats: ['es', 'cjs'],
        },
    },
    plugins: [externalizeDeps(), dts()],
});
