import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pluginJson from '@rollup/plugin-json';
import typescript from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';
import { normalize } from 'path';
import replace from '@rollup/plugin-replace';
import { version } from './package.json';

function output(format) {
    const base = {
        file: `dist/rita.${format}.js`,
        format,
        sourcemap: true,
        name: 'rita',
    };

    return [
        // We need the base output
        base,

        // And also a minified version
        { ...base, file: `dist/rita.${format}.min.js`, plugins: [terser()] },
    ];
}

const onwarn = (warning) => {
    // Silence circular dependency warning for luxon package
    if (
        warning.code === 'CIRCULAR_DEPENDENCY' &&
        !warning.importer.indexOf(normalize('node_modules/luxon'))
    ) {
        return;
    }

    console.warn(`(!) ${warning.message}`);
};

export default {
    plugins: [
        replace({
            include: ['src/index.ts'],
            values: {
                'process.env.VERSION': `'${version}'`,
            },
            preventAssignment: true,
        }),
        pluginJson(),
        typescript({
            hook: {
                // Always rename declaration files to index.d.ts to avoid emitting three declaration files with identical contents
                outputPath: (path, kind) =>
                    kind === 'declaration' ? './dist/index.d.ts' : path,
            },
        }),
        commonjs(),
        nodeResolve(),
    ],

    input: 'src/index.ts',
    output: [...output('cjs'), ...output('umd'), ...output('esm')],
    onwarn,
};
