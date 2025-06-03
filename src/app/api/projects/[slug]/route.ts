import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log('Fetching project with slug:', slug);

    const project = await prisma.project.findUnique({
      where: { 
        slug,
        isHidden: false // Chỉ lấy project không bị ẩn
      },
    });

    if (!project) {
      console.log('Project not found with slug:', slug);
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    console.log('Found project:', project.id);

    // Tăng lượt xem
    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: { views: { increment: 1 } },
    });

    console.log('Updated views for project:', updatedProject.id);

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error in project API:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
} 