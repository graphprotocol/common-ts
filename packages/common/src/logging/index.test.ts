import { createLogger } from '.'

describe('Logging', () => {
  test('Create logger', () => {
    let logger = createLogger({ appName: 'test' })
    expect(logger).toBeDefined()
  })
})
