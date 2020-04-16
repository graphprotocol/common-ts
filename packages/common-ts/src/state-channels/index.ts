import * as connext from '@connext/client'
import { Sequelize } from 'sequelize'
import { ILogger, StoreTypes } from '@connext/types'
import {
  ConnextStore,
  WrappedPostgresStorage,
  DEFAULT_STORE_PREFIX,
  DEFAULT_STORE_SEPARATOR,
  DEFAULT_DATABASE_STORAGE_TABLE_NAME,
} from '@connext/store'
import { Wallet } from 'ethers'

interface StateChannelOptions {
  sequelize: Sequelize
  mnemonic: string
  ethereumProvider: string
  connextNode: string
  connextMessaging: string
  logLevel: number
  logger?: ILogger
}

export const createStateChannel = async (options: StateChannelOptions) => {
  // Create Sequelize-based store
  const wrappedPostgresStorage = new WrappedPostgresStorage(
    DEFAULT_STORE_PREFIX,
    DEFAULT_STORE_SEPARATOR,
    DEFAULT_DATABASE_STORAGE_TABLE_NAME,
    options.sequelize,
  )
  const store = new ConnextStore(StoreTypes.Postgres, { storage: wrappedPostgresStorage })
  await wrappedPostgresStorage.syncModels();

  // Create in-memory wallet from the mnemonic
  // We can replace this with just a private key if we don't want to instantiate
  // with a mnemonic
  const wallet = Wallet.fromMnemonic(options.mnemonic);

  return await connext.connect({
    ethProviderUrl: options.ethereumProvider,
    nodeUrl: options.connextNode,
    messagingUrl: options.connextMessaging,
    store,
    signer: wallet.privateKey,
    logLevel: options.logLevel,
    logger: options.logger,
  })
}
