import { Registry } from 'prom-client'
import { createMetrics, createMetricsServer } from '.'
import request from 'supertest'
import { createLogger } from '../logging'

describe('Metrics', () => {
  test('Create metrics', () => {
    const metrics = createMetrics()
    expect(metrics.client).toBeDefined()
    expect(metrics.registry).toBeInstanceOf(Registry)
  })

  test('Serve metrics', async () => {
    const { client, registry } = createMetrics()
    const logger = createLogger({ appName: 'test' })
    const server = createMetricsServer({ logger, registry })

    try {
      // Create two metrics for testing
      const counter = new client.Counter({
        name: 'counter',
        help: 'counter help',
        registers: [registry],
      })
      const gauge = new client.Gauge({
        name: 'gauge',
        help: 'gauge help',
        registers: [registry],
      })

      counter.inc()
      counter.inc()
      gauge.set(100)

      // Verify that the registered metrics are served at `/`
      const response = await request(server).get('/').send()
      expect(response.status).toEqual(200)
      expect(response.text).toMatch(/counter 2/)
      expect(response.text).toMatch(/gauge 100/)
    } finally {
      server.close()
    }
  })
})
