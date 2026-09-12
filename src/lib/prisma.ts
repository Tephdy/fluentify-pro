import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Use a Proxy to defer PrismaClient instantiation until runtime execution,
// preventing build-time crashes during Next.js static analysis and data collection.
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop: keyof PrismaClient) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient();
    }
    return globalForPrisma.prisma[prop];
  },
});

export default prisma;