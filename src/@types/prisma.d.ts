import { PrismaClient } from '@prisma/client';

// Añadir tipos para la instancia global de Prisma
declare global {
  var prisma: PrismaClient | undefined;
} 