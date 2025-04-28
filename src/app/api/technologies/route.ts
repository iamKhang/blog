import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Schema cho việc tạo technology
const TechnologyCreateSchema = z.object({
  name: z.string().min(1, "Technology name is required"),
  url: z.string().url("URL is invalid"),
});

export async function GET() {
  try {
    // Sử dụng Prisma để lấy danh sách technologies
    const technologies = await prisma.technology.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(technologies);
  } catch (error) {
    console.error("GET TECHNOLOGIES ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch technologies", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = TechnologyCreateSchema.parse(body);

    // Kiểm tra technology đã tồn tại
    const existingTechnology = await prisma.technology.findUnique({
      where: { name: validatedData.name },
    });

    if (existingTechnology) {
      return NextResponse.json(
        { message: "Technology already exists" },
        { status: 400 }
      );
    }

    // Tạo technology mới với mảng projectIds rỗng
    const technology = await prisma.technology.create({
      data: {
        name: validatedData.name,
        url: validatedData.url,
        projectIds: [], // Thêm mảng rỗng cho projectIds
      }
    });

    return NextResponse.json(technology, { status: 201 });
  } catch (error) {
    console.error("CREATE TECHNOLOGY ERROR:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to create technology", error: String(error) },
      { status: 500 }
    );
  }
}
