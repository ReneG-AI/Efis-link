"use client";

import { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Calendario', path: '/calendar', icon: '📅' },
    { label: 'Grabaciones', path: '/recordings', icon: '🎙️' },
    { label: 'Redes Sociales', path: '/social', icon: '📱', subItems: [
      { label: 'Instagram', path: '/social/instagram', icon: '📸' },
      { label: 'LinkedIn', path: '/social/linkedin', icon: '💼' },
      { label: 'YouTube', path: '/social/youtube', icon: '▶️' },
      { label: 'Spotify', path: '/social/spotify', icon: '🎧' },
      { label: 'TikTok', path: '/social/tiktok', icon: '🎵' },
    ]},
    { label: 'Estadísticas', path: '/stats', icon: '📈' },
    { label: 'Configuración', path: '/settings', icon: '⚙️' },
  ];

  const [expandedMenu, setExpandedMenu] = useState<string | null>(
    pathname?.startsWith('/social') ? '/social' : null
  );

  const toggleSubMenu = (path: string) => {
    if (expandedMenu === path) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(path);
    }
  };

  const isCurrentPath = (path: string) => pathname === path;
  const isSubMenuActive = (parentPath: string) => pathname?.startsWith(parentPath);

  return (
    <>
      {/* Sidebar para desktop */}
      <aside className="bg-blue-900 text-white w-64 min-h-screen flex-shrink-0 hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Efis Link</h2>
          <p className="text-blue-200 text-sm">Gestión de Contenido</p>
        </div>
        
        <nav className="mt-6">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleSubMenu(item.path)}
                      className={`flex items-center justify-between w-full px-6 py-3 text-left hover:bg-blue-800 transition-colors ${
                        isSubMenuActive(item.path) ? 'bg-blue-800 border-l-4 border-white pl-5' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                      </div>
                      <span>{expandedMenu === item.path ? '▼' : '▶'}</span>
                    </button>
                    {expandedMenu === item.path && (
                      <ul className="bg-blue-950 py-1">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.path}>
                            <button
                              onClick={() => router.push(subItem.path)}
                              className={`flex items-center w-full pl-10 pr-6 py-2 text-left hover:bg-blue-800 transition-colors ${
                                isCurrentPath(subItem.path) ? 'bg-blue-800 border-l-4 border-white pl-9' : ''
                              }`}
                            >
                              <span className="mr-3">{subItem.icon}</span>
                              {subItem.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => router.push(item.path)}
                    className={`flex items-center w-full px-6 py-3 text-left hover:bg-blue-800 transition-colors ${
                      isCurrentPath(item.path) ? 'bg-blue-800 border-l-4 border-white pl-5' : ''
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                )}
              </li>
            ))}
            <li className="px-6 pt-6">
              <button
                onClick={() => router.push('/logout')}
                className="flex items-center w-full py-3 text-left text-blue-200 hover:text-white transition-colors"
              >
                <span className="mr-3">🚪</span>
                Cerrar Sesión
              </button>
            </li>
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
                <h2 className="text-2xl font-bold">Efis Link</h2>
                <p className="text-blue-200 text-sm">Gestión de Contenido</p>
              </div>
              
              <nav className="mt-6">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      {item.subItems ? (
                        <div>
                          <button
                            onClick={() => toggleSubMenu(item.path)}
                            className={`flex items-center justify-between w-full px-6 py-3 text-left hover:bg-blue-800 transition-colors ${
                              isSubMenuActive(item.path) ? 'bg-blue-800 border-l-4 border-white pl-5' : ''
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="mr-3">{item.icon}</span>
                              {item.label}
                            </div>
                            <span>{expandedMenu === item.path ? '▼' : '▶'}</span>
                          </button>
                          {expandedMenu === item.path && (
                            <ul className="bg-blue-950 py-1">
                              {item.subItems.map((subItem) => (
                                <li key={subItem.path}>
                                  <button
                                    onClick={() => {
                                      router.push(subItem.path);
                                      setMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center w-full pl-10 pr-6 py-2 text-left hover:bg-blue-800 transition-colors ${
                                      isCurrentPath(subItem.path) ? 'bg-blue-800 border-l-4 border-white pl-9' : ''
                                    }`}
                                  >
                                    <span className="mr-3">{subItem.icon}</span>
                                    {subItem.label}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            router.push(item.path);
                            setMobileMenuOpen(false);
                          }}
                          className={`flex items-center w-full px-6 py-3 text-left hover:bg-blue-800 transition-colors ${
                            isCurrentPath(item.path) ? 'bg-blue-800 border-l-4 border-white pl-5' : ''
                          }`}
                        >
                          <span className="mr-3">{item.icon}</span>
                          {item.label}
                        </button>
                      )}
                    </li>
                  ))}
                  <li className="px-6 pt-6">
                    <button
                      onClick={() => {
                        router.push('/logout');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full py-3 text-left text-blue-200 hover:text-white transition-colors"
                    >
                      <span className="mr-3">🚪</span>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 