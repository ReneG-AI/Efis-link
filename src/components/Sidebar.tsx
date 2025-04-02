import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Calendario', path: '/calendar', icon: '📅' },
    { name: 'Publicaciones', path: '/posts', icon: '📝' },
    { name: 'Redes Sociales', path: '/social', icon: '🌐' },
    { name: 'Estadísticas', path: '/stats', icon: '📈' },
    { name: 'Configuración', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-efis-black text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">EFIS PODCAST</h1>
        <p className="text-gray-400 text-sm">Panel de Administración</p>
      </div>
      
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link href={item.path} className="flex items-center p-2 rounded-md hover:bg-gray-800 transition-all">
                <span className="mr-3 text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-gray-700 mt-8">
        <div className="flex items-center p-4 bg-gray-800 rounded-md">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
            EP
          </div>
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-400">efis@podcast.com</p>
          </div>
        </div>
      </div>
    </div>
  );
} 