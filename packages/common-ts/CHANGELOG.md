# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/graphprotocol/common/compare/v0.0.4...HEAD
[0.0.4]: https://github.com/graphprotocol/common/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/graphprotocol/common/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/graphprotocol/common/compare/v0.0.1...v0.0.2
