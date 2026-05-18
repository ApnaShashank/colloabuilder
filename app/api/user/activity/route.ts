import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserActivity from "@/lib/models/UserActivity";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const activity = await UserActivity.find({ userId: session.userId }).sort({ date: 1 });

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error("Activity GET error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { actionType, details, points = 1 } = await req.json();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    await connectDB();

    // Upsert activity for today
    const activity = await UserActivity.findOneAndUpdate(
      { userId: session.userId, date: today, actionType: actionType || "General" },
      { 
        $inc: { points: points },
        $set: { details: details || "" }
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error("Activity POST error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
