import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

interface JWTPayload {
  email: string;
  role: string;
  exp: number;
}

export async function verifyAdminAuth(): Promise<{ success: true; decoded: JWTPayload } | { success: false; response: NextResponse }> {
  try {
    // Get token from cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    
    if (!accessToken) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      };
    }

    // Verify token
    const decoded = jwtDecode(accessToken) as JWTPayload;
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Token expired" },
          { status: 401 }
        )
      };
    }

    // Check if user is admin
    if (decoded.role !== "ADMIN") {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        )
      };
    }

    return { success: true, decoded };
  } catch (error) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    };
  }
} 