import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Recibir y loguear eventos de NextAuth
  try {
    const body = await request.json();
    console.log("[NextAuth]", body.code, body.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en _log:", error);
    return NextResponse.json({ success: false });
  }
} 