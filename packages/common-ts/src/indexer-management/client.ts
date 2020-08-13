import { buildSchema, print } from 'graphql'
import gql from 'graphql-tag'
import { executeExchange } from '@urql/exchange-execute'
import { createClient, Client } from '@urql/core'
import { IndexerManagementModels } from './models'
import indexingRuleResolvers from './resolvers/indexing-rules'

export interface IndexerManagementResolverContext {
  models: IndexerManagementModels
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
    allocation: BigInt
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
    allocation: BigInt
    maxAllocationPercentage: Float
    minSignal: BigInt
    maxSignal: BigInt
    minStake: BigInt
    minAverageQueryFees: BigInt
    custom: String
    decisionBasis: IndexingDecisionBasis
  }

  type Query {
    indexingRule(deployment: String!): IndexingRule
    indexingRules: [IndexingRule!]!
  }

  type Mutation {
    setIndexingRule(rule: IndexingRuleInput!): IndexingRule!
    deleteIndexingRule(deployment: String!): Boolean!
  }
`

export interface IndexerManagementClientOptions {
  models: IndexerManagementModels
}

export type IndexerManagementClient = Client

export const createIndexerManagementClient = async ({
  models,
}: IndexerManagementClientOptions): Promise<Client> => {
  const schema = buildSchema(print(SCHEMA_SDL))
  const resolvers = {
    ...indexingRuleResolvers,
  }

  const exchange = executeExchange({
    schema,
    rootValue: resolvers,
    context: {
      models,
    },
  })

  return createClient({ url: 'no-op', exchanges: [exchange] })
}
