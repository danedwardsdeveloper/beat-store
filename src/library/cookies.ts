import { isProduction } from '@/library/environment/configuration'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET missing')
}

export const jwtSecret = process.env.JWT_SECRET

export type CookieName = 'token'
const twentyFourHoursInSeconds = 24 * 60 * 60

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
    name: 'token',
    value: tokenValue,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: twentyFourHoursInSeconds,
    path: '/',
  }
}

export function createClearCookieOptions(): CookieOptions {
  return {
    name: 'token',
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
    exp: Math.floor(Date.now() / 1000) + twentyFourHoursInSeconds,
  }
}
