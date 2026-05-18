import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { getSession } from "@/lib/auth";
import Problem from "@/lib/models/Problem";
import SystemConfig from "@/lib/models/SystemConfig";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const problemId = searchParams.get("problemId");

    const query: any = { userId: session.userId };
    if (problemId) query.problemId = problemId;

    const submissions = await Submission.find(query)
      .populate("problemId", "title difficulty")
      .sort({ submittedAt: -1 });

    return NextResponse.json({ submissions });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { problemId, code, language } = await req.json();

    await connectDB();

    // Fetch the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const User = (await import("@/lib/models/User")).default;
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ADMIN_EMAIL = "shashank8808108802@gmail.com";
    const isTargetAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const isAdmin = user.isAdmin || isTargetAdmin;

    // Fetch dynamic limits from DB
    let config = await SystemConfig.findOne({ key: "main_config" });
    const maxFreeProblems = config?.maxFreePracticeProblems ?? 5;
    const proDifficulties = config?.proPracticeDifficulties ?? ["Hard"];

    if (!isAdmin && user.plan !== "pro") {
      // 1. Check Difficulty Paywall
      const isDifficultyPro = proDifficulties.some(
        (diff: string) => diff.toLowerCase() === problem.difficulty?.toLowerCase()
      );
      if (isDifficultyPro) {
        return NextResponse.json({
          error: "pro_required",
          message: `${problem.difficulty} challenges are Pro only. Upgrade to Pro to unlock premium challenges!`,
        }, { status: 403 });
      }

      // 2. Check Submission Limit Paywall
      if ((user.practiceCount || 0) >= maxFreeProblems) {
        return NextResponse.json({
          error: "pro_required",
          message: `You have reached your limit of ${maxFreeProblems} free practice submissions. Upgrade to Pro for unlimited submissions!`,
          practiceCount: user.practiceCount,
          maxFreeProblems
        }, { status: 403 });
      }

      // Increment practice submissions count
      user.practiceCount = (user.practiceCount || 0) + 1;
      await user.save();
    }

    // Mock evaluation for now
    const status = Math.random() > 0.3 ? "Accepted" : "Wrong Answer";
    const runtime = status === "Accepted" ? `${Math.floor(Math.random() * 100 + 20)}ms` : "—";
    const memory = status === "Accepted" ? `${(Math.random() * 5 + 40).toFixed(1)}MB` : "—";

    const submission = await Submission.create({
      userId: session.userId,
      problemId,
      code,
      language,
      status,
      runtime,
      memory,
      score: status === "Accepted" ? 100 : 0,
    });

    // Update User XP if Accepted
    if (status === "Accepted") {
      const User = (await import("@/lib/models/User")).default;
      const user = await User.findById(session.userId);
      if (user) {
        user.xp += 100;
        // Level up every 1000 XP
        const newLevel = Math.floor(user.xp / 1000) + 1;
        if (newLevel > user.level) {
          user.level = newLevel;
        }
        await user.save();

        // Record Activity for Heatmap
        try {
          const UserActivity = (await import("@/lib/models/UserActivity")).default;
          const today = new Date().toISOString().split("T")[0];
          await UserActivity.findOneAndUpdate(
            { userId: session.userId, date: today, actionType: "Problem Solved" },
            { $inc: { points: 100 } },
            { upsert: true, new: true }
          );
        } catch (e) {
          console.error("Activity recording failed:", e);
        }
      }
    }

    return NextResponse.json({ submission });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
