/* eslint-disable @typescript-eslint/ban-types */

import { IndexingRuleCreationAttributes } from '../models'
import { IndexerManagementResolverContext } from '../client'

export default {
  indexingRule: async (
    { deployment }: { deployment: string },
    { models }: IndexerManagementResolverContext,
  ): Promise<object | null> => {
    const rule = await models.IndexingRule.findOne({
      where: { deployment },
    })
    return rule?.toGraphQL() || null
  },

  indexingRules: async (
    _: {},
    { models }: IndexerManagementResolverContext,
  ): Promise<object[]> => {
    const rules = await models.IndexingRule.findAll({
      order: [['deployment', 'DESC']],
    })
    return rules.map((rule) => rule.toGraphQL()) || null
  },

  setIndexingRule: async (
    { rule }: { rule: IndexingRuleCreationAttributes },
    { models }: IndexerManagementResolverContext,
  ): Promise<object> => {
    await models.IndexingRule.upsert(rule)

    // Since upsert succeeded, we _must_ have a rule
    const updatedRule = await models.IndexingRule.findOne({
      where: { deployment: rule.deployment },
    })
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return updatedRule!.toGraphQL()
  },

  deleteIndexingRule: async (
    { deployment }: { deployment: string },
    { models }: IndexerManagementResolverContext,
  ): Promise<boolean> => {
    const numDeleted = await models.IndexingRule.destroy({
      where: {
        deployment,
      },
    })
    return numDeleted > 0
  },
}
