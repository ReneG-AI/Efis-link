// Declaraciones para móódulos sin tipos
declare module 'next-auth';
declare module 'next-auth/providers/credentials';
declare module 'next-auth/jwt';
declare module 'bcrypt';

// Extender tipos globales
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;
      NODE_ENV: 'development' | 'production' | 'test';
      [key: string]: string | undefined;
    }
  }

  // Prisma client para manejo global
  var prisma: any;
}

// Exportar un objeto vacío para mantener este archivo como un módulo
export {}; 