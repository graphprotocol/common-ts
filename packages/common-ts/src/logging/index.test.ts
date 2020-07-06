import { createLogger } from '.'

describe('Logging', () => {
  test('Create logger', () => {
    const logger = createLogger({ name: 'test' })
    expect(logger).toBeDefined()
  })
})
