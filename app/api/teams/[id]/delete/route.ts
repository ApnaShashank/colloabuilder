import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Team from "@/lib/models/Team";
import { getSession } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: any }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    
    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const team = await Team.findById(id);
    if (!team) return NextResponse.json({ error: "Unit not found" }, { status: 404 });

    const ownerId = team.ownerId || team.owner;
    if (ownerId?.toString() !== session.userId) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    await Team.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Unit decommissioned" });
  } catch (error: any) {
    console.error("Delete POST Error:", error);
    return NextResponse.json({ error: "Server Error", details: error.message }, { status: 500 });
  }
}
