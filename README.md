# Rule It All _(Rita)_

[![Build, Test & Release](https://github.com/educorvi/rita/actions/workflows/build_test_release.yml/badge.svg?branch=main)](https://github.com/educorvi/rita/actions/workflows/build_test_release.yml)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Feducorvi%2Frita.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Feducorvi%2Frita?ref=badge_shield)

Rita is a project to enable rule based processing of data.
It consists of:

-   [`rita-core`](https://github.com/educorvi/rita/tree/main/rita-core), the core package that is used to parse and evaluate rules.
-   [`persistent-rita`](https://github.com/educorvi/rita/tree/main/persistent-rita), used to persist rules
-   [`rita-http`](https://github.com/educorvi/rita/tree/main/rita-http), a REST-API to evaluate rules
-   _[`rita-smt`](https://github.com/educorvi/rita/tree/main/rita-smt), Rita and SMT_ (EXPERIMENTAL)

## Documentation

https://educorvi.github.io/rita/

## Setup

```bash
# clone repository
git clone https://github.com/educorvi/rita.git
cd rita

# Install dependencies and build project
./setup.sh

# Open rita-http folder
cd rita-http

# Set environment variables
cp .env.template .env
vim .env

# Start server
node .
```

The update process is identical, just replace `git clone` with `git pull`

## Development

```bash
# Generate documentation
rush generate-documentation
```


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Feducorvi%2Frita.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Feducorvi%2Frita?ref=badge_large)