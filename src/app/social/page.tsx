import React from 'react';
import SocialLinks from '@/components/SocialLinks';

export default function SocialPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Publicación en Redes Sociales</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Nueva Publicación</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Escribe un título para tu publicación"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido
              </label>
              <textarea 
                className="w-full p-2 border border-gray-300 rounded-md h-32"
                placeholder="Escribe el contenido de tu publicación"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Contenido
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">Selecciona un tipo</option>
                <option value="reel">Reel</option>
                <option value="podcast">Podcast</option>
                <option value="teaser">Teaser</option>
                <option value="post">Post</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plataformas
              </label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Instagram
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  TikTok
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  YouTube
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Spotify
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  LinkedIn
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha y Hora de Publicación
              </label>
              <input 
                type="datetime-local" 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subir Archivo Multimedia
              </label>
              <input 
                type="file" 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="flex justify-end">
              <button className="btn btn-secondary mr-2">
                Guardar como borrador
              </button>
              <button className="btn btn-primary">
                Programar publicación
              </button>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Publicaciones Programadas</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Título</th>
                    <th className="p-3 text-left">Tipo</th>
                    <th className="p-3 text-left">Plataformas</th>
                    <th className="p-3 text-left">Fecha</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">Cómo ahorrar dinero</td>
                    <td className="p-3">Reel</td>
                    <td className="p-3">Instagram, TikTok</td>
                    <td className="p-3">03-04-2023 20:00</td>
                    <td className="p-3">
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Programado
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                      <button className="text-red-600 hover:text-red-800">Cancelar</button>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Podcast: Finanzas para Jóvenes</td>
                    <td className="p-3">Podcast</td>
                    <td className="p-3">Spotify, YouTube</td>
                    <td className="p-3">07-04-2023 20:00</td>
                    <td className="p-3">
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Programado
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                      <button className="text-red-600 hover:text-red-800">Cancelar</button>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">5 consejos para invertir</td>
                    <td className="p-3">Reel</td>
                    <td className="p-3">Instagram</td>
                    <td className="p-3">10-04-2023 20:00</td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Listo para publicar
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                      <button className="text-red-600 hover:text-red-800">Cancelar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Enlaces Rápidos</h2>
            <SocialLinks />
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Métricas Recientes</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Instagram</span>
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">TikTok</span>
                  <span className="text-sm text-green-600">+34.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-black h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">YouTube</span>
                  <span className="text-sm text-green-600">+8.3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Spotify</span>
                  <span className="text-sm text-green-600">+15.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 