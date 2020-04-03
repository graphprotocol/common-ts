import { Sequelize } from 'sequelize/types'
import { connect as dbConnect } from '../database'
import { createStateChannel } from '.'
import { Wallet } from 'ethers'

// Make global Jest variable available
declare var __DATABASE__: any
declare var __INDRA__: any

describe('State Channel', () => {
  test('creates a state channel', async () => {
    const sequelize = await dbConnect(__DATABASE__)
    if (!__INDRA__.ethereumProvider || !__INDRA__.connextNode) {
      console.error(`Do not run tests, Indra env vars not defined: ${__INDRA__}`)
      // return true, not sure if we want to bail on tests here
      expect(true).toBeTruthy()
      return
    }
    const connextClient = await createStateChannel({
      ...__INDRA__,
      sequelize,
      mnemonic: Wallet.createRandom().mnemonic,
      logLevel: 3,
    })
    expect(connextClient.multisigAddress).toBeTruthy()
  })
})
