/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import pino from 'pino'
import pinoMultiStream from 'pino-multi-stream'
import * as pinoSentry from 'pino-sentry'

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LoggerSentryOptions {
  dsn: string
  serverName: string
  release: string
  tracesSampleRate: number
  debug: boolean
  level: 'debug' | 'info' | 'warning' | 'error' | 'fatal'
}

export interface LoggerOptions {
  name: string
  level?: LogLevel
  async?: boolean
  sentry?: LoggerSentryOptions
}

export class Logger {
  options: LoggerOptions
  inner: pino.Logger

  constructor(options: LoggerOptions) {
    this.options = options

    const loggerOptions = { name: options.name, level: options.level || 'debug' }

    const stream = options.async
      ? pino.destination({ minLength: 4096, sync: false })
      : pino.destination()

    if (options.sentry) {
      const streams = [
        { stream, level: loggerOptions.level },
        {
          stream: options.async
            ? pinoSentry.createWriteStreamAsync({ ...options.sentry, useErr: true })
            : pinoSentry.createWriteStream({ ...options.sentry, useErr: true }),
        },
      ]
      this.inner = pinoMultiStream({
        ...loggerOptions,
        streams,
      })
    } else {
      this.inner = pino(loggerOptions, stream)
    }
  }

  child(bindings: pino.Bindings): Logger {
    const inner = this.inner.child(bindings)
    const logger = new Logger(this.options)
    logger.inner = inner
    return logger
  }

  trace(msg: string, o?: object, ...args: any[]): void {
    if (o) {
      this.inner.trace(o, msg, ...args)
    } else {
      this.inner.trace(msg, ...args)
    }
  }

  debug(msg: string, o?: object, ...args: any[]): void {
    if (o) {
      this.inner.debug(o, msg, ...args)
    } else {
      this.inner.debug(msg, ...args)
    }
  }

  info(msg: string, o?: object, ...args: any[]): void {
    if (o) {
      this.inner.info(o, msg, ...args)
    } else {
      this.inner.info(msg, ...args)
    }
  }

  warn(msg: string, o?: object, ...args: any[]): void {
    if (o) {
      this.inner.warn(o, msg, ...args)
    } else {
      this.inner.warn(msg, ...args)
    }
  }

  warning(msg: string, o?: object, ...args: any[]): void {
    if (o) {
      this.inner.warn(o, msg, ...args)
    } else {
      this.inner.warn(msg, ...args)
    }
  }

  error(msg: string, o?: object, ...args: any[]): void {
    if (o) {
      this.inner.error(o, msg, ...args)
    } else {
      this.inner.error(msg, ...args)
    }
  }

  fatal(msg: string, o?: object, ...args: any[]): void {
    if (o) {
      this.inner.fatal(o, msg, ...args)
    } else {
      this.inner.fatal(msg, ...args)
    }
  }

  crit(msg: string, o?: object, ...args: any[]): void {
    if (o) {
      this.inner.fatal(o, msg, ...args)
    } else {
      this.inner.fatal(msg, ...args)
    }
  }

  critical(msg: string, o?: object, ...args: any[]): void {
    if (o) {
      this.inner.fatal(o, msg, ...args)
    } else {
      this.inner.fatal(msg, ...args)
    }
  }
}

export const createLogger = (options: LoggerOptions): Logger => new Logger(options)
