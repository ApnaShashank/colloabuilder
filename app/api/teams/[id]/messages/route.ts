import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/lib/models/Message";
import Team from "@/lib/models/Team";
import { getSession } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const team = await Team.findById(id);
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    const isMember = team.members.some((m: any) => m.userId.toString() === session.userId);
    if (!team.isPublic && !isMember) return NextResponse.json({ error: "Not a member" }, { status: 403 });

    const messages = await Message.find({ teamId: id })
      .populate("senderId", "name avatar")
      .sort({ createdAt: 1 })
      .limit(100);

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("GET Messages Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { content } = body;
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const team = await Team.findById(id);
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    const isMember = team.members.some((m: any) => m.userId.toString() === session.userId);
    if (!team.isPublic && !isMember) return NextResponse.json({ error: "Not a member" }, { status: 403 });

    const message = await Message.create({
      teamId: id,
      senderId: session.userId,
      content: content.trim()
    });

    const populatedMessage = await Message.findById(message._id).populate("senderId", "name avatar");

    return NextResponse.json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error("POST Message Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
