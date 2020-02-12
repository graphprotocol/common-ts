import * as database from '..'
import { SequelizeConnextStore, Record } from './store'
import { randomBytes, hexlify } from 'ethers/utils'

// Make global Jest variable available
declare var __DATABASE__: any

describe('SequelizeConnextStore', () => {
  let store: SequelizeConnextStore

  beforeEach(async () => {
    // Prepare the database
    let sequelize = await database.connect(__DATABASE__)
    Record.initialize(sequelize)
    await sequelize.sync({ force: true })

    store = new SequelizeConnextStore(sequelize)
  })

  test('Stores and retrieves a channel record', async () => {
    const testXpub =
      'xpub6E3tjd9js7QMrBtYo7f157D7MwauL6MWdLzKekFaRBb3bvaQnUPjHKJcdNhiqSjhmwa6TcTjV1wSDTgvz52To2ZjhGMiQFbYie2N2LZpNx6'
    const userNeuteredExtendedKeys = [
      'xpub6E3tjd9js7QMrBtYo7f157D7MwauL6MWdLzKekFaRBb3bvaQnUPjHKJcdNhiqSjhmwa6TcTjV1wSDTgvz52To2ZjhGMiQFbYie2N2LZpNx6',
      'xpub6F3J5akuWKZLr6xaa6whvSQuCrBMTt3dACSDS6Wo6SyUxntgpid17TDW7GtFoz362r19WVbevmpQz9HM7Y4qWBNmyYWm7Unj4mU7PBJ8vXD',
    ]

    const testRecord = {
      path: `TEST_PREFIX/${testXpub}/channel/${testXpub}`,
      value: {
        multisigAddress: hexlify(randomBytes(20)),
        addresses: {
          proxyFactory: hexlify(randomBytes(20)),
          multisigMastercopy: hexlify(randomBytes(20)),
        },
        userNeuteredExtendedKeys,
        proposedAppInstances: [],
        appInstances: [],
        monotonicNumProposedApps: 1,
        singleAssetTwoPartyIntermediaryAgreements: [],
        schemaVersion: 1,
      },
    }

    // Verify setting the record works
    await store.set([testRecord], false)

    // Verify that retriving the same path returns the previously set value
    const value = await store.get(testRecord.path)
    expect(value).toMatchObject(testRecord.value)
  })
})
