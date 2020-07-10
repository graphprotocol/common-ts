import * as connext from '@connext/client'
import { Sequelize } from 'sequelize'
import { ILogger, IConnextClient } from '@connext/types'
import { getPostgresStore } from '@connext/store'
import { getSequelizeModelDefinitionData } from '@connext/store/dist/wrappers/sequelizeStorage'
import { storeDefaults } from '@connext/store/dist/constants'

interface StateChannelOptions {
  sequelize: Sequelize
  ethereumProvider: string
  connextNode: string
  connextMessaging: string
  logLevel: number
  logger?: ILogger
  privateKey: string
  storePrefix?: string // for multiple channels to share a sequelize instance
}

export const defineStateChannelStoreModels = async (
  sequelize: Sequelize,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<void> => {
  sequelize.define(
    storeDefaults.DATABASE_TABLE_NAME,
    getSequelizeModelDefinitionData(sequelize.getDialect() as 'postgres' | 'sqlite'),
  )
}

export const createStateChannel = async (
  options: StateChannelOptions,
): Promise<IConnextClient> => {
  // Create Sequelize-based store
  const store = getPostgresStore(options.sequelize, {
    prefix: options.storePrefix,
  })

  return await connext.connect({
    ethProviderUrl: options.ethereumProvider,
    nodeUrl: options.connextNode,
    messagingUrl: options.connextMessaging,
    store,
    signer: options.privateKey,
    logLevel: options.logLevel,
    logger: options.logger,
    skipInitStore: true,
  })
}
