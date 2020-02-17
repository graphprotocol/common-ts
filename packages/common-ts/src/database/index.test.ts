import * as database from '.'

// Make global Jest variable available
declare var __DATABASE__: any

describe('Database', () => {
  test('Connect', async () => {
    let sequelize = await database.connect(__DATABASE__)
    expect(sequelize).toBeDefined()
  })
})
