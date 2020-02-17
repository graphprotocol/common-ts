import prometheus, { collectDefaultMetrics, Registry } from 'prom-client'
import express from 'express'
import { Server } from 'net'
import { logging } from '..'

export interface Metrics {
  client: any
  registry: Registry
}

export const createMetrics = (): Metrics => {
  // Probe default metrics (memory, file descriptors etc.) every 5s
  collectDefaultMetrics({ timeout: 5000 })
  return { client: prometheus, registry: prometheus.register }
}

export interface MetricsServerOptions {
  logger: logging.Logger
  registry: Registry
}

export const createMetricsServer = (options: MetricsServerOptions): Server => {
  let logger = options.logger.child({ component: 'MetricsServer' })

  let app = express()

  app.get('/', (_, res) => {
    res.status(200).send(options.registry.metrics())
  })

  let server = app.listen(7300, () => {
    logger.debug('Listening on port 7300')
  })

  return server
}
