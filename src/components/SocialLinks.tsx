import React from 'react';

export default function SocialLinks() {
  const socialLinks = [
    {
      id: 1,
      platform: 'Instagram',
      url: 'https://instagram.com/efispodcast',
      icon: '📸',
      color: 'bg-purple-500',
    },
    {
      id: 2,
      platform: 'TikTok',
      url: 'https://tiktok.com/@efispodcast',
      icon: '🎵',
      color: 'bg-black',
    },
    {
      id: 3,
      platform: 'YouTube',
      url: 'https://youtube.com/c/efispodcast',
      icon: '🎬',
      color: 'bg-red-600',
    },
    {
      id: 4,
      platform: 'Spotify',
      url: 'https://open.spotify.com/show/efispodcast',
      icon: '🎧',
      color: 'bg-green-600',
    },
    {
      id: 5,
      platform: 'LinkedIn',
      url: 'https://linkedin.com/company/efispodcast',
      icon: '💼',
      color: 'bg-blue-700',
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3">
      {socialLinks.map(link => (
        <a
          key={link.id}
          href={link.url}
          className={`flex items-center p-3 rounded-md text-white ${link.color}`}
        >
          <span className="text-xl mr-3">{link.icon}</span>
          <span className="font-medium">{link.platform}</span>
        </a>
      ))}
      
      <div className="mt-4">
        <button className="btn btn-primary w-full flex items-center justify-center">
          <span className="mr-2">+</span> Añadir nuevo enlace
        </button>
      </div>
    </div>
  );
} 