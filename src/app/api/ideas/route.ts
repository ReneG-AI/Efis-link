import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

// GET /api/ideas
export async function GET(request: NextRequest) {
  try {
    // Opcional: Validar sesión si quieres que sea privado
    // const session = await getServerSession() as Session | null;
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const ideas = await prisma.idea.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convertir fecha para JSON
    const formattedIdeas = ideas.map(idea => ({
      ...idea,
      createdAt: idea.createdAt.toISOString(),
      updatedAt: idea.updatedAt.toISOString()
    }));

    return NextResponse.json(formattedIdeas);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json({ error: "Failed to fetch ideas" }, { status: 500 });
  }
}

// POST /api/ideas
export async function POST(request: NextRequest) {
  try {
    // Opcional: Validar sesión
    // const session = await getServerSession() as Session | null;
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const data = await request.json();
    
    // Validar datos mínimos
    if (!data.title || !data.description || !data.platform || !data.status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Preparar datos para guardar
    const ideaData = {
      ...data,
      tags: data.tags || [],
      // userId: session?.user?.id // Opcional: asociar con usuario
    };

    const idea = await prisma.idea.create({
      data: ideaData
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json({ error: "Failed to create idea" }, { status: 500 });
  }
}

// DELETE /api/ideas (con body que contiene el ID)
export async function DELETE(request: NextRequest) {
  try {
    // Opcional: Validar sesión
    // const session = await getServerSession() as Session | null;
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const data = await request.json();
    if (!data.id) {
      return NextResponse.json({ error: "Idea ID is required" }, { status: 400 });
    }

    await prisma.idea.delete({
      where: {
        id: data.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting idea:", error);
    return NextResponse.json({ error: "Failed to delete idea" }, { status: 500 });
  }
} 