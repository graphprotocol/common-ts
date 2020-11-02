/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import pino from 'pino'

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent'
export type ErrorLevel = 'error' | 'fatal' | 'critical'

export interface ErrorTracker {
  trackError(error: Error, context: any, level: ErrorLevel): void
}

export interface LoggerOptions {
  name: string
  level?: LogLevel
  async?: boolean
  errorTracker?: ErrorTracker
}

export class Logger {
  options: LoggerOptions
  inner: pino.Logger

  constructor(options: LoggerOptions) {
    this.options = options

    const loggerOptions = { name: options.name, level: options.level || 'debug' }
    this.inner = options.async
      ? pino(loggerOptions, pino.destination({ minLength: 4096, sync: false }))
      : pino(loggerOptions)
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
      const { error } = o as any
      delete (o as any)['error']
      this.options.errorTracker?.trackError(error, { msg, args, ...o }, 'error')

      this.inner.error(o, msg, ...args)
    } else {
      this.inner.error(msg, ...args)
    }
  }

  fatal(msg: string, o?: object, ...args: any[]): void {
    if (o) {
      const { error } = o as any
      delete (o as any)['error']
      this.options.errorTracker?.trackError(error, { msg, args, ...o }, 'fatal')

      this.inner.fatal(o, msg, ...args)
    } else {
      this.inner.fatal(msg, ...args)
    }
  }

  crit(msg: string, o?: object, ...args: any[]): void {
    if (o) {
      const { error } = o as any
      delete (o as any)['error']
      this.options.errorTracker?.trackError(error, { msg, args, ...o }, 'critical')

      this.inner.fatal(o, msg, ...args)
    } else {
      this.inner.fatal(msg, ...args)
    }
  }

  critical(msg: string, o?: object, ...args: any[]): void {
    if (o) {
      const { error } = o as any
      delete (o as any)['error']
      this.options.errorTracker?.trackError(error, { msg, args, ...o }, 'critical')

      this.inner.fatal(o, msg, ...args)
    } else {
      this.inner.fatal(msg, ...args)
    }
  }
}

export const createLogger = (options: LoggerOptions): Logger => new Logger(options)
