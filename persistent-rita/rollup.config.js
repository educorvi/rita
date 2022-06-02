import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pluginJson from '@rollup/plugin-json';
import typescript from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';
import pkg from "./package.json"

function output(format) {
    const base = {
        file: `dist/persistent-rita.${format}.js`,
        format,
        sourcemap: true,
        name: 'rita',
        exports: 'named'
    }

    return [
        // We need the base output
        base,

        // And also a minified version
        { ...base, file: `dist/persistent-rita.${format}.min.js`, plugins: [terser()] },
    ]
}

export default {
    plugins: [
        pluginJson(),
        typescript({
            hook: {
                // Always rename declaration files to index.d.ts to avoid emitting three declaration files with identical contents
                outputPath: (path, kind) =>
                    kind === 'declaration' ? './dist/index.d.ts' : path,
            },
        }),
        commonjs(),
        nodeResolve()
    ],
    input: 'src/index.ts',
    output: [
        ...output('cjs'),
        // ...output('umd'),
        ...output('esm')
    ],
    external: [
        ...Object.keys(pkg.dependencies)
    ]
};
