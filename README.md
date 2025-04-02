# EFIS Podcast - Panel de Control

Un panel de control interactivo para gestionar el calendario de contenido y las publicaciones en redes sociales del podcast EFIS.

## Características

- **Autenticación**: Sistema de inicio de sesión seguro.
- **Calendario de Contenido**: Programa y gestiona todos los eventos del podcast.
- **Integración con Redes Sociales**: Administra las publicaciones en diversas plataformas.
- **Estadísticas**: Visualiza métricas y analíticas de rendimiento.
- **Base de Datos**: Almacenamiento persistente de todos los datos con PostgreSQL.

## Requisitos

- Node.js 18.0 o superior
- PostgreSQL (local o en la nube)
- Cuenta en Vercel para despliegue

## Configuración para Desarrollo

1. Clona el repositorio
   ```
   git clone https://github.com/tu-usuario/efis-podcast-panel.git
   cd efis-podcast-panel
   ```

2. Instala las dependencias
   ```
   npm install
   ```

3. Crea un archivo `.env.local` con las siguientes variables:
   ```
   DATABASE_URL=postgresql://usuario:password@localhost:5432/efis_podcast
   NEXTAUTH_SECRET=tu-secreto-seguro
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Configura la base de datos
   ```
   npx prisma migrate dev
   ```

5. Inicia el servidor de desarrollo
   ```
   npm run dev
   ```

## Despliegue en Vercel

1. Crea una cuenta en Vercel y conecta tu repositorio.
2. Configura las variables de entorno en la sección de "Environment Variables":
   - `DATABASE_URL`: URL de conexión a tu base de datos PostgreSQL.
   - `NEXTAUTH_SECRET`: Clave secreta para la autenticación.
   - `NEXTAUTH_URL`: URL completa de la aplicación desplegada.
3. Despliega la aplicación.

## Tecnologías Utilizadas

- **Next.js**: Framework de React para aplicaciones web.
- **Prisma**: ORM para interactuar con la base de datos.
- **NextAuth.js**: Sistema de autenticación.
- **TailwindCSS**: Framework CSS para el diseño.
- **PostgreSQL**: Base de datos relacional.
- **TypeScript**: Tipado estático para JavaScript.
- **React**: Biblioteca JavaScript para interfaces de usuario.

## Licencia

Este proyecto está bajo la Licencia MIT.