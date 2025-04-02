"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  FaHome, 
  FaCalendarAlt, 
  FaShareAlt, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt 
} from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "bg-blue-900" : "";
  };

  return (
    <div className="flex flex-col w-64 bg-blue-800 text-white">
      <div className="p-4 text-xl font-bold border-b border-blue-700">
        EFIS Podcast
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2">
          <li>
            <Link 
              href="/dashboard" 
              className={`flex items-center px-4 py-3 mt-2 rounded hover:bg-blue-900 ${isActive("/dashboard")}`}
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>
          
          <li>
            <Link 
              href="/calendar" 
              className={`flex items-center px-4 py-3 mt-2 rounded hover:bg-blue-900 ${isActive("/calendar")}`}
            >
              <FaCalendarAlt className="mr-3" />
              Calendario
            </Link>
          </li>
          
          <li>
            <Link 
              href="/social" 
              className={`flex items-center px-4 py-3 mt-2 rounded hover:bg-blue-900 ${isActive("/social")}`}
            >
              <FaShareAlt className="mr-3" />
              Redes Sociales
            </Link>
          </li>
          
          <li>
            <Link 
              href="/stats" 
              className={`flex items-center px-4 py-3 mt-2 rounded hover:bg-blue-900 ${isActive("/stats")}`}
            >
              <FaChartBar className="mr-3" />
              Estadísticas
            </Link>
          </li>
          
          <li>
            <Link 
              href="/settings" 
              className={`flex items-center px-4 py-3 mt-2 rounded hover:bg-blue-900 ${isActive("/settings")}`}
            >
              <FaCog className="mr-3" />
              Configuración
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-blue-700">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center w-full px-4 py-2 mt-2 rounded hover:bg-red-600"
        >
          <FaSignOutAlt className="mr-3" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
} 