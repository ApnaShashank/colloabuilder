import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Team from "@/lib/models/Team";
import { getSession } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action } = body; // "join" or "leave"

    await connectDB();

    const team = await Team.findById(id);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const isMember = team.members.some((m: any) => m.userId.toString() === session.userId);

    if (action === "join") {
      if (isMember) {
        return NextResponse.json({ error: "Already a member" }, { status: 400 });
      }
      team.members.push({ userId: session.userId, role: "Member" });
    } else if (action === "leave") {
      if (!isMember) {
        return NextResponse.json({ error: "Not a member" }, { status: 400 });
      }
      team.members = team.members.filter((m: any) => m.userId.toString() !== session.userId);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await team.save();
    
    // Repopulate for the response
    await team.populate("members.userId", "name username avatar");

    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error("Team join/leave error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
