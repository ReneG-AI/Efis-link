import { redirect } from 'next/navigation';

// Redirección directa al dashboard en el servidor
export default function Home() {
  redirect('/dashboard');
} 