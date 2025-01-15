import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod"; // Cài đặt: npm install zod

// Schema validation cho request body
const PostCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  authorId: z.string().min(1, "Author ID is required"),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = PostCreateSchema.parse(body);

    // Tạo bài post mới với categories và tags
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        coverImage: validatedData.coverImage,
        published: validatedData.published,
        isPinned: validatedData.isPinned,
        isHidden: validatedData.isHidden,
        authorId: validatedData.authorId,
        // Kết nối với categories nếu có
        categories: validatedData.categories ? {
          connect: validatedData.categories.map(categoryId => ({
            id: categoryId
          }))
        } : undefined,
        // Kết nối với tags nếu có
        tags: validatedData.tags ? {
          connect: validatedData.tags.map(tagId => ({
            id: tagId
          }))
        } : undefined,
      },
      // Include related data trong response
      include: {
        categories: true,
        tags: true,
      },
    });

    return NextResponse.json(
      { 
        message: "Post created successfully", 
        post 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("POST ERROR:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: "Invalid request data", 
          errors: error.errors 
        }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "Internal server error" 
      }, 
      { status: 500 }
    );
  }
} 