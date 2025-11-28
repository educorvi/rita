import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import fs from 'fs';

const pjson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

export default defineConfig({
    plugins: [
        dts({
            include: ['src/**/*'],
            outDir: 'dist',
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'RitaPluginHttp',
            formats: ['es', 'cjs', 'umd'],
            fileName: (format) => {
                if (format === 'es') return 'index.mjs';
                if (format === 'cjs') return 'index.cjs';
                return 'index.js';
            },
        },
        rollupOptions: {
            external: ['axios', '@educorvi/rita'],
            output: {
                globals: {
                    axios: 'axios',
                    '@educorvi/rita': 'Rita',
                },
            },
        },
        sourcemap: true,
        outDir: 'dist',
    },
    define: {
        'process.env.VERSION': JSON.stringify(pjson.version),
    },
});
