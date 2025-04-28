import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Schema cho việc tạo category
const CategoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export async function GET() {
  try {
    // Sử dụng Prisma để lấy danh sách categories
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CategoryCreateSchema.parse(body);

    // Kiểm tra category đã tồn tại
    const existingCategory = await prisma.category.findUnique({
      where: { name: validatedData.name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 400 }
      );
    }

    // Tạo category mới với mảng postIds rỗng
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        postIds: [], // Thêm mảng rỗng cho postIds
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}