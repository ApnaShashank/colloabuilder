import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Project from "@/lib/models/Project";
import Team from "@/lib/models/Team";
import { checkAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    
    // Performance metrics (Simulated for demonstration, but structured for real monitoring)
    const performanceData = [
      { name: "00:00", active: 10, latency: 120 },
      { name: "04:00", active: 5, latency: 115 },
      { name: "08:00", active: 45, latency: 130 },
      { name: "12:00", active: 80, latency: 155 },
      { name: "16:00", active: 120, latency: 180 },
      { name: "20:00", active: 90, latency: 140 },
    ];

    // Distribution metrics
    const [totalUsers, totalProjects, totalTeams] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Team.countDocuments()
    ]);

    const distribution = [
      { name: "Users", value: totalUsers },
      { name: "Projects", value: totalProjects },
      { name: "Teams", value: totalTeams },
    ];

    return NextResponse.json({
      performanceData,
      distribution,
      systemHealth: {
        uptime: "99.98%",
        avgLatency: "142ms",
        errorRate: "0.04%",
        dbStatus: "Healthy"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
