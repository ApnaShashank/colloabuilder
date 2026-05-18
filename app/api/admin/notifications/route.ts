import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SystemBroadcast from "@/lib/models/SystemBroadcast";
import { getSession, checkAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const broadcasts = await SystemBroadcast.find().sort({ createdAt: -1 });
    return NextResponse.json({ broadcasts });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const session = await getSession();
    const { title, content, type, priority } = await req.json();
    
    await connectDB();
    const broadcast = new SystemBroadcast({
      title,
      content,
      type,
      priority,
      author: session?.userId
    });

    await broadcast.save();
    return NextResponse.json({ broadcast });
  } catch (error) {
    console.error("Broadcast Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await connectDB();
    await SystemBroadcast.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
