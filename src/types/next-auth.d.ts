import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extender el objeto User para incluir el rol
   */
  interface User {
    id: string;
    role: string;
  }

  /**
   * Extender el objeto Session para incluir el id y rol del usuario
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extender el objeto JWT para incluir el id y rol del usuario
   */
  interface JWT {
    id: string;
    role: string;
  }
} 