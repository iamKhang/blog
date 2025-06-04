import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Lấy thông tin project theo ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Fetching project with ID:', id);

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      console.log('Project not found with ID:', id);
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Transform the project data to include counts instead of arrays
    const viewedBy = project.viewedBy || [];
    const likedBy = project.likedBy || [];

    const transformedProject = {
      ...project,
      views: viewedBy.length,
      likes: likedBy.length,
      // Remove the arrays from the response for security
      viewedBy: undefined,
      likedBy: undefined,
    };

    return NextResponse.json(transformedProject);
  } catch (error) {
    console.error("Error in project API:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật project
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    console.log('Updating project with ID:', id);

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        description: data.description,
        thumbnail: data.thumbnail,
        techStack: data.techStack,
        status: data.status,
        isPinned: data.isPinned,
        isHidden: data.isHidden,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Deleting project with ID:', id);

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
} 