import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Team from "@/lib/models/Team";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    await connectDB();

    // Fetch public teams + teams user is a member of
    const query = session 
      ? { $or: [{ isPublic: true }, { "members.userId": session.userId }] }
      : { isPublic: true };

    const teams = await Team.find(query)
      .populate("members.userId", "name avatar")
      .populate("ownerId", "name avatar");
    return NextResponse.json({ success: true, teams });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, description, isPublic, category } = body;

    await connectDB();
    const team = await Team.create({
      name,
      description,
      isPublic,
      category: category || "General",
      ownerId: session.userId,
      members: [{ userId: session.userId, role: "Lead" }],
    });

    return NextResponse.json({ success: true, team });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
