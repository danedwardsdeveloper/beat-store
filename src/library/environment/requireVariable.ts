import logger from '../misc/logger'

export function requireVariable(name: string): string {
  if (typeof window !== 'undefined') {
    const clientErrorMessage = `Attempted to access private environment variable '${name}' from the client.`
    logger.error(clientErrorMessage)
    throw new Error(clientErrorMessage)
  }

  const value = process.env[name]
  if (!value) {
    logger.error(`${name} missing`)
    throw new Error(`${name} missing`)
  }
  return value
}
