import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: Request, { params }: Props) {
  try {
    const { slug } = await params;
    const series = await prisma.series.findUnique({
      where: {
        slug,
        isActive: true,
      },
      include: {
        posts: {
          where: {
            isHidden: false,
          },
          orderBy: {
            orderInSeries: "asc",
          },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            views: true,
            likes: true,
            createdAt: true,
            orderInSeries: true,
          },
        },
        _count: {
          select: {
            posts: {
              where: {
                isHidden: false,
              },
            },
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
    console.error("[SERIES_GET_BY_SLUG]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
