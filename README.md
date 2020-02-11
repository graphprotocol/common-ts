# Common TypeScript library for Graph Protocol components

[![Build Status](https://travis-ci.com/graphprotocol/common.svg?branch=master)](https://travis-ci.com/graphprotocol/common)
[![codecov](https://codecov.io/gh/graphprotocol/common/branch/master/graph/badge.svg)](https://codecov.io/gh/graphprotocol/common)
[![Documentation](https://img.shields.io/badge/API-documentation-brightgreen.svg)](https://graphprotocol.github.io/common/)

## Development notes

### General notes

- This repository is managed using [Lerna](https://lerna.js.org/) and [Yarn
  workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

- [Chan](https://github.com/geut/chan/tree/master/packages/chan) is used to
  maintain [changelogs](./packages/common/CHANGELOG.md).

### Build

```sh
yarn prepublish
```

### Test

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
