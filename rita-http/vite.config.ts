import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import swc from '@rollup/plugin-swc';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'rita',
            formats: ['cjs'],
        },
    },
    plugins: [
        externalizeDeps(),
        dts(),
        swc({
            swc: {
                jsc: {
                    parser: {
                        syntax: 'typescript',
                        decorators: true,
                    },
                    transform: {
                        decoratorMetadata: true,
                    },
                },
            },
        }),
    ],
    esbuild: false,
});
