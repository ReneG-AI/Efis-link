import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function initializeDatabase() {
  try {
    console.log('Inicializando base de datos...');
    
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
    }
    
    return true;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    return false;
  }
} 