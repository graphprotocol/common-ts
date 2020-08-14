/* eslint-disable @typescript-eslint/ban-types */

import { IndexingRuleCreationAttributes, INDEXING_RULE_GLOBAL } from '../models'
import { IndexerManagementResolverContext } from '../client'

export default {
  indexingRule: async (
    { deployment, merged }: { deployment: string; merged: boolean },
    { models }: IndexerManagementResolverContext,
  ): Promise<object | null> => {
    const rule = await models.IndexingRule.findOne({
      where: { deployment },
    })
    if (merged && rule) {
      return rule.mergeToGraphql(
        rule,
        await models.IndexingRule.findOne({
          where: { deployment: INDEXING_RULE_GLOBAL },
        }),
      )
    } else {
      return rule?.toGraphQL() || null
    }
  },

  indexingRules: async (
    { merged }: { merged: boolean },
    { models }: IndexerManagementResolverContext,
  ): Promise<object[]> => {
    const rules = await models.IndexingRule.findAll({
      order: [['deployment', 'DESC']],
    })
    if (merged) {
      const global_rule = await models.IndexingRule.findOne({
        where: { deployment: INDEXING_RULE_GLOBAL },
      })
      return rules.map((rule) => rule.mergeToGraphql(rule, global_rule))
    } else {
      return rules.map((rule) => rule.toGraphQL())
    }
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
