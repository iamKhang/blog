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
    
    // Lấy thông tin user từ cookie (nếu có)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    
    let userId: string | null = null;
    
    if (accessToken) {
      try {
        const decoded = jwtDecode<JWTPayload>(accessToken);
        userId = decoded.id;
      } catch (error) {
        console.log('Invalid token, treating as anonymous view');
      }
    }

    // Tìm project
    const project = await prisma.project.findUnique({
      where: { slug },
      select: { id: true, viewedBy: true }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Đảm bảo viewedBy là array hợp lệ
    const currentViewedBy = project.viewedBy || [];
    
    // Nếu có userId và chưa xem project này
    if (userId && !currentViewedBy.includes(userId)) {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          viewedBy: [...currentViewedBy, userId]
        }
      });
    } else if (!userId) {
      // Đối với anonymous users, chúng ta sẽ luôn tăng view
      // Vì không thể track chính xác được duplicate views
      // Có thể cải thiện sau bằng cách sử dụng IP + User Agent
      const forwardedFor = request.headers.get('x-forwarded-for');
      const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
      const anonymousId = `anon_${ip.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
      
      await prisma.project.update({
        where: { id: project.id },
        data: {
          viewedBy: [...currentViewedBy, anonymousId]
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST_PROJECT_VIEW]", error);
    return NextResponse.json(
      { error: "Failed to update view count" },
      { status: 500 }
    );
  }
}
