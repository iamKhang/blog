import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const ProjectUpdateSchema = z.object({
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Format response
    const formattedProject = {
      id: project.id,
      title: project.title,
      slug: project.slug,
      excerpt: project.excerpt,
      description: project.description,
      thumbnail: project.thumbnail,
      techStack: project.techStack || [],
      status: project.status,
      views: project.views || 0,
      likes: project.likes || 0,
      isPinned: project.isPinned || false,
      isHidden: project.isHidden || false,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedProject);
  } catch (error) {
    console.error("GET PROJECT BY ID ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const validatedData = ProjectUpdateSchema.parse(data);

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Check if slug is unique (excluding current project)
    if (validatedData.slug !== existingProject.slug) {
      const projectWithSlug = await prisma.project.findUnique({
        where: { slug: validatedData.slug },
      });

      if (projectWithSlug) {
        return NextResponse.json(
          { message: "A project with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
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
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to update project", error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Delete project
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);
    return NextResponse.json(
      { message: "Failed to delete project", error: String(error) },
      { status: 500 }
    );
  }
} 