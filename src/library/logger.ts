/* eslint-disable no-console */
import chalk from 'chalk'

import { isProduction } from './environment/publicVariables'

const voidCallback = (): void => {}

const logger = {
  debug: isProduction
    ? voidCallback
    : (...args: unknown[]): void => console.debug(chalk.magenta('[DEBUG]', ...args)),
  info: isProduction
    ? voidCallback
    : (...args: unknown[]): void => console.info(chalk.blue('[INFO]', ...args)),
  warn: isProduction
    ? voidCallback
    : (...args: unknown[]): void => console.warn(chalk.yellow('[WARN]', ...args)),
  error: (...args: unknown[]): void => console.error(chalk.red('[ERROR]'), ...args),
} as const

export default logger
