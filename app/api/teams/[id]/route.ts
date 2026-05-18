import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Team from "@/lib/models/Team";
import { getSession } from "@/lib/auth";

// Standard Next.js API Route Handler for [id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    // Handling both Promise and Sync params for cross-version compatibility
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;
    
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const team = await Team.findById(id);
    
    if (!team) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    // Checking ownership (flexible for different field names)
    const ownerId = team.ownerId || team.owner;
    if (ownerId?.toString() !== session.userId) {
      return NextResponse.json({ error: "Access Denied: Only the owner can delete this team" }, { status: 403 });
    }

    await Team.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Unit successfully decommissioned" });
  } catch (error: any) {
    console.error("DELETE API ERROR:", error);
    return NextResponse.json({ 
      error: "Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;
    await connectDB();
    const team = await Team.findById(id).populate("members.userId", "name avatar");
    if (!team) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    return NextResponse.json({ success: true, team });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;
    const { name } = await req.json();
    
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const team = await Team.findById(id);
    if (!team) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    const ownerId = team.ownerId || team.owner;
    if (ownerId?.toString() !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    team.name = name;
    await team.save();

    return NextResponse.json({ success: true, team });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
