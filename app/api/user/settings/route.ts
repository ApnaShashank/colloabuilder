import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    await connectDB();

    if (action === "updatePassword") {
      const { currentPassword, newPassword } = body;
      const user = await User.findById(session.userId);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return NextResponse.json({ success: true, message: "Password updated successfully" });
    } 
    
    if (action === "updateSettings") {
      const { notifications, privacyPrefs } = body;
      const user = await User.findByIdAndUpdate(
        session.userId,
        {
          $set: {
            notifications,
            privacyPrefs
          }
        },
        { new: true }
      );
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json({ success: true, notifications: user.notifications, privacyPrefs: user.privacyPrefs });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Settings update error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
