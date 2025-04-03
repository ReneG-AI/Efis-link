import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Faltan credenciales");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user || !user.hashedPassword) {
            console.log("Usuario no encontrado o contraseña no configurada");
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isPasswordValid) {
            console.log("Contraseña incorrecta");
            return null;
          }

          console.log("Login exitoso:", user.email);
          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error("Error en auth:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 