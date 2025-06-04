import { NextResponse } from "next/server";
import { slugify } from "@/lib/utils";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

// Schema cho việc tạo project
const ProjectCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  status: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  techStack: z.array(z.string()).default([]),
});

export async function GET(request: Request) {
  try {
    // Lấy các tham số từ URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');

    // Lấy thông tin user từ cookie (nếu có)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    let userId: string | null = null;

    if (accessToken) {
      try {
        const decoded = jwtDecode<JWTPayload>(accessToken);
        userId = decoded.id;
      } catch (error) {
        console.log('Invalid token');
      }
    }
    const skip = (page - 1) * limit;

    // Đếm tổng số projects
    const totalProjects = await prisma.project.count();

    // Lấy projects với phân trang
    const projects = await prisma.project.findMany({
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        description: true,
        thumbnail: true,
        techStack: true,
        status: true,
        viewedBy: true,
        likedBy: true,
        isPinned: true,
        isHidden: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Transform projects to include counts and user interaction status
    const formattedProjects = projects.map(project => {
      const viewedBy = project.viewedBy || [];
      const likedBy = project.likedBy || [];

      return {
        id: project.id,
        title: project.title,
        slug: project.slug,
        excerpt: project.excerpt,
        description: project.description,
        thumbnail: project.thumbnail,
        techStack: project.techStack || [],
        status: project.status,
        views: viewedBy.length,
        likes: likedBy.length,
        isLikedByUser: userId ? likedBy.includes(userId) : false,
        isPinned: project.isPinned || false,
        isHidden: project.isHidden || false,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        // Remove arrays from response for security
        viewedBy: undefined,
        likedBy: undefined,
      };
    });

    return NextResponse.json({
      projects: formattedProjects,
      metadata: {
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(totalProjects / limit),
        totalItems: totalProjects,
      }
    });
  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);
    return NextResponse.json(
      {
        projects: [],
        metadata: {
          currentPage: 1,
          pageSize: 9,
          totalPages: 0,
          totalItems: 0,
        }
      },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validatedData = ProjectCreateSchema.parse(data);

    // Kiểm tra project đã tồn tại
    const existingProject = await prisma.project.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingProject) {
      return NextResponse.json(
        { message: "A project with this slug already exists" },
        { status: 400 }
      );
    }

    // Tạo project mới
    const project = await prisma.project.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        description: validatedData.description,
        thumbnail: validatedData.thumbnail,
        status: validatedData.status,
        isPinned: validatedData.isPinned,
        isHidden: validatedData.isHidden,
        techStack: validatedData.techStack,
        viewedBy: [],
        likedBy: [],
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("PROJECT CREATION ERROR:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to create project", error: String(error) },
      { status: 500 }
    );
  }
}