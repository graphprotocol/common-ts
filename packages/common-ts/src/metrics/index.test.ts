import { Registry } from 'prom-client'
import { createMetrics, createMetricsServer } from '.'
import request from 'supertest'
import { createLogger } from '../logging'

describe('Metrics', () => {
  test('Create metrics', () => {
    const metrics = createMetrics()
    expect(metrics.client).toBeDefined()
    expect(metrics.registry).toBeInstanceOf(Registry)
    metrics.registry.clear()
  })

  test('Serve metrics', async () => {
    const { client, registry } = createMetrics()
    const logger = createLogger({ name: 'test' })
    const server = createMetricsServer({ logger, registry, port: 51235 })

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
      const response = await request(server).get('/metrics').send()
      expect(response.status).toEqual(200)
      expect(response.text).toMatch(/counter 2/)
      expect(response.text).toMatch(/gauge 100/)
    } finally {
      server.close()
      registry.clear()
    }
  })
})
