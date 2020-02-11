import { createMetrics } from '.'

describe('Metrics', () => {
  test('Create metrics', () => {
    let metrics = createMetrics()
    expect(metrics.Counter).toBeDefined()
  })
})
