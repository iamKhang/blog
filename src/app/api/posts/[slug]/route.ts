import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Props {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: Props) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: params.slug,
        AND: [
          { isHidden: false }
        ]
      },
      include: {
        categories: {
          select: {
            id: true,
            name: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true
          }
        }
      },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // Tăng view count
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("[POST_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const body = await request.json();
    const post = await prisma.post.findUnique({
      where: { slug: params.slug }
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        isPinned: body.isPinned,
        isHidden: body.isHidden,
        categories: {
          set: body.categories?.map((id: string) => ({ id })),
        },
        tags: {
          set: body.tags?.map((id: string) => ({ id })),
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("[POST_PATCH]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 