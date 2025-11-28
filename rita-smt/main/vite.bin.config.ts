import { defineConfig } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import pkg from './package.json';

export default defineConfig({
    define: {
        'process.env.VERSION': JSON.stringify(pkg.version),
    },
    build: {
        ssr: true,
        outDir: 'bin',
        rollupOptions: {
            input: {
                'rita-smt-bin': 'src/bin.ts',
                BenchmarkingWorker: 'src/BenchmarkingWorker.ts',
            },
            output: {
                entryFileNames: '[name].js',
                format: 'cjs',
            },
        },
    },
    plugins: [externalizeDeps()],
});
