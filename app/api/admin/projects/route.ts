import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Project from "@/lib/models/Project";
import { getSession, checkAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const projects = await Project.find()
      .populate("contributors", "username name email")
      .sort({ createdAt: -1 });

    const formattedProjects = projects.map(p => ({
      _id: p._id,
      title: p.name,
      description: p.description,
      owner: (p.contributors && p.contributors.length > 0) ? (p.contributors[0] as any).username || (p.contributors[0] as any).name : "Unknown",
      status: p.isPublic ? "Public" : "Private",
      createdAt: p.createdAt,
      stars: p.stars || 0
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error("Admin Projects API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
