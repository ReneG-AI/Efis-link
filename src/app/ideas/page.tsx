"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';

interface Idea {
  id: string;
  title: string;
  description: string;
  platform: string;
  tags: string[];
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/ideas');
        
        if (!response.ok) {
          throw new Error('Error al cargar ideas');
        }
        
        let data = await response.json();
        
        data = data.map((idea: any) => ({
          ...idea,
          createdAt: new Date(idea.createdAt)
        }));
        
        setIdeas(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching ideas:', err);
        setError('No se pudieron cargar las ideas. Por favor, intenta de nuevo más tarde.');
        
        if (typeof window !== 'undefined') {
          const savedIdeas = localStorage.getItem('content-ideas');
          if (savedIdeas) {
            try {
              const parsedIdeas = JSON.parse(savedIdeas, (key, value) => {
                if (key === 'createdAt') {
                  return new Date(value);
                }
                return value;
              });
              setIdeas(parsedIdeas);
            } catch (error) {
              console.error('Error al cargar ideas guardadas:', error);
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIdeas();
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && ideas.length > 0) {
      localStorage.setItem('content-ideas', JSON.stringify(ideas));
    }
  }, [ideas]);

  const [showModal, setShowModal] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<Partial<Idea>>({
    title: '',
    description: '',
    platform: 'Instagram',
    tags: [],
    status: 'pending'
  });
  const [newTag, setNewTag] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Spotify'];
  const statuses = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in-progress', label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completado', color: 'bg-green-100 text-green-800' }
  ];

  const handleOpenModal = (idea?: Idea) => {
    if (idea) {
      setCurrentIdea(idea);
      setIsEditing(true);
    } else {
      setCurrentIdea({
        title: '',
        description: '',
        platform: 'Instagram',
        tags: [],
        status: 'pending'
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !currentIdea.tags?.includes(newTag.trim())) {
      setCurrentIdea({
        ...currentIdea,
        tags: [...(currentIdea.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setCurrentIdea({
      ...currentIdea,
      tags: currentIdea.tags?.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSaveIdea = async () => {
    if (isEditing) {
      try {
        const response = await fetch(`/api/ideas/${currentIdea.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentIdea),
        });
        
        if (!response.ok) {
          throw new Error('Error al actualizar la idea');
        }
        
        const updatedIdea = await response.json();
        
        setIdeas(ideas.map(idea => 
          idea.id === currentIdea.id 
            ? { ...updatedIdea, createdAt: new Date(updatedIdea.createdAt) } as Idea 
            : idea
        ));
      } catch (error) {
        console.error('Error updating idea:', error);
        alert('No se pudo actualizar la idea. Por favor, intenta de nuevo.');
        
        setIdeas(ideas.map(idea => 
          idea.id === currentIdea.id 
            ? { ...idea, ...currentIdea, tags: currentIdea.tags || [] } as Idea 
            : idea
        ));
      }
    } else {
      try {
        const response = await fetch('/api/ideas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: currentIdea.title,
            description: currentIdea.description,
            platform: currentIdea.platform,
            tags: currentIdea.tags || [],
            status: currentIdea.status
          }),
        });
        
        if (!response.ok) {
          throw new Error('Error al crear la idea');
        }
        
        const createdIdea = await response.json();
        
        setIdeas([{ ...createdIdea, createdAt: new Date(createdIdea.createdAt) } as Idea, ...ideas]);
      } catch (error) {
        console.error('Error creating idea:', error);
        alert('No se pudo crear la idea. Por favor, intenta de nuevo.');
        
        const newIdea: Idea = {
          id: Math.random().toString(36).substring(2, 9),
          title: currentIdea.title || '',
          description: currentIdea.description || '',
          platform: currentIdea.platform || 'Instagram',
          tags: currentIdea.tags || [],
          status: currentIdea.status as 'pending' | 'in-progress' | 'completed',
          createdAt: new Date()
        };
        setIdeas([newIdea, ...ideas]);
      }
    }
    setShowModal(false);
  };

  const handleDeleteIdea = async (id: string) => {
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar la idea');
      }
      
      setIdeas(ideas.filter(idea => idea.id !== id));
    } catch (error) {
      console.error('Error deleting idea:', error);
      alert('No se pudo eliminar la idea. Por favor, intenta de nuevo.');
      
      setIdeas(ideas.filter(idea => idea.id !== id));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentIdea({
      ...currentIdea,
      [name]: value
    });
  };

  const filteredIdeas = ideas.filter(idea => {
    if (filterPlatform && idea.platform !== filterPlatform) return false;
    if (filterStatus && idea.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const statusInfo = statuses.find(s => s.value === status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo?.color}`}>
        {statusInfo?.label}
      </span>
    );
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        
        <div className="flex-1">
          <header className="bg-blue-900 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Ideas para Contenido</h1>
              <button 
                onClick={() => handleOpenModal()}
                className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                + Nueva Idea
              </button>
            </div>
          </header>

          <main className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold">Todas las Ideas</h2>
                
                <div className="flex flex-wrap gap-4">
                  <select
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterPlatform || ''}
                    onChange={(e) => setFilterPlatform(e.target.value || null)}
                  >
                    <option value="">Todas las plataformas</option>
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                  
                  <select
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterStatus || ''}
                    onChange={(e) => setFilterStatus(e.target.value || null)}
                  >
                    <option value="">Todos los estados</option>
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredIdeas.length > 0 ? (
                  filteredIdeas.map(idea => (
                    <div key={idea.id} className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                      <div className={`p-4 ${
                        idea.platform === 'Instagram' ? 'bg-pink-50' : 
                        idea.platform === 'TikTok' ? 'bg-black text-white' :
                        idea.platform === 'YouTube' ? 'bg-red-50' :
                        idea.platform === 'LinkedIn' ? 'bg-blue-50' : 'bg-green-50'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{idea.title}</h3>
                            <p className="text-sm">{idea.platform} - {getStatusBadge(idea.status)}</p>
                          </div>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenModal(idea)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteIdea(idea.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-700 mb-4">{idea.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {idea.tags.map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                          Creado: {idea.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10 text-gray-500">
                    No hay ideas que coincidan con los filtros aplicados.
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6 col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Consejos para Reels virales</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center">1</span>
                    <div>
                      <p className="font-medium">Capta la atención en los primeros segundos</p>
                      <p className="text-sm text-gray-600">Los primeros 3 segundos son cruciales para retener al espectador.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center">2</span>
                    <div>
                      <p className="font-medium">Usa música de tendencia</p>
                      <p className="text-sm text-gray-600">La música popular puede ayudar a que tu contenido sea descubierto.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center">3</span>
                    <div>
                      <p className="font-medium">Mantén el contenido corto y dinámico</p>
                      <p className="text-sm text-gray-600">Los reels de 15-30 segundos suelen tener mejor rendimiento.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center">4</span>
                    <div>
                      <p className="font-medium">Incluye llamados a la acción</p>
                      <p className="text-sm text-gray-600">Pide a tus seguidores que comenten o compartan.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Resumen</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Total de Ideas</span>
                    <span className="font-bold text-lg">{ideas.length}</span>
                  </div>
                  {statuses.map(status => {
                    const count = ideas.filter(idea => idea.status === status.value).length;
                    return (
                      <div key={status.value} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>{status.label}</span>
                        <span className="font-bold text-lg">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Modal para crear/editar ideas */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {isEditing ? 'Editar Idea' : 'Nueva Idea de Contenido'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Título</label>
                    <input 
                      type="text" 
                      name="title"
                      value={currentIdea.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Título de la idea"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <textarea 
                      name="description"
                      value={currentIdea.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Describe la idea en detalle"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Plataforma</label>
                    <select 
                      name="platform"
                      value={currentIdea.platform}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {platforms.map(platform => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <select 
                      name="status"
                      value={currentIdea.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Tags</label>
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Añadir tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                      />
                      <button 
                        type="button"
                        onClick={handleTagAdd}
                        className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                      >
                        Añadir
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentIdea.tags?.map(tag => (
                        <span 
                          key={tag} 
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center"
                        >
                          #{tag}
                          <button 
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="ml-1 text-gray-500 hover:text-red-500"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveIdea}
                    className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                    disabled={!currentIdea.title}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
} 