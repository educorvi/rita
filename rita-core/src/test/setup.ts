import * as matchers from 'jest-extended';
import { expect, vi } from 'vitest';
expect.extend(matchers);

global.console = {
    ...console,
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    // error: vi.fn(),
};
