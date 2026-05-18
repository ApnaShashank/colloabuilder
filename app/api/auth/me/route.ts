import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const start = Date.now();
  console.log("[API /api/auth/me] GET Request started");

  try {
    const authHeader = req.headers.get("authorization");
    let token = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
      console.log("[API /api/auth/me] Found token in Authorization header");
    }

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("auth_token")?.value;
      if (token) console.log("[API /api/auth/me] Found token in Cookie");
    }

    if (!token) {
      console.warn("[API /api/auth/me] No token found in header or cookies");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      console.warn("[API /api/auth/me] Invalid or expired token");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.userId).select("-password");
    
    if (!user) {
      console.warn(`[API /api/auth/me] User not found for ID: ${payload.userId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Special check for admin
    const ADMIN_EMAIL = "shashank8808108802@gmail.com";
    if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && !user.isAdmin) {
      await User.updateOne({ _id: user._id }, { $set: { isAdmin: true } });
      user.isAdmin = true;
    }

    console.log(`[API /api/auth/me] Success: User ${user.email} authenticated`);
    return NextResponse.json({ user: user.toObject() });
  } catch (error) {
    console.error("[API /api/auth/me] Fatal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
