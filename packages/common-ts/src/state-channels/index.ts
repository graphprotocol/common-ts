import * as connext from '@connext/client'
import { Sequelize } from 'sequelize'
import { ILogger } from '@connext/types'
import { getPostgresStore } from '@connext/store'

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

export const createStateChannel = async (options: StateChannelOptions) => {
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
  })
}
