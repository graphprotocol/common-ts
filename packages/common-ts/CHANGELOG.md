# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Add `filter` eventual

## [0.2.9] - 2020-09-11
### Fixed
- Fix `timer` eventual to use `setInterval`, not `setTimeout`

## [0.2.8] - 2020-09-10
### Added
- Add `timer` and `reduce` eventuals

### Removed
- Remove `poll` eventual

## [0.2.7] - 2020-09-10
### Added
- Add dependency on `lodash.isequal`

### Fixed
- Fix equality checks of eventual values, especially for `Map` objects

## [0.2.6] - 2020-09-08
### Changed
- Rerelease to publish to private registry

## [0.2.5] - 2020-09-08
### Removed
- Move indexer management to indexer repository

### Added
- Add `Eventual<T>` concept
- Add `Address` type and `toAddress` converter for normalizing addresses

## [0.2.4] - 2020-09-01
### Changed
- Serve metrics from /metrics by default

## [0.2.3] - 2020-08-27
### Added
- More details provided by the `indexerEndpoints` GraphQL API

## [0.2.2] - 2020-08-27
### Added
- Optional `logger` argument for `IndexerManagementClient`

### Fixed
- Handle unavailable indexer endpoints correctly

## [0.1.0] - 2020-07-30
### Changed
- Update contracts to 0.4.7-testnet-phase1

## [0.0.51] - 2020-07-29
### Added
- Add optional `port` parameter to `createMetricsServer`

## [0.0.50] - 2020-07-23
### Changed
- Update Connext to 7.0.0

## [0.0.49] - 2020-07-15
### Added
- Add `timed` helper to measure promise execution time

### Changed
- Update prom-client from 11.x to 12.x
- Allow loggers to be silent
- Update Connext to 7.0.0-alpha.20

## [0.0.48] - 2020-07-10
### Added
- Add support for manually syncing state channel models to the db

### Changed
- Update Connext to 7.0.0-alpha.18
- Update sequelize from 5.x to 6.x

## [0.0.47] - 2020-07-06
### Added
- Add `display` property to `SubgraphDeploymentID`

## [0.0.46] - 2020-07-06
### Changed
- Customize logger interface

## [0.0.45] - 2020-07-06
### Fixed
- Fix tests relying on old logging

## [0.0.44] - 2020-07-06
### Changed
- Switch logging from winston to pino

## [0.0.43] - 2020-07-05
### Changed
- Update Connext to 7.0.0-alpha.11
- Update Connext to 7.0.0-alpha.13

## [0.0.41] - 2020-07-03
### Changed
- Switch to flat module exports

## [0.0.40] - 2020-07-03
### Added
- Add `subgraphs` module with `SubgraphName` and `SubgraphDeploymentID` types
- Configure eslint and automatic code formatting

## [0.0.39] - 2020-06-25
### Changed
- Switch to urql in the `NetworkSubgraphClient`

## [0.0.38] - 2020-06-25
### Changed
- Update Connext to 7.0.0-alpha.3

## [0.0.37] - 2020-06-23
### Changed
- Add TypeChain bindings back in

### Added
- Add `subgraph` module with a network subgraph client based on Apollo

## [0.0.35] - 2020-06-23
### Changed
- Revert TypeChain changes, as they don't work transitively

## [0.0.34] - 2020-06-23
### Changed
- Use contract factories for connecting to contracts

## [0.0.33] - 2020-06-23
### Added
- Add `contracts` module based on TypeChain bindings

### Changed
- Allow state channel test to take up to 30s
- Update dependencies

## [0.0.32] - 2020-06-12
### Changed
- Update to Connext 7.0.0-alpha.0
- Update to ethers 5.0.0-beta.191

## [0.0.31] - 2020-06-03
### Changed
- Rename subgraphID to subgraphDeploymentID in Attestation

## [0.0.30] - 2020-06-01
### Changed
- Fix hashStruct EIP712 function

## [0.0.28] - 2020-05-15
### Changed
- Update to Connext 6.5.0

## [0.0.27] - 2020-05-12
### Changed
- Reorganization attestation code and export Attestation interface

## [0.0.26] - 2020-05-12
### Added
- Add dependency on bs58
- Add rudimentary EIP-712 implementation
- Add support for creating attestations

## [0.0.25] - 2020-05-11
### Changed
- Update to Connext 6.3.12

## [0.0.24] - 2020-05-07
### Changed
- Update to Connext 6.3.9
- Allow state channels to use separate stores

## [0.0.23] - 2020-05-07
### Changed
- Create state channels using a private key instead of a mnemonic

## [0.0.22] - 2020-05-06
### Changed
- Update to Connext 6.3.8

## [0.0.21] - 2020-04-24
### Changed
- Update to Connext 6.0.9

## [0.0.20] - 2020-04-16
### Changed
- Update to Connext 6.0.3

## [0.0.18] - 2020-04-08
### Changed
- Update to Connext 6.0.0-alpha.10

## [0.0.17] - 2020-04-07
### Added
- Add `connextMessaging` option to `createStateChannel`

## [0.0.16] - 2020-04-07
### Changed
- Update to Connext 6.0.0-alpha.9

## [0.0.15] - 2020-04-06
### Changed
- Update to Connext 6.0.0-alpha.8

## [0.0.14] - 2020-04-03
### Changed
- Update to Connext 6.0.0-alpha.7

## [0.0.13] - 2020-03-19
### Changed
- Bump `@connext/client` and `@connext/types` to 5.2.1

## [0.0.12] - 2020-03-11
### Added
- Add optional `logger` option to createStateChannel

### Changed
- Bump `@connext/client` and `@connext/types` to 5.1.1

## [0.0.11] - 2020-03-05
### Changed
- Bump `@connext/client` and `@connext/types` to 5.0.2

## [0.0.10] - 2020-02-24
### Changed
- Update to Connext 4.2.0

## [0.0.9] - 2020-02-21
### Changed
- Update ethers to 4.0.45

## [0.0.8] - 2020-02-21
### Changed
- Update to Connext 4.1.0

## [0.0.7] - 2020-02-19
### Changed
- Downgrade ethers.js to 4.0.41 to be compatible with Connext

## [0.0.6] - 2020-02-19
### Added
- Optional `logLevel` option for `createStateChannel()`
- Export `Record` model from `stateChannels` module
- Implement `reset()` method of state channel store

### Fixed
- Upsert existing `Record`s instead of throwing

## [0.0.5] - 2020-02-19
### Changed
- Bump `@connext/client` and `@connext/types` to 4.0.16

## [0.0.4] - 2020-02-17
### Added
- Optional `logging` option for `database.connect()`

## [0.0.3] - 2020-02-17
### Added
- Ethereum provider and Connext node options for state channel setup

## [0.0.2] - 2020-02-17
### Changed
- Export `database`, `logging`, `metrics` and `stateChannel` modules separately

## 0.0.1 - 2020-02-17
### Added
- Common logging module based on winston
- Common metrics module for instrumenting components with Prometheus
- Common database module for simplifying database setup
- Connext client module with Postgres-based store implementation

[Unreleased]: https://github.com/graphprotocol/common/compare/v0.2.9...HEAD
[0.2.9]: https://github.com/graphprotocol/common/compare/v0.2.8...v0.2.9
[0.2.8]: https://github.com/graphprotocol/common/compare/v0.2.7...v0.2.8
[0.2.7]: https://github.com/graphprotocol/common/compare/v0.2.6...v0.2.7
[0.2.6]: https://github.com/graphprotocol/common/compare/v0.2.5...v0.2.6
[0.2.5]: https://github.com/graphprotocol/common/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/graphprotocol/common/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/graphprotocol/common/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/graphprotocol/common/compare/v0.1.0...v0.2.2
[0.1.0]: https://github.com/graphprotocol/common/compare/v0.0.51...v0.1.0
[0.0.51]: https://github.com/graphprotocol/common/compare/v0.0.50...v0.0.51
[0.0.50]: https://github.com/graphprotocol/common/compare/v0.0.49...v0.0.50
[0.0.49]: https://github.com/graphprotocol/common/compare/v0.0.48...v0.0.49
[0.0.48]: https://github.com/graphprotocol/common/compare/v0.0.47...v0.0.48
[0.0.47]: https://github.com/graphprotocol/common/compare/v0.0.46...v0.0.47
[0.0.46]: https://github.com/graphprotocol/common/compare/v0.0.45...v0.0.46
[0.0.45]: https://github.com/graphprotocol/common/compare/v0.0.44...v0.0.45
[0.0.44]: https://github.com/graphprotocol/common/compare/v0.0.43...v0.0.44
[0.0.43]: https://github.com/graphprotocol/common/compare/v0.0.41...v0.0.43
[0.0.41]: https://github.com/graphprotocol/common/compare/v0.0.40...v0.0.41
[0.0.40]: https://github.com/graphprotocol/common/compare/v0.0.39...v0.0.40
[0.0.39]: https://github.com/graphprotocol/common/compare/v0.0.38...v0.0.39
[0.0.38]: https://github.com/graphprotocol/common/compare/v0.0.37...v0.0.38
[0.0.37]: https://github.com/graphprotocol/common/compare/v0.0.35...v0.0.37
[0.0.35]: https://github.com/graphprotocol/common/compare/v0.0.34...v0.0.35
[0.0.34]: https://github.com/graphprotocol/common/compare/v0.0.33...v0.0.34
[0.0.33]: https://github.com/graphprotocol/common/compare/v0.0.32...v0.0.33
[0.0.32]: https://github.com/graphprotocol/common/compare/v0.0.31...v0.0.32
[0.0.31]: https://github.com/graphprotocol/common/compare/v0.0.30...v0.0.31
[0.0.30]: https://github.com/graphprotocol/common/compare/v0.0.28...v0.0.30
[0.0.28]: https://github.com/graphprotocol/common/compare/v0.0.27...v0.0.28
[0.0.27]: https://github.com/graphprotocol/common/compare/v0.0.26...v0.0.27
[0.0.26]: https://github.com/graphprotocol/common/compare/v0.0.25...v0.0.26
[0.0.25]: https://github.com/graphprotocol/common/compare/v0.0.24...v0.0.25
[0.0.24]: https://github.com/graphprotocol/common/compare/v0.0.23...v0.0.24
[0.0.23]: https://github.com/graphprotocol/common/compare/v0.0.22...v0.0.23
[0.0.22]: https://github.com/graphprotocol/common/compare/v0.0.21...v0.0.22
[0.0.21]: https://github.com/graphprotocol/common/compare/v0.0.20...v0.0.21
[0.0.20]: https://github.com/graphprotocol/common/compare/v0.0.18...v0.0.20
[0.0.18]: https://github.com/graphprotocol/common/compare/v0.0.17...v0.0.18
[0.0.17]: https://github.com/graphprotocol/common/compare/v0.0.16...v0.0.17
[0.0.16]: https://github.com/graphprotocol/common/compare/v0.0.15...v0.0.16
[0.0.15]: https://github.com/graphprotocol/common/compare/v0.0.14...v0.0.15
[0.0.14]: https://github.com/graphprotocol/common/compare/v0.0.13...v0.0.14
[0.0.13]: https://github.com/graphprotocol/common/compare/v0.0.12...v0.0.13
[0.0.12]: https://github.com/graphprotocol/common/compare/v0.0.11...v0.0.12
[0.0.11]: https://github.com/graphprotocol/common/compare/v0.0.10...v0.0.11
[0.0.10]: https://github.com/graphprotocol/common/compare/v0.0.9...v0.0.10
[0.0.9]: https://github.com/graphprotocol/common/compare/v0.0.8...v0.0.9
[0.0.8]: https://github.com/graphprotocol/common/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/graphprotocol/common/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/graphprotocol/common/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/graphprotocol/common/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/graphprotocol/common/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/graphprotocol/common/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/graphprotocol/common/compare/v0.0.1...v0.0.2
