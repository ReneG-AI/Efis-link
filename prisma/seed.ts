import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Ejecutando seed script...');
    
    // Crear usuario administrador si no existe
    const adminExists = await prisma.user.findUnique({
      where: {
        email: 'admin@efispodcast.com',
      },
    });

    if (!adminExists) {
      console.log('Creando usuario administrador...');
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
    
    // Crear algunos eventos de ejemplo si no existen
    const eventsCount = await prisma.event.count();
    
    if (eventsCount === 0) {
      console.log('Creando eventos de ejemplo...');
      
      const adminUser = await prisma.user.findUnique({
        where: {
          email: 'admin@efispodcast.com',
        },
      });
      
      if (adminUser) {
        await prisma.event.createMany({
          data: [
            {
              title: 'Grabación Podcast',
              type: 'podcast',
              date: new Date(2024, 3, 10), // 10 de abril de 2024
              time: '15:00',
              platform: 'Zoom',
              status: 'scheduled',
              userId: adminUser.id,
            },
            {
              title: 'Publicación Reel',
              type: 'reel',
              date: new Date(2024, 3, 12), // 12 de abril de 2024
              time: '10:00',
              platform: 'Instagram',
              status: 'scheduled',
              userId: adminUser.id,
            },
          ],
        });
        
        console.log('Eventos de ejemplo creados correctamente');
      }
    } else {
      console.log('Ya existen eventos en la base de datos');
    }
  } catch (error) {
    console.error('Error al ejecutar el seed script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    console.log('Seed completado correctamente');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error en el seed script:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 