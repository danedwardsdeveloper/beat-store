import { isProduction } from './environment'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET missing')
}

export const jwtSecret = process.env.JWT_SECRET

export type CookieName = 'access_token' | 'refresh_token'

type CookieOptions = {
  name: CookieName
  value: string
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict'
  maxAge: number
  path: string
}

function setMaxAge(cookieName: CookieName) {
  const oneHourInSeconds = 60 * 60
  const oneWeekInSeconds = 7 * 24 * 60 * 60
  return cookieName === 'access_token' ? oneHourInSeconds : oneWeekInSeconds
}

export function createCookieOptions(cookieName: CookieName, tokenValue: string): CookieOptions {
  return {
    name: cookieName,
    value: tokenValue,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: setMaxAge(cookieName),
    path: '/',
  }
}

export function createClearCookieOptions(cookieName: CookieName): CookieOptions {
  return {
    name: cookieName,
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

export function generateTokenPayload(cookieName: CookieName, userId: string): TokenPayload {
  return {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + setMaxAge(cookieName),
  }
}
