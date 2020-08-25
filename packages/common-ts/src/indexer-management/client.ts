import { buildSchema, print } from 'graphql'
import gql from 'graphql-tag'
import { executeExchange } from '@urql/exchange-execute'
import { createClient, Client } from '@urql/core'
import { IndexerManagementModels } from './models'
import indexingRuleResolvers from './resolvers/indexing-rules'
import statusResolvers from './resolvers/indexer-status'
import { NetworkContracts } from '../contracts'

export interface IndexerManagementResolverContext {
  models: IndexerManagementModels
  address: string
  contracts: NetworkContracts
}

const SCHEMA_SDL = gql`
  scalar BigInt

  enum IndexingDecisionBasis {
    rules
    never
    always
  }

  type IndexingRule {
    deployment: String!
    allocationAmount: BigInt
    parallelAllocations: Int
    maxAllocationPercentage: Float
    minSignal: BigInt
    maxSignal: BigInt
    minStake: BigInt
    minAverageQueryFees: BigInt
    custom: String
    decisionBasis: IndexingDecisionBasis!
  }

  input IndexingRuleInput {
    deployment: String!
    allocationAmount: BigInt
    parallelAllocations: Int
    maxAllocationPercentage: Float
    minSignal: BigInt
    maxSignal: BigInt
    minStake: BigInt
    minAverageQueryFees: BigInt
    custom: String
    decisionBasis: IndexingDecisionBasis
  }

  type GeoLocation {
    latitude: String!
    longitude: String!
  }

  type IndexerRegistration {
    url: String
    address: String
    registered: Boolean!
    location: GeoLocation
  }

  type IndexerEndpoint {
    url: String
    healthy: Boolean!
  }

  type IndexerEndpoints {
    service: IndexerEndpoint!
    status: IndexerEndpoint!
    channels: IndexerEndpoint!
  }

  type Query {
    indexingRule(deployment: String!, merged: Boolean! = false): IndexingRule
    indexingRules(merged: Boolean! = false): [IndexingRule!]!
    indexerRegistration: IndexerRegistration!
    indexerEndpoints: IndexerEndpoints!
  }

  type Mutation {
    setIndexingRule(rule: IndexingRuleInput!): IndexingRule!
    deleteIndexingRule(deployment: String!): Boolean!
  }
`

export interface IndexerManagementClientOptions {
  models: IndexerManagementModels
  address: string
  contracts: NetworkContracts
}

export type IndexerManagementClient = Client

export const createIndexerManagementClient = async ({
  models,
  address,
  contracts,
}: IndexerManagementClientOptions): Promise<Client> => {
  const schema = buildSchema(print(SCHEMA_SDL))
  const resolvers = {
    ...indexingRuleResolvers,
    ...statusResolvers,
  }

  const exchange = executeExchange({
    schema,
    rootValue: resolvers,
    context: {
      models,
      address,
      contracts,
    },
  })

  return createClient({ url: 'no-op', exchanges: [exchange] })
}
