import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get("difficulty");
    const tag = searchParams.get("tag");

    const query: { difficulty?: string; tags?: string } = {};
    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = tag;

    const problems = await Problem.find(query).sort({ difficultyRank: 1, order: 1, createdAt: 1 });
    return NextResponse.json({ problems });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
