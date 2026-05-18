import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Team from "@/lib/models/Team";
import Problem from "@/lib/models/Problem";

export async function GET() {
  try {
    await connectDB();

    const [totalUsers, totalTeams, totalProblems] = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Problem.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      metrics: {
        totalUsers,
        totalTeams,
        totalProblems,
      },
    });
  } catch (error) {
    console.error("Failed to fetch global metrics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
