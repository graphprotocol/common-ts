/* eslint-disable @typescript-eslint/no-empty-interface */

import { Optional, Model, DataTypes, Sequelize } from 'sequelize'

export enum IndexingDecisionBasis {
  RULES = 'rules',
  NEVER = 'never',
  ALWAYS = 'always',
}

export const INDEXING_RULE_GLOBAL = 'global'

export interface IndexingRuleAttributes {
  id: number
  deployment: string
  allocation: string | null
  maxAllocationPercentage: number | null
  minSignal: string | null
  maxSignal: string | null
  minStake: string | null
  minAverageQueryFees: string | null
  custom: string | null
  decisionBasis: IndexingDecisionBasis
}

export interface IndexingRuleCreationAttributes
  extends Optional<
    IndexingRuleAttributes,
    | 'id'
    | 'allocation'
    | 'maxAllocationPercentage'
    | 'minSignal'
    | 'maxSignal'
    | 'minStake'
    | 'minAverageQueryFees'
    | 'custom'
    | 'decisionBasis'
  > {}

export class IndexingRule
  extends Model<IndexingRuleAttributes, IndexingRuleCreationAttributes>
  implements IndexingRuleAttributes {
  public id!: number
  public deployment!: string
  public allocation!: string | null
  public maxAllocationPercentage!: number | null
  public minSignal!: string | null
  public maxSignal!: string | null
  public minStake!: string | null
  public minAverageQueryFees!: string | null
  public custom!: string | null
  public decisionBasis!: IndexingDecisionBasis

  public createdAt!: Date
  public updatedAt!: Date

  // eslint-disable-next-line @typescript-eslint/ban-types
  public toGraphQL(): object {
    return { ...this.toJSON(), __typename: 'IndexingRule' }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public mergeToGraphql(rule: IndexingRule, global_rule: IndexingRule | null): object {
    if (global_rule instanceof IndexingRule) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const global: { [key: string]: any } | null = global_rule.toJSON()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const deployment: { [key: string]: any } | null = rule.toJSON()
      for (const k in global) {
        if (null == deployment[k]) {
          deployment[k] = global[k]
        }
      }
      for (const k in deployment) {
        if (deployment[k] == undefined) {
          deployment[k] = global[k]
        }
      }
      return { ...deployment, __typename: 'IndexingRule' }
    } else {
      return rule.toGraphQL()
    }
  }
}

export const models = {
  ['IndexingRule']: IndexingRule,
}

export type IndexerManagementModels = typeof models

export const defineIndexerManagementModels = (
  sequelize: Sequelize,
): IndexerManagementModels => {
  IndexingRule.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
      },
      deployment: {
        type: DataTypes.STRING,
        allowNull: true,
        primaryKey: true,
      },
      allocation: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      maxAllocationPercentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      minSignal: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      minStake: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      maxSignal: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      minAverageQueryFees: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      custom: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      decisionBasis: {
        type: DataTypes.ENUM('rules', 'never', 'always'),
        allowNull: false,
        defaultValue: 'rules',
      },
    },
    {
      modelName: 'IndexingRule',
      sequelize,
    },
  )

  return models
}
