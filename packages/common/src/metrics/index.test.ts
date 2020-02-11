import { metrics } from '.'

describe('Metrics', () => {
  test('Create metrics', () => {
    let m = metrics()
    expect(m.Counter).toBeDefined()
  })
})
