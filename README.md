# Common TypeScript library for Graph Protocol components

**NOTE: THIS PROJECT IS BETA SOFTWARE.**

[![CI](https://github.com/graphprotocol/common-ts/workflows/CI/badge.svg)](https://github.com/graphprotocol/common-ts/actions?query=workflow%3ACI)
[![Coverage](https://codecov.io/gh/graphprotocol/common-ts/branch/master/graph/badge.svg)](https://codecov.io/gh/graphprotocol/common-ts)

## Development notes

### General notes

- This repository is managed using [Lerna](https://lerna.js.org/) and [Yarn
  workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

- [Chan](https://github.com/geut/chan/tree/master/packages/chan) is used to
  maintain [changelogs](./packages/common-ts/CHANGELOG.md).

### Install dependencies

```sh
yarn
```

### Build

```sh
yarn prepublish
```

### Test

The following environment variables need to be defined for the test suite to run:

- `POSTGRES_TEST_HOST`
- `POSTGRES_TEST_PORT` (optional)
- `POSTGRES_TEST_USERNAME`
- `POSTGRES_TEST_PASSWORD`
- `POSTGRES_TEST_DATABASE`

After that, the test suite can be run with:

```sh
yarn test
```

## Copyright

Copyright &copy; 2020 The Graph Foundation.

Licensed under the [MIT license](LICENSE).
