import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// GET /api/posts - Lấy danh sách posts có phân trang
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const tagId = searchParams.get("tagId");

    const skip = (page - 1) * limit;

    // Xây dựng điều kiện tìm kiếm
    const where = {
      AND: [
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
          ],
        },
        categoryId
          ? {
              categories: {
                some: {
                  id: categoryId,
                },
              },
            }
          : {},
        tagId
          ? {
              tags: {
                some: {
                  id: tagId,
                },
              },
            }
          : {},
        { isHidden: false },
      ],
    };

    const seriesId = searchParams.get("seriesId");

    // Add series filter if provided
    if (seriesId) {
      where.AND.push({
        seriesId: seriesId,
      });
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: where as Prisma.PostWhereInput,
        include: {
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
          series: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: seriesId
          ? [{ orderInSeries: "asc" }]
          : [{ isPinned: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.post.count({ where: where as Prisma.PostWhereInput }),
    ]);

    // Tăng view count cho các bài viết được fetch
    if (posts.length > 0) {
      await Promise.all(
        posts.map((post) =>
          prisma.post.update({
            where: { id: post.id },
            data: { views: { increment: 1 } },
          })
        )
      );
    }

    return NextResponse.json({
      posts,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[POSTS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Schema validation cho request body
const PostCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  coverImage: z.string().optional(),
  isPinned: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  authorId: z.string().min(1, "Author ID is required"),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  seriesId: z.string().optional(),
  orderInSeries: z.number().int().optional(),
  slug: z.string(), // Slug sẽ được tạo tự động từ title
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = PostCreateSchema.parse(body);

    // Kiểm tra xem slug đã tồn tại chưa
    const existingPost = await prisma.post.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { message: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        coverImage: validatedData.coverImage,
        isPinned: validatedData.isPinned,
        isHidden: validatedData.isHidden,
        authorId: validatedData.authorId,
        categories: validatedData.categories
          ? {
              connect: validatedData.categories.map((categoryId) => ({
                id: categoryId,
              })),
            }
          : undefined,
        tags: validatedData.tags
          ? {
              connect: validatedData.tags.map((tagId) => ({
                id: tagId,
              })),
            }
          : undefined,
        seriesId: validatedData.seriesId || null,
        orderInSeries: validatedData.orderInSeries || null,
      },
      include: {
        categories: true,
        tags: true,
        series: true,
      },
    });

    return NextResponse.json(
      { message: "Post created successfully", post },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST ERROR:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
