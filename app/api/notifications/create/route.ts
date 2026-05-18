import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, desc, type } = await req.json();
    
    await connectDB();
    const notification = new Notification({
      userId: session.userId,
      title,
      desc,
      type: type || "info",
    });

    await notification.save();
    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
