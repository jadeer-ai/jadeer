/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — PRISMA CLIENT SINGLETON
   ─────────────────────────────────────────────────────────────────────────
   Provides a single, reusable PrismaClient instance across the application.
   Prevents multiple connections during development hot-reloading.
   ═══════════════════════════════════════════════════════════════════════════ */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Singleton Prisma Client.
 *
 * In development, the client is stored on `globalThis` so that hot-module
 * reloads don't create new connections. In production, a fresh client is
 * created once per cold start.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      (import.meta.env?.DEV ?? false)
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (!import.meta.env?.PROD) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
