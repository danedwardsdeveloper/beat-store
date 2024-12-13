/* eslint-disable no-console */
import { isProduction } from './environment'

type LogArgs = unknown[]

const noop = (): void => {}

const logger = {
  debug: isProduction ? noop : (...args: LogArgs): void => console.debug('[debug]', ...args),
  info: isProduction ? noop : (...args: LogArgs): void => console.info('[info]', ...args),
  warn: isProduction ? noop : (...args: LogArgs): void => console.warn('[warn]', ...args),
  error: (...args: LogArgs): void => console.error('[error]', ...args),
} as const

export type Logger = typeof logger
export default logger
