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
    console.log('Authorization header:', authHeader);

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No valid authorization header');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token
    const token = authHeader.split(' ')[1];
    console.log('Token extracted:', token ? 'Present' : 'Missing');

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; role: string };
    console.log('Token decoded:', { email: decoded.email, role: decoded.role });

    // Check if user is admin
    if (decoded.role !== "ADMIN") {
      console.log('User is not admin:', decoded.role);
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const data = await request.json();
    console.log('Profile update data received:', { id: data.id, name: data.name });

    // Update or create profile
    console.log('Attempting to upsert profile with ID:', data.id);

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

    console.log('Profile upserted successfully:', profile.id);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('JWT error:', error.message);
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update profile", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}