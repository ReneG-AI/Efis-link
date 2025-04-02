import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Crear usuario administrador si no existe
    const adminExists = await prisma.user.findUnique({
      where: {
        email: 'admin@efispodcast.com',
      },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('adminefis2024', 10);

      await prisma.user.create({
        data: {
          email: 'admin@efispodcast.com',
          name: 'EFIS Admin',
          password: hashedPassword,
          role: 'admin',
        },
      });

      console.log('Usuario administrador creado correctamente');
    } else {
      console.log('El usuario administrador ya existe');
    }
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 