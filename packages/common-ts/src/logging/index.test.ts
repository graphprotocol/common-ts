import { createLogger } from '.'

describe('Logging', () => {
  test('Create logger', () => {
    const logger = createLogger({ appName: 'test' })
    expect(logger).toBeDefined()
  })
})
