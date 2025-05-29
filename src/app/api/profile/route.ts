import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      include: {
        skills: true,
        socialLinks: true,
        education: true,
        experience: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; role: string };

    // Check if user is admin
    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Update or create profile
    const profile = await prisma.profile.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        title: data.title,
        bio: data.bio,
        avatar: data.avatar,
        email: data.email,
        location: data.location,
        skills: {
          deleteMany: {},
          create: data.skills
        },
        socialLinks: {
          deleteMany: {},
          create: data.socialLinks
        },
        education: {
          deleteMany: {},
          create: data.education
        },
        experience: {
          deleteMany: {},
          create: data.experience
        }
      },
      create: {
        id: data.id,
        name: data.name,
        title: data.title,
        bio: data.bio,
        avatar: data.avatar,
        email: data.email,
        location: data.location,
        skills: {
          create: data.skills
        },
        socialLinks: {
          create: data.socialLinks
        },
        education: {
          create: data.education
        },
        experience: {
          create: data.experience
        }
      },
      include: {
        skills: true,
        socialLinks: true,
        education: true,
        experience: true,
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
} 