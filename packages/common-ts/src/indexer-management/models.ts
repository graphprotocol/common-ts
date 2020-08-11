/* eslint-disable @typescript-eslint/no-empty-interface */

import { Optional, Model, DataTypes, Sequelize } from 'sequelize'

export enum IndexingDecision {
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
  indexingDecision: IndexingDecision
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
    | 'indexingDecision'
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
  public indexingDecision!: IndexingDecision

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // eslint-disable-next-line @typescript-eslint/ban-types
  public toGraphQL(): object {
    return { ...this.toJSON(), __typename: 'IndexingRule' }
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
      indexingDecision: {
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
