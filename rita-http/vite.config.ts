import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'RitaHttp',
            formats: ['es', 'cjs'],
            fileName: (format) => {
                if (format === 'es') return 'ritaAPI.mjs';
                return 'ritaAPI.cjs';
            },
        },
        rollupOptions: {
            external: [
                '@educorvi/persistent-rita',
                '@educorvi/rita',
                '@educorvi/rita-plugin-http',
                '@tsoa/runtime',
                'body-parser',
                'dotenv',
                'express',
                'pg',
                'promise.any',
                'reflect-metadata',
                'semver',
                'sqlite3',
                'swagger-ui-express',
                'terminal-kit',
                'tslog',
                'tsoa',
                'typeorm',
                'mysql2',
            ],
        },
        sourcemap: true,
        outDir: 'dist',
    },
});
