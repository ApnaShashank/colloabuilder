import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import Deployment from "@/lib/models/Deployment";
import Project from "@/lib/models/Project";

// GET /api/deploy/[deploymentId] — fetch a single deployment with logs
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ deploymentId: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { deploymentId } = await params;
    const deployment = await Deployment.findById(deploymentId).lean();
    if (!deployment) {
      return NextResponse.json({ error: "Deployment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deployment });
  } catch (err) {
    console.error("[GET /api/deploy/[deploymentId]]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/deploy/[deploymentId] — rollback to this deployment
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ deploymentId: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { deploymentId } = await params;
    const original = await Deployment.findById(deploymentId);
    if (!original) {
      return NextResponse.json({ error: "Deployment not found" }, { status: 404 });
    }

    const project = await Project.findById(original.projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Count deployments for version number
    const count = await Deployment.countDocuments({ projectId: original.projectId });

    // Create a new rollback deployment record
    const rollback = await Deployment.create({
      projectId: original.projectId,
      userId: session.userId,
      version: count + 1,
      branch: original.branch,
      commitHash: original.commitHash,
      commitMessage: `Rollback to v${original.version}: ${original.commitMessage}`,
      status: "queued",
      triggeredBy: "rollback",
      logs: [
        {
          level: "info",
          message: `🔄 Rolling back to version ${original.version}...`,
          timestamp: new Date(),
        },
      ],
    });

    // Update project status
    await Project.findByIdAndUpdate(original.projectId, {
      deployStatus: "queued",
      currentDeploymentId: rollback._id,
    });

    // Simulate fast rollback (restoring cached build)
    setTimeout(async () => {
      await Deployment.findByIdAndUpdate(rollback._id, {
        status: "live",
        deployUrl: original.deployUrl,
        buildDuration: 5,
        finishedAt: new Date(),
        $push: {
          logs: {
            level: "success",
            message: "✅ Rollback complete. Previous version restored.",
            timestamp: new Date(),
          },
        },
      });
      await Project.findByIdAndUpdate(original.projectId, {
        deployStatus: "live",
        deployUrl: original.deployUrl,
      });
    }, 3000);

    return NextResponse.json({ success: true, rollback });
  } catch (err) {
    console.error("[POST /api/deploy/[deploymentId]]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
