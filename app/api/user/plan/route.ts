import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    if (plan !== "free" && plan !== "pro") {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      session.userId,
      { $set: { plan } },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, plan: user.plan, user });
  } catch (error) {
    console.error("Plan update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
