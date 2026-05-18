import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Roadmap from "@/lib/models/Roadmap";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const roadmaps = await Roadmap.find({ userId: session.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, roadmaps });
  } catch (error) {
    console.error("Roadmap fetching error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
