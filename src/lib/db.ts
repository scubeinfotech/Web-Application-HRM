import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

<<<<<<< HEAD
export const db = globalForPrisma.prisma ?? new PrismaClient()
=======
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })
>>>>>>> 978d9d138756189dac8b73219b8bb59e163e1c02

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db