import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amount, reason } = await req.json();
    if (!amount || typeof amount !== "number") {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.userId);
    
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    user.xp += amount;
    // Level up logic: Level = Floor(XP / 1000) + 1
    const newLevel = Math.floor(user.xp / 1000) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
    }
    
    await user.save();

    // Record Activity for Heatmap
    try {
      const UserActivity = (await import("@/lib/models/UserActivity")).default;
      const today = new Date().toISOString().split("T")[0];
      await UserActivity.findOneAndUpdate(
        { userId: session.userId, date: today, actionType: reason || "General" },
        { $inc: { points: amount } },
        { upsert: true, new: true }
      );
    } catch (e) {
      console.error("Activity recording failed:", e);
    }

    return NextResponse.json({ 
      success: true, 
      xp: user.xp, 
      level: user.level,
      added: amount,
      reason 
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
