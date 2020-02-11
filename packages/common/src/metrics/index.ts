import prometheus, { collectDefaultMetrics } from 'prom-client'

export const metrics = () => {
  // Probe default metrics (memory, file descriptors etc.) every 5s
  collectDefaultMetrics({ timeout: 5000 })

  return prometheus
}
