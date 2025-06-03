import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// Schema validation for request body
const SeriesPostsUpdateSchema = z.object({
  posts: z.array(
    z.object({
      id: z.string(),
      orderInSeries: z.number().int().min(1),
    })
  ),
});

// GET /api/series/by-id/[id]/posts - Get all posts in a series
export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const series = await prisma.series.findUnique({
      where: {
        id,
      },
      include: {
        posts: {
          orderBy: {
            orderInSeries: "asc",
          },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            orderInSeries: true,
          },
        },
      },
    });

    if (!series) {
      return NextResponse.json(
        { message: "Series not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(series.posts);
  } catch (error) {
    console.error("[SERIES_POSTS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/series/by-id/[id]/posts - Update posts in a series (reorder or add/remove)
export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = SeriesPostsUpdateSchema.parse(body);

    // Check if series exists
    const existingSeries = await prisma.series.findUnique({
      where: { id },
    });

    if (!existingSeries) {
      return NextResponse.json(
        { message: "Series not found" },
        { status: 404 }
      );
    }

    // Get current posts in the series
    const currentPosts = await prisma.post.findMany({
      where: {
        seriesId: id,
      },
      select: {
        id: true,
      },
    });

    const currentPostIds = currentPosts.map((post) => post.id);
    const newPostIds = validatedData.posts.map((post) => post.id);

    // Posts to remove from series
    const postsToRemove = currentPostIds.filter(
      (id) => !newPostIds.includes(id)
    );

    // Remove posts from series
    if (postsToRemove.length > 0) {
      await prisma.post.updateMany({
        where: {
          id: {
            in: postsToRemove,
          },
        },
        data: {
          seriesId: null,
          orderInSeries: null,
        },
      });
    }

    // Update or add posts to series
    for (const post of validatedData.posts) {
      await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          seriesId: id,
          orderInSeries: post.orderInSeries,
        },
      });
    }

    // Get updated series with posts
    const updatedSeries = await prisma.series.findUnique({
      where: {
        id,
      },
      include: {
        posts: {
          orderBy: {
            orderInSeries: "asc",
          },
        },
      },
    });

    return NextResponse.json(updatedSeries);
  } catch (error) {
    console.error("[SERIES_POSTS_PATCH]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
