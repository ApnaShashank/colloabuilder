import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import Project from "@/lib/models/Project";
import Deployment from "@/lib/models/Deployment";

// GET /api/projects/[id]/deployments — list all deployments for a project
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const deployments = await Deployment.find({ projectId: id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("-logs") // Don't load logs in list view — too heavy
      .lean();

    return NextResponse.json({ success: true, deployments });
  } catch (err) {
    console.error("[GET /api/projects/[id]/deployments]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
