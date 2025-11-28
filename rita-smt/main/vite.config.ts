import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import fs from 'fs';

const pjson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// Build the bin and BenchmarkingWorker separately as CJS only
// since they don't need UMD format and Vite doesn't support multi-entry with UMD
export default defineConfig(({ mode }) => {
    const isBin = process.env.BUILD_TARGET === 'bin';
    const isWorker = process.env.BUILD_TARGET === 'worker';

    if (isBin) {
        return {
            build: {
                ssr: true,
                emptyOutDir: false,
                lib: {
                    entry: resolve(__dirname, 'src/bin.ts'),
                    formats: ['cjs'],
                    fileName: () => 'bin.js',
                },
                rollupOptions: {
                    external: [
                        '@educorvi/smtlib',
                        'command-exists',
                        'commander',
                        '@educorvi/rita',
                        'fs',
                        'path',
                        'util',
                        'worker_threads',
                    ],
                },
                sourcemap: true,
                outDir: 'dist',
            },
            define: {
                'process.env.VERSION': JSON.stringify(pjson.version),
            },
        };
    }

    if (isWorker) {
        return {
            build: {
                ssr: true,
                emptyOutDir: false,
                lib: {
                    entry: resolve(__dirname, 'src/BenchmarkingWorker.ts'),
                    formats: ['cjs'],
                    fileName: () => 'BenchmarkingWorker.js',
                },
                rollupOptions: {
                    external: [
                        '@educorvi/smtlib',
                        'command-exists',
                        'commander',
                        '@educorvi/rita',
                        'worker_threads',
                        'util',
                        'fs',
                    ],
                },
                sourcemap: true,
                outDir: 'dist',
            },
            define: {
                'process.env.VERSION': JSON.stringify(pjson.version),
            },
        };
    }

    // Main build - ES, CJS, and UMD
    return {
        plugins: [
            dts({
                include: ['src/**/*'],
                outDir: 'dist',
            }),
        ],
        build: {
            lib: {
                entry: resolve(__dirname, 'src/index.ts'),
                name: 'RitaSmt',
                formats: ['es', 'cjs', 'umd'],
                fileName: (format) => {
                    if (format === 'es') return 'rita-smt.mjs';
                    if (format === 'cjs') return 'rita-smt.cjs';
                    return 'rita-smt.js';
                },
            },
            rollupOptions: {
                external: [
                    '@educorvi/smtlib',
                    'command-exists',
                    'commander',
                    '@educorvi/rita',
                ],
                output: {
                    globals: {
                        '@educorvi/smtlib': 'Smtlib',
                        'command-exists': 'commandExists',
                        commander: 'Commander',
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
    };
});
