import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import { getSession } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({ success: true, project });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Check if user is contributor
    const isContributor = project.contributors.some((c: any) => c.toString() === session.userId);
    if (!isContributor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();
    
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const isContributor = project.contributors.some((c: any) => c.toString() === session.userId);
    if (!isContributor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (body.files) {
      project.files = body.files;
      project.markModified("files");
      delete body.files;
    }
    for (const key of Object.keys(body)) {
      project.set(key, body[key]);
    }

    const updatedProject = await project.save();
    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error: any) {
    console.error("PATCH SAVE ERROR:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
