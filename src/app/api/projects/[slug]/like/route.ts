import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Lấy thông tin user từ cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwtDecode<JWTPayload>(accessToken);
      userId = decoded.id;
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Tìm project
    const project = await prisma.project.findUnique({
      where: { slug },
      select: { id: true, likedBy: true }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Đảm bảo likedBy là array hợp lệ
    const currentLikedBy = project.likedBy || [];
    const isLiked = currentLikedBy.includes(userId);
    
    // Toggle like status
    let newLikedBy: string[];
    if (isLiked) {
      // Remove like
      newLikedBy = currentLikedBy.filter(id => id !== userId);
    } else {
      // Add like
      newLikedBy = [...currentLikedBy, userId];
    }
    
    // Đảm bảo không có undefined values
    newLikedBy = newLikedBy.filter(id => id !== undefined && id !== null && id !== '');

    // Validation cuối cùng trước khi update
    if (newLikedBy.some(id => !id || typeof id !== 'string')) {
      return NextResponse.json(
        { error: "Invalid user ID in like array" },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: {
        likedBy: newLikedBy
      },
      select: {
        likedBy: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      isLiked: !isLiked,
      likesCount: updatedProject.likedBy.length
    });
  } catch (error) {
    console.error("[POST_PROJECT_LIKE]", error);
    return NextResponse.json(
      { error: "Failed to update like status" },
      { status: 500 }
    );
  }
}
