import { Registry } from 'prom-client'
import express, { Express } from 'express'
import { createMetrics, createMetricsServer } from '.'
import request from 'supertest'
import { createLogger } from '../logging'

describe('Metrics', () => {
  test('Create metrics', () => {
    let metrics = createMetrics()
    expect(metrics.client).toBeDefined()
    expect(metrics.registry).toBeInstanceOf(Registry)
  })

  test('Serve metrics', async () => {
    let { client, registry } = createMetrics()
    let logger = createLogger({ appName: 'test' })
    let server = createMetricsServer({ logger, registry })

    try {
      // Create two metrics for testing
      let counter = new client.Counter({
        name: 'counter',
        help: 'counter help',
        registers: [registry],
      })
      let gauge = new client.Gauge({
        name: 'gauge',
        help: 'gauge help',
        registers: [registry],
      })

      counter.inc()
      counter.inc()
      gauge.set(100)

      // Verify that the registered metrics are served at `/`
      let response = await request(server)
        .get('/')
        .send()
      expect(response.status).toEqual(200)
      expect(response.text).toMatch(/counter 2/)
      expect(response.text).toMatch(/gauge 100/)
    } finally {
      server.close()
    }
  })
})
