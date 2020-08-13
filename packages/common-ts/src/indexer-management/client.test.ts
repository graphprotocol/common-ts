import { createIndexerManagementClient } from './client'
import { connectDatabase } from '../database'
import {
  defineIndexerManagementModels,
  IndexerManagementModels,
  IndexingDecisionBasis,
  INDEXING_RULE_GLOBAL,
} from './models'
import { Sequelize } from 'sequelize/types'
import gql from 'graphql-tag'

// Make global Jest variable available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const __DATABASE__: any

const SET_INDEXING_RULE_MUTATION = gql`
  mutation setIndexingRule($rule: IndexingRuleInput!) {
    setIndexingRule(rule: $rule) {
      id
      deployment
      allocation
      maxAllocationPercentage
      minSignal
      maxSignal
      minStake
      minAverageQueryFees
      custom
      decisionBasis
    }
  }
`

const DELETE_INDEXING_RULE_MUTATION = gql`
  mutation deleteIndexingRule($deployment: String!) {
    deleteIndexingRule(deployment: $deployment)
  }
`

const INDEXING_RULE_QUERY = gql`
  query indexingRule($deployment: String!) {
    indexingRule(deployment: $deployment) {
      id
      deployment
      allocation
      maxAllocationPercentage
      minSignal
      maxSignal
      minStake
      minAverageQueryFees
      custom
      decisionBasis
    }
  }
`

const INDEXING_RULES_QUERY = gql`
  {
    indexingRules {
      id
      deployment
      allocation
      maxAllocationPercentage
      minSignal
      maxSignal
      minStake
      minAverageQueryFees
      custom
      decisionBasis
    }
  }
`

let sequelize: Sequelize
let models: IndexerManagementModels

describe('Indexer API client', () => {
  describe('Indexing rules', () => {
    beforeEach(async () => {
      // Spin up db
      sequelize = await connectDatabase(__DATABASE__)
      models = defineIndexerManagementModels(sequelize)
      await sequelize.sync({ force: true })
    })

    afterEach(async () => {
      await sequelize.drop({})
    })

    test('Set and get global rule (partial)', async () => {
      const input = {
        deployment: INDEXING_RULE_GLOBAL,
        allocation: '1000',
      }

      const expected = {
        ...input,
        deployment: INDEXING_RULE_GLOBAL,
        maxAllocationPercentage: null,
        minSignal: null,
        maxSignal: null,
        minStake: null,
        minAverageQueryFees: null,
        custom: null,
        decisionBasis: IndexingDecisionBasis.RULES,
      }

      const client = await createIndexerManagementClient({ models })

      // Update the rule and ensure the right data is returned
      await expect(
        client.mutation(SET_INDEXING_RULE_MUTATION, { rule: input }).toPromise(),
      ).resolves.toHaveProperty('data.setIndexingRule', expected)

      // Query the rule to make sure it's updated in the db
      await expect(
        client
          .query(INDEXING_RULE_QUERY, { deployment: INDEXING_RULE_GLOBAL })
          .toPromise(),
      ).resolves.toHaveProperty('data.indexingRule', expected)
    })

    test('Set and get global rule (complete)', async () => {
      const input = {
        deployment: INDEXING_RULE_GLOBAL,
        allocation: '1',
        maxAllocationPercentage: 0.5,
        minSignal: '2',
        maxSignal: '3',
        minStake: '4',
        minAverageQueryFees: '5',
        custom: JSON.stringify({ foo: 'bar' }),
        decisionBasis: IndexingDecisionBasis.RULES,
      }

      const expected = {
        ...input,
      }

      const client = await createIndexerManagementClient({ models })

      // Update the rule
      await expect(
        client.mutation(SET_INDEXING_RULE_MUTATION, { rule: input }).toPromise(),
      ).resolves.toHaveProperty('data.setIndexingRule', expected)

      // Query the rule to make sure it's updated in the db
      await expect(
        client
          .query(INDEXING_RULE_QUERY, { deployment: INDEXING_RULE_GLOBAL })
          .toPromise(),
      ).resolves.toHaveProperty('data.indexingRule', expected)
    })

    test('Set and get global rule (partial update)', async () => {
      const originalInput = {
        deployment: INDEXING_RULE_GLOBAL,
        allocation: '1',
        minSignal: '2',
      }

      const original = {
        ...originalInput,
        maxAllocationPercentage: null,
        maxSignal: null,
        minStake: null,
        minAverageQueryFees: null,
        custom: null,
        decisionBasis: IndexingDecisionBasis.RULES,
      }

      const client = await createIndexerManagementClient({ models })

      // Write the orginal
      await expect(
        client.mutation(SET_INDEXING_RULE_MUTATION, { rule: originalInput }).toPromise(),
      ).resolves.toHaveProperty('data.setIndexingRule', original)

      const update = {
        deployment: INDEXING_RULE_GLOBAL,
        allocation: null,
        maxSignal: '3',
      }

      const expected = {
        ...original,
        ...update,
      }

      // Update the rule
      await expect(
        client.mutation(SET_INDEXING_RULE_MUTATION, { rule: update }).toPromise(),
      ).resolves.toHaveProperty('data.setIndexingRule', expected)

      // Query the rule to make sure it's updated in the db
      await expect(
        client
          .query(INDEXING_RULE_QUERY, { deployment: INDEXING_RULE_GLOBAL })
          .toPromise(),
      ).resolves.toHaveProperty('data.indexingRule', expected)
    })

    test('Set and get deployment rule (partial update)', async () => {
      const originalInput = {
        deployment: '0xa4e311bfa7edabed7b31d93e0b3e751659669852ef46adbedd44dc2454db4bf3',
        allocation: '1',
        minSignal: '2',
      }

      const original = {
        ...originalInput,
        maxAllocationPercentage: null,
        maxSignal: null,
        minStake: null,
        minAverageQueryFees: null,
        custom: null,
        decisionBasis: IndexingDecisionBasis.RULES,
      }

      const client = await createIndexerManagementClient({ models })

      // Write the orginal
      await expect(
        client.mutation(SET_INDEXING_RULE_MUTATION, { rule: originalInput }).toPromise(),
      ).resolves.toHaveProperty('data.setIndexingRule', original)

      const update = {
        deployment: '0xa4e311bfa7edabed7b31d93e0b3e751659669852ef46adbedd44dc2454db4bf3',
        allocation: null,
        maxSignal: '3',
      }

      const expected = {
        ...original,
        ...update,
      }

      // Update the rule
      await expect(
        client.mutation(SET_INDEXING_RULE_MUTATION, { rule: update }).toPromise(),
      ).resolves.toHaveProperty('data.setIndexingRule', expected)

      // Query the rule to make sure it's updated in the db
      await expect(
        client
          .query(INDEXING_RULE_QUERY, {
            deployment:
              '0xa4e311bfa7edabed7b31d93e0b3e751659669852ef46adbedd44dc2454db4bf3',
          })
          .toPromise(),
      ).resolves.toHaveProperty('data.indexingRule', expected)
    })

    test('Set and get global and deployment rule', async () => {
      const globalInput = {
        deployment: INDEXING_RULE_GLOBAL,
        allocation: '1',
        minSignal: '1',
        decisionBasis: IndexingDecisionBasis.NEVER,
      }

      const deploymentInput = {
        deployment: '0xa4e311bfa7edabed7b31d93e0b3e751659669852ef46adbedd44dc2454db4bf3',
        allocation: '1',
        minSignal: '2',
      }

      const globalExpected = {
        ...globalInput,
        maxAllocationPercentage: null,
        maxSignal: null,
        minStake: null,
        minAverageQueryFees: null,
        custom: null,
        decisionBasis: IndexingDecisionBasis.NEVER,
      }

      const deploymentExpected = {
        ...deploymentInput,
        maxAllocationPercentage: null,
        maxSignal: null,
        minStake: null,
        minAverageQueryFees: null,
        custom: null,
        decisionBasis: IndexingDecisionBasis.RULES,
      }

      const client = await createIndexerManagementClient({ models })

      // Write the orginals
      await expect(
        client.mutation(SET_INDEXING_RULE_MUTATION, { rule: globalInput }).toPromise(),
      ).resolves.toHaveProperty('data.setIndexingRule', globalExpected)
      await expect(
        client
          .mutation(SET_INDEXING_RULE_MUTATION, { rule: deploymentInput })
          .toPromise(),
      ).resolves.toHaveProperty('data.setIndexingRule', deploymentExpected)

      // Query the global rule
      await expect(
        client
          .query(INDEXING_RULE_QUERY, {
            deployment: INDEXING_RULE_GLOBAL,
          })
          .toPromise(),
      ).resolves.toHaveProperty('data.indexingRule', globalExpected)

      // Query the rule for the deployment
      await expect(
        client
          .query(INDEXING_RULE_QUERY, {
            deployment:
              '0xa4e311bfa7edabed7b31d93e0b3e751659669852ef46adbedd44dc2454db4bf3',
          })
          .toPromise(),
      ).resolves.toHaveProperty('data.indexingRule', deploymentExpected)

      // Query all rules together
      await expect(
        client.query(INDEXING_RULES_QUERY, {}).toPromise(),
      ).resolves.toHaveProperty('data.indexingRules', [
        globalExpected,
        deploymentExpected,
      ])
    })

    test('Set, delete and get rule', async () => {
      const input = {
        deployment: '0xa4e311bfa7edabed7b31d93e0b3e751659669852ef46adbedd44dc2454db4bf3',
        allocation: '1',
        minSignal: '2',
      }

      const expected = {
        ...input,
        maxAllocationPercentage: null,
        maxSignal: null,
        minStake: null,
        minAverageQueryFees: null,
        custom: null,
        decisionBasis: IndexingDecisionBasis.RULES,
      }

      const client = await createIndexerManagementClient({ models })

      // Write the rule
      await expect(
        client.mutation(SET_INDEXING_RULE_MUTATION, { rule: input }).toPromise(),
      ).resolves.toHaveProperty('data.setIndexingRule', expected)

      // Query all rules
      await expect(
        client.query(INDEXING_RULES_QUERY).toPromise(),
      ).resolves.toHaveProperty('data.indexingRules', [expected])

      // Delete the rule
      await expect(
        client
          .mutation(DELETE_INDEXING_RULE_MUTATION, { deployment: expected.deployment })
          .toPromise(),
      ).resolves.toHaveProperty('data.deleteIndexingRule', true)

      // Query all rules together
      await expect(
        client.query(INDEXING_RULES_QUERY, {}).toPromise(),
      ).resolves.toHaveProperty('data.indexingRules', [])
    })

    test('Clear a parameter', async () => {
      const input = {
        deployment: '0xa4e311bfa7edabed7b31d93e0b3e751659669852ef46adbedd44dc2454db4bf3',
        allocation: '1',
      }

      const expectedBefore = {
        ...input,
        maxAllocationPercentage: null,
        minSignal: null,
        maxSignal: null,
        minStake: null,
        minAverageQueryFees: null,
        custom: null,
        decisionBasis: IndexingDecisionBasis.RULES,
      }

      const client = await createIndexerManagementClient({ models })

      // Write the rule
      await expect(
        client.mutation(SET_INDEXING_RULE_MUTATION, { rule: input }).toPromise(),
      ).resolves.toHaveProperty('data.setIndexingRule', expectedBefore)

      // Query all rules
      await expect(
        client.query(INDEXING_RULES_QUERY).toPromise(),
      ).resolves.toHaveProperty('data.indexingRules', [expectedBefore])

      // Clear the allocation field
      await expect(
        client
          .mutation(SET_INDEXING_RULE_MUTATION, {
            rule: { ...expectedBefore, allocation: null },
          })
          .toPromise(),
      ).resolves.toHaveProperty('data.setIndexingRule', {
        ...expectedBefore,
        allocation: null,
      })
    })
  })
})
