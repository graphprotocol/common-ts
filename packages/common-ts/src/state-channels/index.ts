import * as connext from '@connext/client'
import { Sequelize } from 'sequelize'
import { CF_PATH, ILogger, StoreTypes } from '@connext/types'
import { HDNode } from 'ethers/utils'
import {
  ConnextStore,
  KeyValueStorage,
  WrappedPostgresStorage,
  DEFAULT_STORE_PREFIX,
  DEFAULT_STORE_SEPARATOR,
  DEFAULT_DATABASE_STORAGE_TABLE_NAME,
} from '@connext/store'

interface StateChannelOptions {
  sequelize: Sequelize
  mnemonic: string
  ethereumProvider: string
  connextNode: string
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

  // Create in-memory HDWallet from the mnemonic
  const hdNode = HDNode.fromMnemonic(options.mnemonic).derivePath(CF_PATH)

  // Obtain extended public key from the HDWallet
  const xpub = hdNode.neuter().extendedKey

  // Key derivation function
  const keyGen = async (index: string) => hdNode.derivePath(index).privateKey

  return await connext.connect({
    ethProviderUrl: options.ethereumProvider,
    nodeUrl: options.connextNode,
    store,
    keyGen,
    xpub,
    logLevel: options.logLevel,
    logger: options.logger,
  })
}
