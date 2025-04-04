import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/auth";

// GET /api/ideas
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const ideas = await prisma.idea.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        // Opcional: filtrar por usuario
        // where: session.user?.id ? { userId: parseInt(session.user.id) } : undefined,
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
  });
}

// POST /api/ideas
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const data = await req.json();
      
      // Validar datos mínimos
      if (!data.title || !data.description || !data.platform || !data.status) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      // Preparar datos para guardar
      const ideaData = {
        ...data,
        tags: data.tags || [],
        userId: session.user?.id ? parseInt(session.user.id) : undefined
      };

      const idea = await prisma.idea.create({
        data: ideaData
      });

      return NextResponse.json(idea, { status: 201 });
    } catch (error) {
      console.error("Error creating idea:", error);
      return NextResponse.json({ error: "Failed to create idea" }, { status: 500 });
    }
  });
}

// DELETE /api/ideas (con body que contiene el ID)
export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const data = await req.json();
      if (!data.id) {
        return NextResponse.json({ error: "Idea ID is required" }, { status: 400 });
      }

      // Verificar si la idea existe
      const idea = await prisma.idea.findUnique({
        where: { id: data.id }
      });

      if (!idea) {
        return NextResponse.json({ error: "Idea not found" }, { status: 404 });
      }

      // Opcional: Verificar permisos
      // if (idea.userId && idea.userId !== parseInt(session.user.id) && session.user.role !== 'ADMIN') {
      //   return NextResponse.json({ error: "Unauthorized to delete this idea" }, { status: 403 });
      // }

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
  });
} 