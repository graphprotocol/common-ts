import * as database from '..'
import { SequelizeConnextStore } from './store'
import { Store, StorePair } from '@connext/types'

// Make global Jest variable available
declare var __DATABASE__: any

describe('SequelizeConnextStore', () => {
  let store: SequelizeConnextStore

  beforeEach(async () => {
    let sequelize = await database.connect(__DATABASE__)
    store = new SequelizeConnextStore(sequelize)
  })

  test('TODO', () => {})
})
