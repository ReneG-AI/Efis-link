"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import EventCalendar from "@/components/EventCalendar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const eventsRes = await fetch("/api/events");
      const postsRes = await fetch("/api/posts");
      
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      }
      
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Cargando...</h2>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4">{session?.user?.name}</span>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700">Próximos Eventos</h3>
              <p className="text-3xl font-semibold text-blue-800">{events.length}</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700">Publicaciones</h3>
              <p className="text-3xl font-semibold text-blue-800">{posts.length}</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700">Plataformas Activas</h3>
              <p className="text-3xl font-semibold text-blue-800">3</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700">Total Interacciones</h3>
              <p className="text-3xl font-semibold text-blue-800">1,520</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">Calendario de Contenido</h3>
                <Link href="/calendar" className="text-sm text-blue-700 hover:underline">
                  Ver todo
                </Link>
              </div>
              <div className="h-64">
                <EventCalendar events={events} />
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">Publicaciones Recientes</h3>
                <Link href="/social" className="text-sm text-blue-700 hover:underline">
                  Ver todo
                </Link>
              </div>
              <div className="space-y-4">
                {posts.slice(0, 3).map((post: any) => (
                  <div key={post.id} className="p-4 border rounded-md">
                    <h4 className="font-medium">{post.title}</h4>
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span className="px-2 py-1 text-xs text-white bg-blue-800 rounded-full">
                        {post.status}
                      </span>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && (
                  <p className="text-center text-gray-500">No hay publicaciones recientes</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 