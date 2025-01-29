import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    // Lấy các tham số từ URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const skip = (page - 1) * limit;

    // Đếm tổng số projects
    const totalProjects = await prisma.project.count();

    // Lấy projects với phân trang
    const projects = await prisma.project.findMany({
      include: {
        technologies: true,
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit,
    });

    return NextResponse.json({
      projects,
      metadata: {
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(totalProjects / limit),
        totalItems: totalProjects,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const slug = slugify(data.title, {
      lower: true,
      strict: true,
    });

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        description: data.description,
        thumbnail: data.thumbnail,
        status: data.status,
        githubUrl: data.githubUrl,
        demoUrl: data.demoUrl,
        docsUrl: data.docsUrl,
        isPinned: data.isPinned || false,
        isHidden: data.isHidden || false,
        technologies: {
          connect: data.technologies.map((id: string) => ({ id }))
        }
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
} 