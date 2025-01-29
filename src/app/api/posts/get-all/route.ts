import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";


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
        ],
      };
  
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
          },
          orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
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
  