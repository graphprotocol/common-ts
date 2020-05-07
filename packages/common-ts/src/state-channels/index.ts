import * as connext from '@connext/client'
import { Sequelize } from 'sequelize'
import { ILogger, StoreTypes } from '@connext/types'
import { ConnextStore, WrappedPostgresStorage } from '@connext/store'

interface StateChannelOptions {
  sequelize: Sequelize
  ethereumProvider: string
  connextNode: string
  connextMessaging: string
  logLevel: number
  logger?: ILogger
  privateKey: string
}

export const createStateChannel = async (options: StateChannelOptions) => {
  // Create Sequelize-based store
  const wrappedPostgresStorage = new WrappedPostgresStorage(
    undefined, // use default
    undefined, // use default
    undefined, // use default
    options.sequelize,
  )
  const store = new ConnextStore(StoreTypes.Postgres, { storage: wrappedPostgresStorage })
  await wrappedPostgresStorage.syncModels()

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
