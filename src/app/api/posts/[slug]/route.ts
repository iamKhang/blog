import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Props {
  params: {
    slug: string;
  };
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      include: {
        categories: true,
        series: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.post.update({
      where: { slug: params.slug },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
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
        categoryIds: body.categoryIds || [],
        tags: body.tags || [],
      },
      include: {
        categories: true,
        series: true,
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