import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/auth-utils";

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
    // Verify admin authentication
    const authResult = await verifyAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    console.log('Token verified for user:', authResult.decoded.email);

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
    return NextResponse.json(
      { error: "Failed to update profile", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}