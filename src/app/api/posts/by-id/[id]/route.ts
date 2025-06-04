import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// Schema validation cho request body
const PostUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  coverImage: z.string().optional(),
  isPinned: z.boolean().default(false),
  published: z.boolean().default(false),
  tags: z.string().transform(val => 
    val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
  ),
  seriesId: z.string().nullable(),
  orderInSeries: z.number().int().nullable(),
  slug: z.string(),
});

export async function GET(request: Request, { params }: Props) {
  try {
    if (!prisma) {
      throw new Error("Prisma client is not initialized");
    }

    const { id } = await params;
    console.log("GET request params:", { id }); // Debug log

    // Validate ID
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        series: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Transform the post data to include counts instead of arrays
    const viewedBy = post.viewedBy || [];
    const likedBy = post.likedBy || [];

    const transformedPost = {
      ...post,
      views: viewedBy.length,
      likes: likedBy.length,
      // Remove the arrays from the response for security
      viewedBy: undefined,
      likedBy: undefined,
    };

    return NextResponse.json(transformedPost);
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
    if (!prisma) {
      throw new Error("Prisma client is not initialized");
    }

    const { id } = await params;
    console.log("PATCH request params:", { id }); // Debug log

    // Validate ID
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body); // Log request body

    try {
      const validatedData = PostUpdateSchema.parse(body);
      console.log('Validated data:', validatedData); // Log validated data

      // Kiểm tra xem post có tồn tại không
      const existingPost = await prisma.post.findUnique({
        where: { id },
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
            id: { not: id },
          },
        });

        if (postWithSlug) {
          return NextResponse.json(
            { message: "Slug already exists" },
            { status: 400 }
          );
        }
      }

      console.log("Updating post with ID:", id); // Debug log
      // Log without content
      const { content, ...logData } = validatedData;
      console.log("Update data:", {
        ...logData,
        tags: validatedData.tags || [],
      });

      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          title: validatedData.title,
          slug: validatedData.slug,
          content: validatedData.content,
          excerpt: validatedData.excerpt,
          coverImage: validatedData.coverImage,
          isPinned: validatedData.isPinned,
          published: validatedData.published,
          tags: validatedData.tags || [],
          seriesId: validatedData.seriesId,
          orderInSeries: validatedData.orderInSeries,
        },
        include: {
          series: true,
        },
      });

      // Log response without content
      const { content: responseContent, ...responseData } = updatedPost;
      console.log("Updated post:", responseData); // Debug log
      return NextResponse.json(updatedPost);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            message: "Invalid request data", 
            errors: validationError.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error("[POST_PATCH]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}