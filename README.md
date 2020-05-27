# Common TypeScript library for Graph Protocol components

[![CI](https://github.com/graphprotocol/common-ts/workflows/CI/badge.svg)](https://github.com/graphprotocol/common-ts/actions?query=workflow%3ACI)
[![codecov](https://codecov.io/gh/graphprotocol/common-ts/branch/master/graph/badge.svg)](https://codecov.io/gh/graphprotocol/common-ts)
[![Documentation](https://img.shields.io/badge/API-documentation-brightgreen.svg)](https://graphprotocol.github.io/common-ts/)

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

The following are optional for testing the state channel client:
- `ETHEREUM_PROVIDER`
- `CONNEXT_NODE`

After that, the test suite can be run with:

```sh
yarn test
```

## Copyright

Copyright &copy; 2020 Graph Protocol, Inc. and contributors.

The Graph is dual-licensed under the [MIT license](LICENSE-MIT) and the
[Apache License, Version 2.0](LICENSE-APACHE).

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied. See the
License for the specific language governing permissions and limitations under
the License.
