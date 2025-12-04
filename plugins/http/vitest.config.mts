import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'node',
            include: ['test/**/*.test.ts'],
            globals: true,
            globalSetup: './test/globalSetup.ts',
        },
    })
);
