import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET /api/posts - Get all posts with pagination and filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";
    const published = searchParams.get("published") || "true";

    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        } : {},
        tag ? { tags: { has: tag } } : {},
        { published: published === "true" },
      ],
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          series: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      published = false,
      isPinned = false,
      isHidden = false,
      tags,
      seriesId,
      orderInSeries,
      authorId,
    } = body;

    // Convert tags string to array if needed
    const tagsArray = Array.isArray(tags) ? tags : (tags ? tags.split(',').map((tag: string) => tag.trim()) : []);

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        published,
        isPinned,
        isHidden,
        tags: tagsArray,
        seriesId: seriesId || null,
        orderInSeries: orderInSeries || null,
        authorId,
      },
      include: {
        series: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH /api/posts - Update a post
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    // Convert tags string to array if needed
    const tagsArray = Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : []);

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...data,
        tags: tagsArray,
        seriesId: data.seriesId || null,
        orderInSeries: data.orderInSeries || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        series: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts - Delete a post
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
