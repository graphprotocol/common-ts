# Common TypeScript library for Graph Protocol components

**NOTE: THIS PROJECT IS BETA SOFTWARE.**

## Documentation

`@graphprotocol/common-ts` is a TypeScript utility library for The Graph. It
currently provides the following functionality:

- Type-safe contract bindings to interact with The Graph Network on mainnet
  and rinkeby.

- Create query response attestations using
  [EIP-712](https://eips.ethereum.org/EIPS/eip-712).

- A GraphQL client to query The Graph Network network subgraph

- Graph Token (GRT) formatting and parsing.

- Validation and type-safe handling of subgraph deployment IDs.

- Type-safe and normalized Ethereum addresses.

Convenience features:

- Security ehancement for [Express](https://expressjs.com/) web servers.

- An easy-to-configure logger based on [pino](https://getpino.io/) with
  support for asynchronous logging and [Sentry](https://sentry.io) error
  reporting.

- A consistent way of connecting to [Postgres](https://www.postgresql.org/)
  using [Sequelize](https://sequelize.org/).

- Easy-to-use [Prometheus](https://prometheus.io/) metrics client and server.

- Eventuals: Asynchronously resolved, observable values that only emit values
  if they have changed. These are convenient to monitor, for instance, Graph
  Network data and only perform an action if it has changed.

## Copyright

Copyright &copy; 2021 The Graph Foundation.

Licensed under the [MIT license](./LICENSE).
