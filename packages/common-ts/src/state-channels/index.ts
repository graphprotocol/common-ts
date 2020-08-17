import * as connext from '@connext/client'
import { DataTypes, Sequelize, ModelCtor, Model } from 'sequelize'
import { ILogger, IConnextClient } from '@connext/types'
import { getPostgresStore } from '@connext/store'
import { getSequelizeModelDefinitionData } from '@connext/store/dist/wrappers/sequelizeStorage'
import { storeDefaults } from '@connext/store/dist/constants'

interface StateChannelOptions {
  sequelize: Sequelize
  ethereumProvider: string
  connextNode: string
  connextMessaging: string
  logLevel: number
  logger?: ILogger
  privateKey: string
  storePrefix?: string // for multiple channels to share a sequelize instance
}

function getSupportedDialect(sequelize: Sequelize): 'postgres' | 'sqlite' {
  const dialect = sequelize.getDialect()
  if (dialect == 'postgres' || dialect == 'sqlite') {
    return dialect
  }
  throw new Error('Unsupported sequelize dialect. Expecting postgres or sqlite')
}

/**
 * Fields are all null
 */
export type NullFields<T> = { [P in keyof T]: null }

export type PaymentStoreModel = ModelCtor<Model<PaymentStore>>

/**
 * A Sequelize Model which has all fields loaded
 */
export type CompleteModel<T> = Model<T> & T

export type PaymentStoreUpdate = {
  // 'Virtual' data sent over read interface.
  // These can all be null because it is not part
  // of the app install
  totalPayment: HexBytes32
  requestCID: HexBytes32
  responseCID: HexBytes32
  consumerSignature: RawSignature
  attestationSignature: RawSignature
}

// See also b474a6ed-f054-4a2b-846a-39fc14425e40
// Matching schema
export type PaymentStore = {
  // Static app data
  paymentId: HexBytes32
  connextAppIdHash: HexBytes32
  totalCollateralization: HexBytes32
  channelId: HexBytes32
  // Whether or not we already played the final move for the app
  finished: boolean
} & (PaymentStoreUpdate | NullFields<PaymentStoreUpdate>)

export const defineStateChannelStoreModels = (
  sequelize: Sequelize,
): PaymentStoreModel => {
  const dialect = getSupportedDialect(sequelize)

  // Connext implementation
  sequelize.define(
    storeDefaults.DATABASE_TABLE_NAME,
    getSequelizeModelDefinitionData(dialect),
  )

  // 0x + (32 bytes * (2 chars / bytes)) = 66 chars
  const hexBytes32 = DataTypes.STRING(66)

  // v + r + s as a DataHexString
  // https://docs.ethers.io/v5/single-page/#/v5/api/utils/bytes/-%23-signature-raw
  const signature = DataTypes.STRING(132)

  function nonNull<T>(type: T): { type: T; allowNull: false } {
    return {
      type,
      allowNull: false,
    }
  }

  // TODO: HIGH (Zac) Add indexes

  // Batch payment app state
  // See also b474a6ed-f054-4a2b-846a-39fc14425e40
  // Matching schema
  const model = {
    paymentId: {
      primaryKey: true,
      ...nonNull(hexBytes32),
    },
    channelId: nonNull(hexBytes32),
    totalPayment: hexBytes32,
    requestCID: hexBytes32,
    responseCID: hexBytes32,
    attestationSignature: signature,
    consumerSignature: signature,
    connextAppIdHash: nonNull(hexBytes32),
    finished: nonNull(DataTypes.BOOLEAN),
    totalCollateralization: nonNull(hexBytes32),
  }
  return sequelize.define('payments', model)
}

export const createStateChannel = async (
  options: StateChannelOptions,
): Promise<IConnextClient> => {
  // Create Sequelize-based store
  const store = getPostgresStore(options.sequelize, {
    prefix: options.storePrefix,
  })

  return await connext.connect({
    ethProviderUrl: options.ethereumProvider,
    nodeUrl: options.connextNode,
    messagingUrl: options.connextMessaging,
    store,
    signer: options.privateKey,
    logLevel: options.logLevel,
    logger: options.logger,
    skipInitStore: true,
  })
}

export type Brand<K, T extends string> = K & { __brand: T }

/**
 * A 32 byte hex string prefixed by 0x. The total length of the string
 * will be 66 chars - 64 chars for the 32 bytes encoded as hex, and 2 chars
 * for the '0x' prefix.
 * */
export type HexBytes32 = Brand<string, 'HexBytes32'>

/**
 * A number within 0 <= n < 2^256
 */
export type Uint256 = Brand<bigint, 'Uint256'>

/**
 * Like HexBytes32, without the 0x prefix
 */
export type Bytes32 = Brand<string, 'Bytes32'>

/**
 * Same as RawSignature from the ethers docs
 */
export type RawSignature = Brand<string, 'RawSignature'>

/**
 * A type which when awaited returns T
 */
export type Awaitable<T> = T | Promise<T>
