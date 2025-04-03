import { NextResponse } from 'next/server';

// Eventos simulados para el calendario
const mockEvents = [
  {
    id: '1',
    title: 'Grabación Podcast EFIS',
    type: 'podcast',
    date: new Date(Date.now() + 86400000), // Mañana
    time: '11:00',
    platform: 'Estudio',
    status: 'scheduled',
  },
  {
    id: '2',
    title: 'Publicación Reel: Finanzas Personales',
    type: 'reel',
    date: new Date(Date.now() + 2 * 86400000), // Pasado mañana
    time: '20:00',
    platform: 'Instagram, TikTok',
    status: 'scheduled',
  },
  {
    id: '3',
    title: 'Entrevista Invitado Especial',
    type: 'podcast',
    date: new Date(Date.now() - 86400000), // Ayer
    time: '15:00',
    platform: 'Estudio',
    status: 'completed',
  },
  {
    id: '4',
    title: 'Publicación Podcast Episodio 42',
    type: 'podcast',
    date: new Date(Date.now() - 2 * 86400000), // Antier
    time: '18:00',
    platform: 'Spotify, Apple Podcasts',
    status: 'completed',
  },
  {
    id: '5',
    title: 'Teaser próximo episodio',
    type: 'teaser',
    date: new Date(Date.now() + 3 * 86400000), // En 3 días
    time: '15:00',
    platform: 'Instagram',
    status: 'scheduled',
  },
];

export async function GET() {
  // Añadimos un pequeño retraso para simular tiempo de carga
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(mockEvents);
} 