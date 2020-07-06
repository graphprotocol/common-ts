import pino from 'pino'

// Re-export the Logger type from winston
export { Logger } from 'pino'

export interface LoggerOptions {
  name: string
}

export const createLogger = (options: LoggerOptions): pino.Logger => {
  return pino({
    name: options.name,
    level: 'debug',
    base: {},
  })
}
