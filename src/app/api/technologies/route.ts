import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(technologies);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch technologies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, url } = await request.json();
    
    const technology = await prisma.technology.create({
      data: {
        name,
        url
      }
    });
    
    return NextResponse.json(technology);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create technology" },
      { status: 500 }
    );
  }
}
