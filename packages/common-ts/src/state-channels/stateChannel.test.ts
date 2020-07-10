/* eslint-disable @typescript-eslint/no-explicit-any */

import { connectDatabase } from '../database'
import { createStateChannel, defineStateChannelStoreModels } from '.'
import { Wallet } from 'ethers'

// Make global Jest variable available
declare const __DATABASE__: any
declare const __INDRA__: any

describe('State Channel', () => {
  test('creates a state channel', async () => {
    const sequelize = await connectDatabase(__DATABASE__)
    await defineStateChannelStoreModels(sequelize)
    await sequelize.sync()

    if (
      !__INDRA__.ethereumProvider ||
      !__INDRA__.connextNode ||
      !__INDRA__.connextMessaging
    ) {
      console.error(`Do not run tests, Indra env vars not defined:`, __INDRA__)
      // return true, not sure if we want to bail on tests here
      expect(true).toBeTruthy()
      return
    }
    const connextClient = await createStateChannel({
      ...__INDRA__,
      sequelize,
      privateKey: Wallet.createRandom().privateKey,
      logLevel: 3,
    })
    expect(connextClient.multisigAddress).toBeTruthy()
  }, 30000)
})
