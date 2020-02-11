import * as connext from '@connext/client'
import { Sequelize } from 'sequelize'
import { Store } from '@connext/types'

interface StateChannelOptions {
  network: 'rinkeby'
  db: Sequelize
}

export const createStateChannel = async (options: StateChannelOptions) => {
  // TODO: Create Sequelize-based store
  // TODO: Define key generation

  return await connext.connect(options.network, {
    store: undefined,
    keyGen: undefined,
  })
}
