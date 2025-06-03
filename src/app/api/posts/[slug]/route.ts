import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
        series: {
          select: {
            id: true,
            title: true,
            slug: true,
            posts: {
              select: {
                id: true,
                title: true,
                slug: true,
                orderInSeries: true,
              },
              orderBy: {
                orderInSeries: 'asc',
              },
            },
          },
        },
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
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("[GET_POST]", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
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
        tags: body.tags || [],
      },
      include: {
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