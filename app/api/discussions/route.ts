import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Discussion from "@/lib/models/Discussion";
import { getSession } from "@/lib/auth";
import User from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const problemId = searchParams.get("problemId");

    if (!problemId) {
      return NextResponse.json({ error: "problemId is required" }, { status: 400 });
    }

    await connectDB();
    const discussions = await Discussion.find({ problemId })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ discussions });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { problemId, content } = await req.json();

    await connectDB();
    const user = await User.findById(session.userId);
    
    const discussion = await Discussion.create({
      problemId,
      userId: session.userId,
      userName: user?.name || "Anonymous",
      userAvatar: user?.avatar,
      content,
    });

    return NextResponse.json({ discussion });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
