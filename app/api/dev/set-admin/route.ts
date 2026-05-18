import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await connectDB();
    const ADMIN_EMAIL = "shashank8808108802@gmail.com";
    
    const user = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      { isAdmin: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `User ${ADMIN_EMAIL} is now admin.` });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
