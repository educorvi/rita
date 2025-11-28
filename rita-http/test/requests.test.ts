import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import axiosImport from 'axios';
import pjson from '../package.json';

import { ApiKey } from '../src/config/Database';
import { configDB, init, rita, logger } from '../src/helper/globals';

// Create a dedicated axios instance so we can mutate headers freely
const axios = axiosImport.create();
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        logger.debug(error.response?.data?.message);
        return Promise.reject(error);
    }
);

const { PORT } = process.env;
const base = `http://localhost:${PORT}/`;

// ---------------------------------------------------------------------------
// shared fixtures
// ---------------------------------------------------------------------------

const exampleRuleset = {
    rules: [
        {
            id: 'rule1',
            rule: {
                type: 'and',
                arguments: [
                    { type: 'atom', path: 'member' },
                    {
                        type: 'not',
                        arguments: [{ type: 'atom', path: 'employee' }],
                    },
                ],
            },
        },
        {
            id: 'rule2',
            rule: { type: 'atom', path: 'employee' },
        },
    ],
    name: 'test1',
    description: '',
};

// ---------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------

describe('Basics', () => {
    test('Startpage', async () => {
        const res = await axios.get(base);
        expect(res.status).toBe(200);
        expect(res.data.version).toBe(pjson.version);
    });

    test('Docs', async () => {
        const res = await axios.get(`${base}docs`);
        expect(res.status).toBe(200);
    });
});

describe('Manage rulesets', () => {
    let all: ApiKey;
    let nothing: ApiKey;

    // ---------- global DB / key setup -------------------------------------------------
    beforeAll(async () => {
        await init();

        all = await ApiKey.generateApiKey('all', true, true, true, configDB);
        await configDB.setApiKey(all);

        nothing = await ApiKey.generateApiKey(
            'nothing',
            false,
            false,
            false,
            configDB
        );
        await configDB.setApiKey(nothing);
    });

    // ---------- 1. WITHOUT API-KEY ----------------------------------------------------
    describe('Requests without Api Key and default public access', () => {
        let initialLength = 0;

        test('List all rulesets', async () => {
            const res = await axios.get(`${base}rulesets`);
            expect(res.status).toBe(200);
            initialLength = res.data.length;
        });

        test('Show one ruleset that does not exist', async () => {
            await expect(
                axios.get(`${base}rulesets/420`)
            ).rejects.toHaveProperty('response.status', 404);
        });

        test('Create a ruleset → 401', async () => {
            await expect(
                axios.post(`${base}rulesets/420`, exampleRuleset)
            ).rejects.toHaveProperty('response.status', 401);
        });

        test('Amount unchanged', async () => {
            const res = await axios.get(`${base}rulesets`);
            expect(res.data.length).toBe(initialLength);
        });

        test('Overwrite a ruleset → 401', async () => {
            await expect(
                axios.post(`${base}rulesets/420`, {
                    ...exampleRuleset,
                    name: 'test2',
                })
            ).rejects.toHaveProperty('response.status', 401);
        });

        test('Delete a ruleset → 401', async () => {
            await expect(
                axios.delete(`${base}rulesets/420`)
            ).rejects.toHaveProperty('response.status', 401);
        });
    });

    // ---------- 2. WITH “nothing” KEY -------------------------------------------------
    describe('Requests with "nothing" Api Key', () => {
        beforeAll(() => {
            axios.defaults.headers.common['X-API-KEY'] = nothing.api_key;
        });

        afterAll(() => {
            delete axios.defaults.headers.common['X-API-KEY'];
        });

        test('List all rulesets → 401', async () => {
            await expect(axios.get(`${base}rulesets`)).rejects.toHaveProperty(
                'response.status',
                401
            );
        });

        test('Show one ruleset → 401', async () => {
            await expect(
                axios.get(`${base}rulesets/420`)
            ).rejects.toHaveProperty('response.status', 401);
        });

        test('Create a ruleset → 401', async () => {
            await expect(
                axios.post(`${base}rulesets/420`, exampleRuleset)
            ).rejects.toHaveProperty('response.status', 401);
        });

        test('Overwrite a ruleset → 401', async () => {
            await expect(
                axios.post(`${base}rulesets/420`, {
                    ...exampleRuleset,
                    name: 'test2',
                })
            ).rejects.toHaveProperty('response.status', 401);
        });

        test('Delete a ruleset → 401', async () => {
            await expect(
                axios.delete(`${base}rulesets/420`)
            ).rejects.toHaveProperty('response.status', 401);
        });
    });

    // ---------- 3. WITH “all” KEY -----------------------------------------------------
    describe('Requests with "all" Api Key', () => {
        beforeAll(() => {
            axios.defaults.headers.common['X-API-KEY'] = all.api_key;
        });

        afterAll(() => {
            delete axios.defaults.headers.common['X-API-KEY'];
        });

        let initialLength = 0;

        test('List all rulesets', async () => {
            const res = await axios.get(`${base}rulesets`);
            expect(res.status).toBe(200);
            initialLength = res.data.length;
        });

        test('Show one ruleset that does not exist → 404', async () => {
            await expect(
                axios.get(`${base}rulesets/420`)
            ).rejects.toHaveProperty('response.status', 404);
        });

        test('Create a ruleset', async () => {
            const res = await axios.post(`${base}rulesets/420`, exampleRuleset);
            expect(res.status).toBe(201);
        });

        test('Body ID must match URL param → 400', async () => {
            await expect(
                axios.post(`${base}rulesets/422`, {
                    ...exampleRuleset,
                    id: '423',
                })
            ).rejects.toHaveProperty('response.status', 400);
        });

        test('Amount grew by 1', async () => {
            const res = await axios.get(`${base}rulesets`);
            expect(res.data.length).toBe(initialLength + 1);
        });

        test('Overwrite a ruleset', async () => {
            const res = await axios.post(`${base}rulesets/420`, {
                ...exampleRuleset,
                name: 'test2',
            });
            expect(res.status).toBe(201);
        });

        test('Read ruleset', async () => {
            const res = await axios.get(`${base}rulesets/420`);
            expect(res.data.name).toBe('test2');
        });

        test('Delete a ruleset', async () => {
            const res = await axios.delete(`${base}rulesets/420`);
            expect(res.status).toBe(204);
        });

        test('Amount back to initial', async () => {
            const res = await axios.get(`${base}rulesets`);
            expect(res.data.length).toBe(initialLength);
        });
    });

    // ---------- global teardown -------------------------------------------------------
    afterAll(async () => {
        await rita.deleteRuleset('420');
        await configDB.deleteApiKey(all);
        await configDB.deleteApiKey(nothing);
        await configDB.close();
        await rita.closeDBConnection();
    });
});
