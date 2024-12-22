/* eslint-disable no-console */
import chalk from 'chalk'

import { isProduction } from '@/library/environment/configuration'

const logger = {
  debug: isProduction
    ? (): void => {}
    : (...args: unknown[]): void => console.debug(chalk.gray('[DEBUG]', ...args)),
  info: isProduction
    ? (): void => {}
    : (...args: unknown[]): void => console.info(chalk.blue('[INFO]', ...args)),
  warn: isProduction
    ? (): void => {}
    : (...args: unknown[]): void => console.warn(chalk.yellow('[WARN]', ...args)),
  error: (...args: unknown[]): void => console.error(chalk.red('[ERROR]'), ...args),
} as const

export default logger
