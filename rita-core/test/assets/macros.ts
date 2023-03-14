import { DateTime } from 'luxon';

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
                    DateTime.fromISO('2022-04-22T13:14:12.122+02:00').toISO(),
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
