import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Crear un cliente Prisma dedicado para la inicialización
const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: ['info', 'warn', 'error'],
});

export async function initializeDatabase() {
  try {
    console.log('Inicializando base de datos...');
    
    // Verificar la conexión
    await prisma.$connect();
    console.log('Conexión a la base de datos establecida correctamente');
    
    // Crear usuario administrador si no existe
    const adminExists = await prisma.user.findUnique({
      where: {
        email: 'admin@efispodcast.com',
      },
    }).catch(error => {
      console.error('Error al verificar si existe el usuario admin:', error);
      return null;
    });

    if (!adminExists) {
      console.log('Creando usuario administrador...');
      try {
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
      } catch (error) {
        console.error('Error al crear usuario administrador:', error);
      }
    } else {
      console.log('El usuario administrador ya existe');
    }
    
    // Crear algunos eventos de ejemplo si no existen
    try {
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
        } else {
          console.log('No se encontró el usuario administrador para asociar eventos');
        }
      } else {
        console.log('Ya existen eventos en la base de datos');
      }
    } catch (error) {
      console.error('Error al verificar o crear eventos:', error);
    }
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    await prisma.$disconnect();
    return false;
  }
} 