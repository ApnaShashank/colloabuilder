import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get count of unique problems solved by the user
    // We use distinct to only count each problem once even if submitted multiple times
    const solvedProblemIds = await Submission.distinct("problemId", {
      userId: session.userId,
      status: "Accepted",
    });

    const totalSubmissions = await Submission.countDocuments({
      userId: session.userId,
    });

    const acceptedSubmissions = await Submission.countDocuments({
      userId: session.userId,
      status: "Accepted",
    });

    // Calculate accuracy globally for this user
    const accuracy = totalSubmissions > 0 
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100) 
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        solvedCount: solvedProblemIds.length,
        totalSubmissions,
        accuracy,
      },
    });
  } catch (error) {
    console.error("Failed to fetch user practice stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
