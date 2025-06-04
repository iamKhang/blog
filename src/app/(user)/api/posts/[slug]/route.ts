import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface Props {
  params: {
    slug: string;
  };
}

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export async function GET(request: Request, { params }: Props) {
  try {
    const { slug } = await params;

    // Lấy thông tin user từ cookie (nếu có)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    let userId: string | null = null;

    if (accessToken) {
      try {
        const decoded = jwtDecode<JWTPayload>(accessToken);
        userId = decoded.id;
      } catch (error) {
        console.log('Invalid token');
      }
    }

    const post = await prisma.post.findUnique({
      where: { slug },
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

    // Transform the post data to include counts and user interaction status
    const viewedBy = post.viewedBy || [];
    const likedBy = post.likedBy || [];

    const transformedPost = {
      ...post,
      views: viewedBy.length,
      likes: likedBy.length,
      isLikedByUser: userId ? likedBy.includes(userId) : false,
      // Remove the arrays from the response for security
      viewedBy: undefined,
      likedBy: undefined,
    };

    return NextResponse.json(transformedPost);
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
    const { slug } = await params;
    const body = await request.json();
    const post = await prisma.post.findUnique({
      where: { slug }
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
        published: body.published,
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