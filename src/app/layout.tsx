import '../styles/globals.css';
import React from 'react';
import type { Metadata } from 'next';

export const metadata = {
  title: 'Efis Podcast | Panel de Control',
  description: 'Panel de control para gestionar el contenido de Efis Podcast',
};

export default function RootLayout({
  children,
}: {
  children: any;
}) {
  return (
    <html lang="es">
      <head>
        <title>Efis Podcast | Panel de Control</title>
        <meta name="description" content="Panel de control para gestionar el contenido de Efis Podcast" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
} 