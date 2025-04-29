import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Schema validation for request body
const SeriesCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  coverImage: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  slug: z.string(),
});

// GET /api/series - Get all series with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const includeInactive = searchParams.get("includeInactive") === "true";

    const skip = (page - 1) * limit;

    // Build search conditions
    const where = {
      AND: [
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
        includeInactive ? {} : { isActive: true },
      ],
    };

    const [series, total] = await Promise.all([
      prisma.series.findMany({
        where: where as Prisma.SeriesWhereInput,
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.series.count({ where: where as Prisma.SeriesWhereInput }),
    ]);

    return NextResponse.json({
      series,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[SERIES_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/series - Create a new series
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = SeriesCreateSchema.parse(body);

    // Check if slug already exists
    const existingSeries = await prisma.series.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingSeries) {
      return NextResponse.json(
        { message: "A series with this slug already exists" },
        { status: 400 }
      );
    }

    const series = await prisma.series.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        coverImage: validatedData.coverImage,
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json(
      { message: "Series created successfully", series },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SERIES_POST]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
