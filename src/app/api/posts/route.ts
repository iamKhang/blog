import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

// GET /api/posts - Get all posts with pagination and filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";
    const published = searchParams.get("published") || "true";

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

    // Validate input parameters
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page number" },
        { status: 400 }
      );
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid limit. Must be between 1 and 100" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { excerpt: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        } : {},
        tag ? { tags: { has: tag } } : {},
        // Only filter by published status if we're on the public blog page
        published === "true" ? { published: true } : {},
      ],
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isPinned: "desc" },
          { createdAt: "desc" }
        ],
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          excerpt: true,
          coverImage: true,
          published: true,
          isPinned: true,
          viewedBy: true,
          likedBy: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
          series: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    // Transform posts to include counts and user interaction status
    const transformedPosts = posts.map(post => {
      const viewedBy = post.viewedBy || [];
      const likedBy = post.likedBy || [];

      return {
        ...post,
        views: viewedBy.length,
        likes: likedBy.length,
        isLikedByUser: userId ? likedBy.includes(userId) : false,
        // Remove arrays from response for security
        viewedBy: undefined,
        likedBy: undefined,
      };
    });

    return NextResponse.json({
      posts: transformedPosts,
      metadata: {
        total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch posts",
        details: error instanceof Error ? error.message : "Unknown error"
      },
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

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Validate ID format
    if (id.length !== 24) {
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check for slug uniqueness if slug is being updated
    if (data.slug && data.slug !== existingPost.slug) {
      const postWithSlug = await prisma.post.findFirst({
        where: {
          slug: data.slug,
          id: { not: id },
        },
      });

      if (postWithSlug) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    // Convert tags string to array if needed
    const tagsArray = Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : []);

    console.log("Updating post with ID:", id); // Debug log
    const { content, ...logData } = data;
    console.log("Update data:", {
      ...logData,
      tags: tagsArray,
    });

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...data,
        tags: tagsArray,
        seriesId: data.seriesId || null,
        orderInSeries: data.orderInSeries || null,
      },
      include: {
        series: true,
      },
    });

    // Log response without content
    const { content: responseContent, ...responseData } = updatedPost;
    console.log("Updated post:", responseData); // Debug log

    return NextResponse.json(updatedPost);
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
