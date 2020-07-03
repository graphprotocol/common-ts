/* eslint-disable @typescript-eslint/no-explicit-any */

import * as database from '.'

// Make global Jest variable available
declare const __DATABASE__: any

describe('Database', () => {
  test('Connect', async () => {
    const sequelize = await database.connect(__DATABASE__)
    expect(sequelize).toBeDefined()
  })
})
