import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lesson from "@/lib/models/Lesson";
import User from "@/lib/models/User";
import SystemConfig from "@/lib/models/SystemConfig";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const topic = searchParams.get("topic");

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    // Get dynamic paywall settings
    let config = await SystemConfig.findOne({ key: "main_config" });
    if (!config) {
      config = { proCategories: ["nextjs", "tailwind"] };
    }

    const isProCategory = config.proCategories?.some(
      (cat: string) => cat.toLowerCase() === category.toLowerCase()
    );

    // If a specific topic is requested
    if (topic) {
      if (isProCategory) {
        const session = await getSession();
        if (!session) {
          return NextResponse.json({ error: "pro_required" }, { status: 403 });
        }

        const user = await User.findById(session.userId);
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const ADMIN_EMAIL = "shashank8808108802@gmail.com";
        const isTargetAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        const isAdmin = user.isAdmin || isTargetAdmin;

        if (!isAdmin && user.plan !== "pro") {
          return NextResponse.json({ error: "pro_required" }, { status: 403 });
        }
      }

      const lesson = await Lesson.findOne({ category, topic });
      if (!lesson) {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
      }
      return NextResponse.json({ lesson });
    }

    // Otherwise, return all lessons in that category (titles and slugs for sidebar)
    const lessons = await Lesson.find({ category }).sort({ order: 1 }).select("title topic order");
    
    return NextResponse.json({ lessons, isPro: isProCategory });
  } catch (error) {
    console.error("Lessons API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
