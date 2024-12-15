/* eslint-disable no-console */
import { isProduction } from './environment'

type LogArgs = unknown[]

const noop = (): void => {}

const logger = {
  debug: isProduction ? noop : (...args: LogArgs): void => console.debug('[DEBUG]', ...args),
  info: isProduction ? noop : (...args: LogArgs): void => console.info('[INFO]', ...args),
  warn: isProduction ? noop : (...args: LogArgs): void => console.warn('[WARN]', ...args),
  error: (...args: LogArgs): void => console.error('[ERROR]', ...args),
} as const

export type Logger = typeof logger
export default logger
