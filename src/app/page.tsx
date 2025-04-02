export default function Home() {
  return (
    <main>
      <div className="min-h-screen bg-gray-100 p-10">
        <h1 className="text-3xl font-bold mb-8">
          Panel de Control EFIS Podcast
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Enlaces Rápidos</h2>
            <div className="grid grid-cols-1 gap-3">
              <a href="#" className="flex items-center p-3 rounded-md text-white bg-purple-500">
                <span className="text-xl mr-3">📸</span>
                <span className="font-medium">Instagram</span>
              </a>
              <a href="#" className="flex items-center p-3 rounded-md text-white bg-black">
                <span className="text-xl mr-3">🎵</span>
                <span className="font-medium">TikTok</span>
              </a>
              <a href="#" className="flex items-center p-3 rounded-md text-white bg-red-600">
                <span className="text-xl mr-3">🎬</span>
                <span className="font-medium">YouTube</span>
              </a>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Seguidores</p>
                <p className="text-2xl font-bold">4,128</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Publicaciones</p>
                <p className="text-2xl font-bold">87</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Calendario de Contenido</h2>
            <div className="grid grid-cols-5 gap-2">
              <div className="font-semibold p-2 bg-gray-100">Lunes</div>
              <div className="font-semibold p-2 bg-gray-100">Martes</div>
              <div className="font-semibold p-2 bg-gray-100">Miércoles</div>
              <div className="font-semibold p-2 bg-gray-100">Jueves</div>
              <div className="font-semibold p-2 bg-gray-100">Viernes</div>
              
              <div className="border p-2">
                <div className="text-xs p-2 bg-green-100 rounded">
                  Grabación Reel (11:00 AM)
                </div>
              </div>
              <div className="border p-2">
                <div className="text-xs p-2 bg-blue-100 rounded">
                  Grabación Podcast (11:00 AM)
                </div>
              </div>
              <div className="border p-2">
                <div className="text-xs p-2 bg-green-100 rounded">
                  Grabación Reel (11:00 AM)
                </div>
              </div>
              <div className="border p-2">
                <div className="text-xs p-2 bg-green-100 rounded">
                  Grabación Reel (11:00 AM)
                </div>
              </div>
              <div className="border p-2">
                <div className="text-xs p-2 bg-yellow-100 rounded">
                  Grabación Teaser (11:00 AM)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 