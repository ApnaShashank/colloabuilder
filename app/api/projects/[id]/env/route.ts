import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import Project from "@/lib/models/Project";

// GET /api/projects/[id]/env — list env vars (values masked)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const project = await Project.findById(id).select("envVars").lean() as any;
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Mask values for security — never expose raw secrets to frontend in list
    const masked = (project.envVars || []).map((v: any) => ({
      _id: v._id,
      key: v.key,
      value: v.value ? `${"*".repeat(Math.min(v.value.length, 12))}` : "",
      environment: v.environment,
    }));

    return NextResponse.json({ success: true, envVars: masked });
  } catch (err) {
    console.error("[GET /api/projects/[id]/env]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/projects/[id]/env — add a new env var
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { key, value, environment } = await request.json();

    if (!key || !value) {
      return NextResponse.json({ error: "key and value are required" }, { status: 400 });
    }

    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Prevent duplicate keys in same environment
    const existingIndex = project.envVars.findIndex(
      (v: any) => v.key === key && v.environment === (environment || "production")
    );
    if (existingIndex >= 0) {
      project.envVars[existingIndex].value = value;
    } else {
      project.envVars.push({ key, value, environment: environment || "production" });
    }

    await project.save();
    return NextResponse.json({ success: true, message: "Environment variable saved." });
  } catch (err) {
    console.error("[POST /api/projects/[id]/env]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/projects/[id]/env — remove an env var by key
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { envId } = await request.json();

    await Project.findByIdAndUpdate(id, {
      $pull: { envVars: { _id: envId } },
    });

    return NextResponse.json({ success: true, message: "Variable removed." });
  } catch (err) {
    console.error("[DELETE /api/projects/[id]/env]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
