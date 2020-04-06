# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/graphprotocol/common/compare/v0.0.15...HEAD
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
