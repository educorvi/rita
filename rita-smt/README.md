# Rita-SMT
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A module to test satisfiability of [Rita](https://github.com/educorvi/rita) rule sets.
## CLI
### Install
`npm -g install @educorvi/rita-smt`
### Usage
```bash
$ rita-smt --help
Usage: rita-smt [options] <filepath>

Arguments:
  filepath       Path to the file that contains the Rita ruleset

Options:
  -V, --version  output the version number
  --verbose      Output more information, e.g. the generated smt and the output of the sat solver
  -h, --help     display help for command
```

## Module
`yarn add @educorvi/rita-smt`

