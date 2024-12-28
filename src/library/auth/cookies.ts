import { isProduction } from '../environment/publicVariables'

export enum CookieName {
  token = 'token',
}
const twoWeeksInSeconds = 365 * 24 * 60 * 60

type CookieOptions = {
  name: CookieName
  value: string
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict'
  maxAge: number
  path: string
}

export function createCookieOptions(tokenValue: string): CookieOptions {
  return {
    name: CookieName.token,
    value: tokenValue,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: twoWeeksInSeconds,
    path: '/',
  }
}

export function createClearCookieOptions(): CookieOptions {
  return {
    name: CookieName.token,
    value: '',
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  }
}

export interface TokenPayload {
  sub: string
  exp: number
}

export function generateTokenPayload(userId: string): TokenPayload {
  return {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + twoWeeksInSeconds,
  }
}
