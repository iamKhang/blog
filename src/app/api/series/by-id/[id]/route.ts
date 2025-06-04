import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// Schema validation for request body
const SeriesUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  coverImage: z.string().optional(),
  isActive: z.boolean().default(true),
  slug: z.string(),
});

// GET /api/series/by-id/[id] - Get a specific series by ID
export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const series = await prisma.series.findUnique({
      where: {
        id,
      },
      include: {
        posts: {
          orderBy: {
            orderInSeries: "asc",
          },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            orderInSeries: true,
          },
        },
      },
    });

    if (!series) {
      return NextResponse.json(
        { message: "Series not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(series);
  } catch (error) {
    console.error("[SERIES_GET_BY_ID]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/series/by-id/[id] - Update a specific series
export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = SeriesUpdateSchema.parse(body);

    // Check if series exists
    const existingSeries = await prisma.series.findUnique({
      where: { id },
    });

    if (!existingSeries) {
      return NextResponse.json(
        { message: "Series not found" },
        { status: 404 }
      );
    }

    // Check if slug is already used by another series
    if (validatedData.slug !== existingSeries.slug) {
      const seriesWithSlug = await prisma.series.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: id },
        },
      });

      if (seriesWithSlug) {
        return NextResponse.json(
          { message: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const updatedSeries = await prisma.series.update({
      where: {
        id,
      },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        coverImage: validatedData.coverImage,
        isActive: validatedData.isActive,
      },
      include: {
        posts: {
          orderBy: {
            orderInSeries: "asc",
          },
        },
      },
    });

    return NextResponse.json(updatedSeries);
  } catch (error) {
    console.error("[SERIES_PATCH]", error);

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

// DELETE /api/series/by-id/[id] - Delete a specific series
export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    // Check if series exists
    const existingSeries = await prisma.series.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });

    if (!existingSeries) {
      return NextResponse.json(
        { message: "Series not found" },
        { status: 404 }
      );
    }

    // Update all posts in the series to remove the series reference
    if (existingSeries.posts.length > 0) {
      await prisma.post.updateMany({
        where: {
          seriesId: id,
        },
        data: {
          seriesId: null,
          orderInSeries: null,
        },
      });
    }

    // Delete the series
    await prisma.series.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Series deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SERIES_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
