import prometheus, {
  collectDefaultMetrics,
  LabelValues,
  Histogram,
  Registry,
} from 'prom-client'
import express from 'express'
import { Server } from 'net'
import { Logger } from '..'

export interface Metrics {
  client: typeof prometheus
  registry: Registry
}

export const createMetrics = (): Metrics => {
  // Collect default metrics (event loop lag, memory, file descriptors etc.)
  collectDefaultMetrics()

  return { client: prometheus, registry: prometheus.register }
}

export interface MetricsServerOptions {
  logger: Logger
  registry: Registry
}

export const createMetricsServer = (options: MetricsServerOptions): Server => {
  const logger = options.logger.child({ component: 'MetricsServer' })

  const app = express()

  app.get('/', (_, res) => {
    res.status(200).send(options.registry.metrics())
  })

  const server = app.listen(7300, () => {
    logger.debug('Listening on port 7300')
  })

  return server
}

export async function timed<T>(
  metric: Histogram<string> | undefined,
  labels: LabelValues<string> | undefined,
  promise: Promise<T>,
): Promise<T> {
  const timer = metric?.startTimer(labels)
  try {
    return await promise
  } finally {
    if (timer) {
      timer(labels)
    }
  }
}
