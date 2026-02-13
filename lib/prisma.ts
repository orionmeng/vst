/**
 * Prisma Client Instance
 * 
 * Provides singleton database client to prevent connection exhaustion.
 * In development, reuses client across hot reloads.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Singleton Prisma client instance
 * Logs all queries in development for debugging
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

// Store on global object in development to survive hot reloads
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
