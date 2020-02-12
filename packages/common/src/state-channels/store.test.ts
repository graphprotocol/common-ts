import * as database from '..'
import { SequelizeConnextStore, Record } from './store'
import { randomBytes, hexlify } from 'ethers/utils'

// Make global Jest variable available
declare var __DATABASE__: any

describe('SequelizeConnextStore', () => {
  let store: SequelizeConnextStore

  beforeEach(async () => {
    let sequelize = await database.connect(__DATABASE__)
    // TODO: this might not be working, had to manually add the table into the db
    await sequelize.sync({ force: true })
    store = new SequelizeConnextStore(sequelize)
    await Record.destroy({ truncate: true })
  })

  test('should store and retrieve a channel record', async () => {
    const testStorePrefix = 'TEST_PREFIX'
    const testXpub = 'xpub6E3tjd9js7QMrBtYo7f157D7MwauL6MWdLzKekFaRBb3bvaQnUPjHKJcdNhiqSjhmwa6TcTjV1wSDTgvz52To2ZjhGMiQFbYie2N2LZpNx6'
    const multisigAddress = hexlify(randomBytes(20))
    const proxyFactory = hexlify(randomBytes(20))
    const multisigMastercopy = hexlify(randomBytes(20))
    const userNeuteredExtendedKeys = [
      'xpub6E3tjd9js7QMrBtYo7f157D7MwauL6MWdLzKekFaRBb3bvaQnUPjHKJcdNhiqSjhmwa6TcTjV1wSDTgvz52To2ZjhGMiQFbYie2N2LZpNx6',
      'xpub6F3J5akuWKZLr6xaa6whvSQuCrBMTt3dACSDS6Wo6SyUxntgpid17TDW7GtFoz362r19WVbevmpQz9HM7Y4qWBNmyYWm7Unj4mU7PBJ8vXD',
    ]
    const testRecordPath =
      `${testStorePrefix}/${testXpub}/channel/${testXpub}`
    const testRecordValue = {
      multisigAddress,
      addresses: {
        proxyFactory,
        multisigMastercopy,
      },
      userNeuteredExtendedKeys,
      proposedAppInstances: [],
      appInstances: [],
      monotonicNumProposedApps: 1,
      singleAssetTwoPartyIntermediaryAgreements: [],
      schemaVersion: 1,
    }

    await store.set([{ path: testRecordPath, value: testRecordValue }], false)

    const retrieved = await store.get(testRecordPath)
    expect(retrieved).toMatchObject({
      multisigAddress,
      addresses: {
        proxyFactory,
        multisigMastercopy,
      },
      userNeuteredExtendedKeys,
      proposedAppInstances: [],
      appInstances: [],
      monotonicNumProposedApps: 1,
      singleAssetTwoPartyIntermediaryAgreements: [],
      schemaVersion: 1,
    })
  })
})
