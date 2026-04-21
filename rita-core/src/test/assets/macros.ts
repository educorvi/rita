import { Temporal } from 'temporal-polyfill';

export default {
    $schema: '../../src/schema/schema.json',
    rules: [
        {
            id: 'r1',
            comment: '',
            rule: {
                type: 'comparison',
                operation: 'greater',
                dates: true,
                arguments: [
                    {
                        type: 'macro',
                        macro: {
                            type: 'now',
                        },
                    },
                    Temporal.Instant.from(
                        '2022-04-22T11:14:12.122Z'
                    ).toString(),
                ],
            },
        },
        {
            id: 'r2',
            comment: '',
            rule: {
                type: 'comparison',
                operation: 'equal',
                arguments: [
                    {
                        type: 'macro',
                        macro: {
                            type: 'length',
                            array: {
                                type: 'atom',
                                path: 'customers',
                            },
                        },
                    },
                    2,
                ],
            },
        },
    ],
};
