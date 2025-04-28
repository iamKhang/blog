import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Schema cho việc tạo tag
const TagCreateSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
});

export async function GET() {
  try {
    // Sử dụng Prisma để lấy danh sách tags
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("GET TAGS ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = TagCreateSchema.parse(body);

    // Kiểm tra tag đã tồn tại
    const existingTag = await prisma.tag.findUnique({
      where: { name: validatedData.name },
    });

    if (existingTag) {
      return NextResponse.json(
        { message: "Tag already exists" },
        { status: 400 }
      );
    }

    // Tạo tag mới với mảng postIds rỗng
    const tag = await prisma.tag.create({
      data: {
        name: validatedData.name,
        postIds: [], // Thêm mảng rỗng cho postIds
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("CREATE TAG ERROR:", error);
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