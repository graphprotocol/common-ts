import { database } from '..'
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

  test('Stores and retrieves a record', async () => {
    const testRecord = {
      path: "test123",
      value: { data: "this is a test" }
    }

    // Verify setting the record works
    await store.set([testRecord])

    // Verify that retriving the same path returns the previously set value
    const value = await store.get(testRecord.path)
    expect(value).toMatchObject(testRecord.value)
  })

  test('Stores and retrieves a channel record', async () => {
    const testXpub =
      'xpub6E3tjd9js7QMrBtYo7f157D7MwauL6MWdLzKekFaRBb3bvaQnUPjHKJcdNhiqSjhmwa6TcTjV1wSDTgvz52To2ZjhGMiQFbYie2N2LZpNx6'
    const userNeuteredExtendedKeys = [
      'xpub6E3tjd9js7QMrBtYo7f157D7MwauL6MWdLzKekFaRBb3bvaQnUPjHKJcdNhiqSjhmwa6TcTjV1wSDTgvz52To2ZjhGMiQFbYie2N2LZpNx6',
      'xpub6F3J5akuWKZLr6xaa6whvSQuCrBMTt3dACSDS6Wo6SyUxntgpid17TDW7GtFoz362r19WVbevmpQz9HM7Y4qWBNmyYWm7Unj4mU7PBJ8vXD',
    ]

    const multisigAddress1 = hexlify(randomBytes(20))
    const testRecord1 = {
      path: `TEST_PREFIX/${testXpub}/channel/${multisigAddress1}`,
      value: {
        multisigAddress: multisigAddress1,
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

    const multisigAddress2 = hexlify(randomBytes(20))
    const testRecord2 = {
      path: `TEST_PREFIX/${testXpub}/channel/${testXpub}`,
      value: {
        multisigAddress: multisigAddress2,
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

    // Verify setting multiple records at once works
    await store.set([testRecord1, testRecord2])

    // Verify that retriving the special case `channel` path properly nests records
    const value = await store.get(`TEST_PREFIX/${testXpub}/channel`)
    expect(value[multisigAddress1]).toMatchObject(testRecord1.value)
    expect(value[multisigAddress2]).toMatchObject(testRecord2.value)
  })

  test('Cannot store a channel without a multisig', async () => {
    const testXpub =
      'xpub6E3tjd9js7QMrBtYo7f157D7MwauL6MWdLzKekFaRBb3bvaQnUPjHKJcdNhiqSjhmwa6TcTjV1wSDTgvz52To2ZjhGMiQFbYie2N2LZpNx6'
    const testRecord = {
      path: `TEST_PREFIX/${testXpub}/channel/${hexlify(randomBytes(20))}`,
      value: {
        addresses: {
          proxyFactory: hexlify(randomBytes(20)),
          multisigMastercopy: hexlify(randomBytes(20)),
        },
      },
    }

    // Verify setting the record fails
    expect(store.set([testRecord])).rejects.toThrowError(/multisigAddress is required for channel values/);
  })
})
