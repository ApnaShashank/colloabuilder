import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Problem from "@/lib/models/Problem";
import Team from "@/lib/models/Team";
import Project from "@/lib/models/Project";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) return NextResponse.json({ results: [] });

    await connectDB();
    const regex = new RegExp(q, "i");

    const [users, problems, teams, projects] = await Promise.all([
      User.find({ $or: [{ name: regex }, { username: regex }] }).limit(5).select("name username avatar level"),
      Problem.find({ title: regex }).limit(5).select("title difficulty tags"),
      Team.find({ name: regex }).limit(5).select("name description isPublic"),
      Project.find({ name: regex }).limit(5).select("name language isPublic stars"),
    ]);

    const results = [
      ...users.map(u => ({ ...u.toObject(), type: "User" })),
      ...problems.map(p => ({ ...p.toObject(), type: "Problem" })),
      ...teams.map(t => ({ ...t.toObject(), type: "Team" })),
      ...projects.map(p => ({ ...p.toObject(), type: "Project" })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
