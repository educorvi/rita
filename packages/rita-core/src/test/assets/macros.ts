import dayjs from 'dayjs';

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
                    dayjs('2022-04-22T13:14:12.122+02:00').toISOString(),
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
