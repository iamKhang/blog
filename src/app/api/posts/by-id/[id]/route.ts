import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

interface Props {
  params: {
    id: string;
  };
}

// Schema validation cho request body
const PostUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  coverImage: z.string().optional(),
  isPinned: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  seriesId: z.string().nullable(),
  orderInSeries: z.number().int().nullable(),
  slug: z.string(),
});

export async function GET(request: Request, { params }: Props) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
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
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

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
    const validatedData = PostUpdateSchema.parse(body);

    // Kiểm tra xem post có tồn tại không
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    // Kiểm tra xem slug mới có trùng với bài viết khác không
    if (validatedData.slug !== existingPost.slug) {
      const postWithSlug = await prisma.post.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: params.id },
        },
      });

      if (postWithSlug) {
        return NextResponse.json(
          { message: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: params.id,
      },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        coverImage: validatedData.coverImage,
        isPinned: validatedData.isPinned,
        isHidden: validatedData.isHidden,
        categories: {
          set: validatedData.categories?.map((id) => ({ id })) || [],
        },
        tags: {
          set: validatedData.tags?.map((id) => ({ id })) || [],
        },
        seriesId: validatedData.seriesId,
        orderInSeries: validatedData.orderInSeries,
      },
      include: {
        categories: true,
        tags: true,
        series: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("[POST_PATCH]", error);

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