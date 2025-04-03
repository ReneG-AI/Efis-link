"use client";

import { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Calendario', path: '/calendar', icon: '📅' },
    { label: 'Publicaciones', path: '/publications', icon: '📝' },
    { label: 'Redes Sociales', path: '/social', icon: '📱' },
    { label: 'Estadísticas', path: '/stats', icon: '📈' },
    { label: 'Configuración', path: '/settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Sidebar para desktop */}
      <aside className="bg-blue-900 text-white w-64 min-h-screen flex-shrink-0 hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-bold">EFIS Podcast</h2>
          <p className="text-blue-200 text-sm">Panel de Control</p>
        </div>
        
        <nav className="mt-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`flex items-center w-full px-6 py-3 text-left hover:bg-blue-800 transition-colors ${
                    pathname === item.path ? 'bg-blue-800 border-l-4 border-white' : ''
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Menú para móviles */}
      <div className="md:hidden">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed top-4 left-4 z-20 bg-blue-900 text-white p-2 rounded-md"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-10 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-blue-900 text-white w-64 min-h-screen" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <h2 className="text-2xl font-bold">EFIS Podcast</h2>
                <p className="text-blue-200 text-sm">Panel de Control</p>
              </div>
              
              <nav className="mt-6">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <button
                        onClick={() => {
                          router.push(item.path);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center w-full px-6 py-3 text-left hover:bg-blue-800 transition-colors ${
                          pathname === item.path ? 'bg-blue-800 border-l-4 border-white' : ''
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 