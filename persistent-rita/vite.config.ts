import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

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
            name: 'PersistentRita',
            formats: ['es', 'cjs', 'umd'],
            fileName: (format) => {
                if (format === 'es') return 'persistent-rita.mjs';
                if (format === 'cjs') return 'persistent-rita.cjs';
                return 'persistent-rita.js';
            },
        },
        rollupOptions: {
            external: ['reflect-metadata', '@educorvi/rita', 'typeorm'],
            output: {
                globals: {
                    'reflect-metadata': 'ReflectMetadata',
                    '@educorvi/rita': 'Rita',
                    typeorm: 'TypeORM',
                },
            },
        },
        sourcemap: true,
        outDir: 'dist',
    },
});
