import { buildSchema, print } from 'graphql'
import gql from 'graphql-tag'
import { executeExchange } from '@urql/exchange-execute'
import { createClient, Client } from '@urql/core'
import { IndexerManagementModels } from './models'
import indexingRuleResolvers from './resolvers/indexing-rules'
import indexingStatusResolvers from './resolvers/indexer-status'
import { NetworkContracts } from '../contracts'

export interface IndexerManagementResolverContext {
  models: IndexerManagementModels
  configs: IndexerConfigs
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

  type IndexerStatus {
    indexerUrl: String!
    indexerAddress: String!
    isRegistered: Boolean!
    registeredUrl: String
  }

  type Query {
    indexingRule(deployment: String!, merged: Boolean! = false): IndexingRule
    indexingRules(merged: Boolean! = false): [IndexingRule!]!
    indexerStatus: IndexerStatus
  }

  type Mutation {
    setIndexingRule(rule: IndexingRuleInput!): IndexingRule!
    deleteIndexingRule(deployment: String!): Boolean!
  }
`

export interface IndexerManagementClientOptions {
  models: IndexerManagementModels
  address: string
  url: string
  contracts: NetworkContracts
}

export interface IndexerConfigs {
  address: string
  url: string
}

export type IndexerManagementClient = Client

export const createIndexerManagementClient = async ({
  models,
  address,
  url,
  contracts,
}: IndexerManagementClientOptions): Promise<Client> => {
  const schema = buildSchema(print(SCHEMA_SDL))
  const resolvers = {
    ...indexingRuleResolvers,
    ...indexingStatusResolvers,
  }
  const configs: IndexerConfigs = { address, url }

  const exchange = executeExchange({
    schema,
    rootValue: resolvers,
    context: {
      models,
      configs,
      contracts,
    },
  })

  return createClient({ url: 'no-op', exchanges: [exchange] })
}
