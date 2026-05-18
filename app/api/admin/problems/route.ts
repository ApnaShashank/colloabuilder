import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";
import { checkAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const problems = await Problem.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, problems });
  } catch (error) {
    console.error("Fetch problems error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();
    
    const problem = await Problem.create({
      ...body,
      createdAt: new Date(),
      submissionsCount: 0,
      acceptedCount: 0
    });

    return NextResponse.json({ success: true, problem });
  } catch (error) {
    console.error("Create problem error:", error);
    return NextResponse.json({ error: "Bad Request - Schema Validation Failed" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { problemId, updates } = await req.json();
    if (!problemId) return NextResponse.json({ error: "ID Required" }, { status: 400 });

    await connectDB();
    const problem = await Problem.findByIdAndUpdate(
      problemId, 
      { $set: updates }, 
      { new: true, runValidators: true }
    );
    
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, problem });
  } catch (error) {
    console.error("Update problem error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const problemId = searchParams.get("id");
    
    if (!problemId) {
      return NextResponse.json({ error: "Problem ID required" }, { status: 400 });
    }

    await connectDB();
    await Problem.findByIdAndDelete(problemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete problem error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
