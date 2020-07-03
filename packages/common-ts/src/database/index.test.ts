/* eslint-disable @typescript-eslint/no-explicit-any */

import { connectDatabase } from '.'

// Make global Jest variable available
declare const __DATABASE__: any

describe('Database', () => {
  test('Connect', async () => {
    const sequelize = await connectDatabase(__DATABASE__)
    expect(sequelize).toBeDefined()
  })
})
