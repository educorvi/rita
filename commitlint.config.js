module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'footer-max-line-length': [1, 'always', 100],
        'header-max-length': [1, 'always', 100],
        'scope-enum': [
            2,
            'always',
            [
                'core',
                'persistent-rita',
                'smtlib',
                'rita-smt',
                'rita-plugin-http',
                'rita-http',
            ],
        ],
    },
};
