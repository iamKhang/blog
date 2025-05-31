import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";
    const published = searchParams.get("published") || "true";
    const isPinned = searchParams.get("isPinned") || "false";

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

    // Build where clause
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
        { published: published === "true" },
        { isHidden: false },
      ],
    };

    // console.log("Query parameters:", { page, limit, search, tag, published });
    // console.log("Where clause:", JSON.stringify(where, null, 2));

    try {
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
            isHidden: true,
            views: true,
            likes: true,
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

    return NextResponse.json({
      posts,
      metadata: {
        total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
    } catch (dbError) {
      console.error("Database error:", dbError);
      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        return NextResponse.json(
          { error: `Database error: ${dbError.message}` },
          { status: 500 }
        );
      }
      throw dbError;
    }
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
  