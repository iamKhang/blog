import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log('Fetching project with slug:', slug);

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

    // Transform the project data to include counts and user interaction status
    const viewedBy = project.viewedBy || [];
    const likedBy = project.likedBy || [];

    const transformedProject = {
      ...project,
      views: viewedBy.length,
      likes: likedBy.length,
      isLikedByUser: userId ? likedBy.includes(userId) : false,
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