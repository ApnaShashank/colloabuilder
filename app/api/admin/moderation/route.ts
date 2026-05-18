import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Report from "@/lib/models/Report";
import { checkAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const reports = await Report.find()
      .populate("reporter", "username name email")
      .sort({ createdAt: -1 });
    return NextResponse.json({ reports });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { reportId, updates } = await req.json();
    await connectDB();
    const report = await Report.findByIdAndUpdate(reportId, updates, { new: true });
    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
