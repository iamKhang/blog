import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface Props {
  params: {
    slug: string;
  };
}

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export async function POST(request: Request, { params }: Props) {
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

    // Tìm bài viết
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true, likedBy: true }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Đảm bảo likedBy là array hợp lệ
    const currentLikedBy = post.likedBy || [];
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

    const updatedPost = await prisma.post.update({
      where: { id: post.id },
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
      likesCount: updatedPost.likedBy.length
    });
  } catch (error) {
    console.error("[POST_LIKE]", error);
    return NextResponse.json(
      { error: "Failed to update like status" },
      { status: 500 }
    );
  }
}
