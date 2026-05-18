import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { role, skillLevel, interests, techStack, goal, githubUrl, portfolioUrl } = body;

    await connectDB();

    // Notification logic
    const Notification = (await import("@/lib/models/Notification")).default;
    await Notification.create({
      userId: session.userId,
      title: "Welcome to Colloabuilder",
      desc: "Your Nexus identity has been initialized. Start exploring projects and challenges to earn XP.",
      type: "success"
    });

    const user = await User.findByIdAndUpdate(
      session.userId,
      {
        role,
        skillLevel,
        interests,
        techStack,
        goal,
        githubUrl,
        portfolioUrl,
        onboarded: true,
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Onboarding completed",
      user: {
        id: user._id,
        onboarded: user.onboarded,
      },
    });

  } catch (error) {
    console.error("Onboarding error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
