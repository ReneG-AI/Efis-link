import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Inicialización de Prisma
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export async function initializeDatabase() {
  try {
    await prisma.$connect();
    console.log('Conectado a la base de datos');

    // Comprobar si ya existe un usuario admin
    const adminCount = await prisma.user.count({
      where: {
        email: 'info@efis.es'
      }
    });

    // Si no existe, crearlo
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('Ef1sP0dcast!', 10);
      
      await prisma.user.create({
        data: {
          name: 'Admin EFIS',
          email: 'info@efis.es',
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      
      console.log('Usuario administrador creado correctamente');
    } else {
      console.log('El usuario administrador ya existe');
    }

    // Crear algunos eventos de ejemplo si no existen
    const eventCount = await prisma.event.count();
    
    if (eventCount === 0) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      await prisma.event.createMany({
        data: [
          {
            title: 'Grabación Podcast EFIS',
            type: 'PODCAST',
            date: tomorrow,
            time: '11:00',
            platform: 'Zoom',
            status: 'SCHEDULED',
            userId: 1
          },
          {
            title: 'Publicación Reel: Finanzas Personales',
            type: 'REEL',
            date: nextWeek,
            time: '20:00',
            platform: 'Instagram, TikTok',
            status: 'SCHEDULED',
            userId: 1
          }
        ]
      });
      
      console.log('Eventos de ejemplo creados correctamente');
    } else {
      console.log('Ya existen eventos en la base de datos');
    }

    return true;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
} 