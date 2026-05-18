import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import Project from "@/lib/models/Project";

// GET /api/projects/[id]/github — get GitHub connection status
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const project = await Project.findById(id).select("github deploy deployStatus deployUrl").lean();
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, project });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/projects/[id]/github — connect or update GitHub repository
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const {
      repoUrl,
      repoName,
      repoOwner,
      defaultBranch = "main",
      deployBranch = "main",
      buildCommand = "npm run build",
      installCommand = "npm install",
      outputDir = ".next",
      framework = "nextjs",
      autoDeploy = true,
    } = body;

    if (!repoUrl) {
      return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });
    }

    await Project.findByIdAndUpdate(id, {
      "github.repoUrl": repoUrl,
      "github.repoName": repoName || repoUrl.split("/").pop(),
      "github.repoId": body.repoId || "", // New field
      "github.repoOwner": repoOwner || "",
      "github.defaultBranch": defaultBranch,
      "github.deployBranch": deployBranch,
      "github.isConnected": true,
      "deploy.buildCommand": buildCommand,
      "deploy.installCommand": installCommand,
      "deploy.outputDir": outputDir,
      "deploy.framework": framework,
      "deploy.autoDeploy": autoDeploy,
    });

    return NextResponse.json({ success: true, message: "GitHub repository connected." });
  } catch (err) {
    console.error("[POST /api/projects/[id]/github]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/projects/[id]/github — disconnect GitHub
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await Project.findByIdAndUpdate(id, {
      "github.isConnected": false,
      "github.repoUrl": "",
      "github.repoName": "",
      "github.repoOwner": "",
    });

    return NextResponse.json({ success: true, message: "GitHub disconnected." });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
