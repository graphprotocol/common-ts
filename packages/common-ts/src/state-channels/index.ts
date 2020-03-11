import * as connext from '@connext/client'
import { Sequelize } from 'sequelize'
import { Store, CF_PATH, ILogger } from '@connext/types'
import { HDNode } from 'ethers/utils'
import { SequelizeConnextStore } from './store'

export { Record } from './store'

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
  let store = new SequelizeConnextStore(options.sequelize)

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
