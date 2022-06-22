# Rule It All _(Rita)_

[![Build & Test](https://github.com/educorvi/rita/actions/workflows/build&test.yml/badge.svg)](https://github.com/educorvi/rita/actions/workflows/build&test.yml)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

Rita is a project to enable rule based processing of data.
It consists of:

-   [`rita-core`](https://github.com/educorvi/rita/tree/main/rita-core), the core package that is used to parse and evaluate rules.
-   [`persistent-rita`](https://github.com/educorvi/rita/tree/main/persistent-rita), used to persist rules
-   [`rita-http`](https://github.com/educorvi/rita/tree/main/rita-http), a REST-API to evaluate rules
-   _[`rita-smt`](https://github.com/educorvi/rita/tree/main/rita-smt), Rita and SMT_ (EXPERIMENTAL)

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
