import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await connectDB();
    const email = "shashank8808108802@gmail.com";
    
    const user = await User.findOneAndUpdate(
      { email },
      { isAdmin: true },
      { new: true }
    );

    if (user) {
      return NextResponse.json({ 
        message: `Success! ${email} is now an admin.`,
        user: { email: user.email, isAdmin: user.isAdmin }
      });
    } else {
      return NextResponse.json({ 
        error: "User not found. Please make sure you have signed up with this email first." 
      }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
