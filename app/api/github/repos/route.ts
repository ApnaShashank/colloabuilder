import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import User from "@/lib/models/User";

// GET /api/github/repos — list user's GitHub repositories
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById(session.userId);
    if (!user?.github?.isConnected || !user.github.accessToken) {
      return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });
    }

    const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: { Authorization: `Bearer ${user.github.accessToken}` },
    });
    const repos = await res.json();

    if (!Array.isArray(repos)) {
      return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
    }

    const formattedRepos = repos.map((repo: any) => ({
      id: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      branch: repo.default_branch,
      owner: repo.owner.login
    }));

    return NextResponse.json({ success: true, repos: formattedRepos });
  } catch (err) {
    console.error("[GET /api/github/repos]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
