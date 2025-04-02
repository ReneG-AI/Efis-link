import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/posts/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession() as Session | null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// PUT /api/posts/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession() as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, platforms, date, status, mediaUrl } = await request.json();

    if (!title || !content || !platforms || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        content,
        platforms,
        date: new Date(date),
        status: status || "draft",
        mediaUrl,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE /api/posts/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession() as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.post.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
} 