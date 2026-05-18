import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { seedLessons } from "@/scripts/seed-lessons";
import { seedPracticeProblems } from "@/scripts/seed-practice-problems";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    
    await connectDB();
    
    // Seed lessons
    if (type === "lessons") {
      const result = await seedLessons();
      return NextResponse.json({ 
        message: "Lessons seeding successful", 
        result 
      });
    }
    
    // Seed problems (default)
    const result = await seedPracticeProblems();
    return NextResponse.json({ message: "Problems seeding successful", result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
