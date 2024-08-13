/* eslint-disable @typescript-eslint/no-explicit-any */

import { connectDatabase } from '.'

// Make global Jest variable available
declare const __DATABASE__: any

describe('Database', () => {
  test('Connect', async () => {
    const sequelize = await connectDatabase(__DATABASE__)
    expect(sequelize).toBeDefined()
  })

  test('Connect with options set', async () => {
    const sequelize = await connectDatabase({
      host: 'localhost',
      username: 'test',
      password: 'test',
      database: 'test',
      sslEnabled: true,
      logging: () => {},
      poolMin: 1,
      poolMax: 5,
    })

    expect(sequelize).toBeDefined()

    const poolConfig = sequelize.config.pool
    expect(poolConfig?.min).toBe(1)
    expect(poolConfig?.max).toBe(5)

    const sslConfig = sequelize.config.ssl
    expect(sslConfig).toBe(true)
  })

  test('Connect with default options', async () => {
    const sequelize = await connectDatabase({
      host: 'localhost',
      username: 'test',
      password: 'test',
      database: 'test',
      logging: () => {},
    })

    expect(sequelize).toBeDefined()

    const poolConfig = sequelize.config.pool
    expect(poolConfig?.min).toBe(0)
    expect(poolConfig?.max).toBe(10)

    const sslConfig = sequelize.config.ssl
    expect(sslConfig).toBe(false)
  })
})
