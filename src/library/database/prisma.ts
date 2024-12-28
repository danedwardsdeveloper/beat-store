import { PrismaClient } from '@prisma/client'

import { isProduction } from '../environment/publicVariables'

type GlobalWithPrisma = typeof globalThis & {
  prisma: PrismaClient | undefined
}

declare const global: GlobalWithPrisma

let prisma: PrismaClient

if (isProduction) {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
