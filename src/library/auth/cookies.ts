import { isProduction } from '../environment/publicVariables'

export enum CookieName {
  token = 'token',
}

export enum CookieDurations {
  zero = 0,
  oneHour = 60 * 60,
  twoWeeks = 365 * 24 * 60 * 60,
}

type CookieOptions = {
  name: CookieName
  value: string
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict'
  maxAge: CookieDurations
  path: string
}

export function createCookieOptions(tokenValue: string, duration: CookieDurations): CookieOptions {
  return {
    name: CookieName.token,
    value: tokenValue,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: duration,
    path: '/',
  }
}

export interface TokenPayload {
  sub: string
  exp: number
}

export function generateTokenPayload(userId: string, duration: CookieDurations): TokenPayload {
  return {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + duration,
  }
}
