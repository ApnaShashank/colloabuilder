import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Team from "@/lib/models/Team";
import { getSession, checkAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const teams = await Team.find()
      .populate("members.userId", "username name email")
      .sort({ createdAt: -1 });

    const formattedTeams = teams.map(t => {
      const leadMember = t.members.find((m: any) => m.role === "Lead");
      return {
        _id: t._id,
        name: t.name,
        leader: leadMember ? (leadMember.userId as any).username || (leadMember.userId as any).name : "No Lead",
        members: t.members.length,
        type: t.isPublic ? "Public" : "Private",
        privacy: t.isPublic ? "Unlocked" : "Locked",
        createdAt: t.createdAt
      };
    });

    return NextResponse.json(formattedTeams);
  } catch (error) {
    console.error("Admin Teams API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
