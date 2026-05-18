import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await getSession();

    // Fetch top 10 users by XP (excluding admins)
    const topUsers = await User.find({ isAdmin: { $ne: true } })
      .sort({ xp: -1 })
      .limit(10)
      .select("name username role xp level avatar");

    let currentUserRank = null;
    let currentUserStats = null;

    if (session) {
      // Find current user stats
      currentUserStats = await User.findById(session.userId).select("xp level");
      
      if (currentUserStats) {
        // Calculate rank: count users with more XP + 1 (excluding admins)
        currentUserRank = await User.countDocuments({ 
          xp: { $gt: currentUserStats.xp },
          isAdmin: { $ne: true }
        }) + 1;
      }
    }

    return NextResponse.json({
      success: true,
      topUsers,
      currentUserRank,
      currentUserStats
    });
  } catch (error) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
