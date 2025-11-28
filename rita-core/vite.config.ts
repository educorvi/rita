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
            name: 'RitaCore',
            formats: ['es', 'cjs', 'umd'],
            fileName: (format) => {
                if (format === 'es') return 'rita-core.mjs';
                if (format === 'cjs') return 'rita-core.cjs';
                return 'rita-core.js';
            },
        },
        rollupOptions: {
            external: ['ajv', 'ajv-formats', 'luxon', 'tslib'],
            output: {
                globals: {
                    ajv: 'Ajv',
                    'ajv-formats': 'AjvFormats',
                    luxon: 'Luxon',
                    tslib: 'tslib',
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
