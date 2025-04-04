import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Datos de usuarios de ejemplo (en producción usarías una base de datos)
const users = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@efis-podcast.com',
    // Esta es una simulación de un hash para "Admin123!" - en producción usarías bcrypt real
    hashedPassword: '$2a$12$k8Y36Hbc5Ywm1bUE7IJBFO6inGfpqGYEJN9VS2RMXu09w4FyQ7Cou'
  }
];

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

        // Simulación de autenticación con datos de ejemplo
        const user = users.find(user => user.email === credentials.email);

        if (!user) {
          console.log("Usuario no encontrado");
          return null;
        }

        // Simulación de verificación de contraseña
        // En un entorno real usar bcrypt.compare
        const isValidPassword = credentials.password === 'Admin123!';

        if (!isValidPassword) {
          console.log("Contraseña incorrecta");
          return null;
        }

        console.log("Login exitoso:", user.email);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'admin'
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'efis-podcast-super-secure-fallback-key',
  session: {
    strategy: "jwt",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 