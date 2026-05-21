import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import crypto from "crypto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/login?error=google_denied`);
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: `${siteUrl}/api/auth/oauth/google/callback`,
      }),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${siteUrl}/login?error=google_token`);
    }

    const googleUserRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await googleUserRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${siteUrl}/login?error=no_email`);
    }

    await connectDB();

    let user = await User.findOne({ email: googleUser.email });
    if (!user) {
      // Create new user
      user = new User({
        name: googleUser.name || googleUser.given_name || "User",
        email: googleUser.email,
        username: (googleUser.given_name || "user").toLowerCase() + "_" + crypto.randomBytes(2).toString("hex"),
        password: crypto.randomBytes(16).toString("hex"), // Random secure password
        avatar: googleUser.picture || "",
      });
      await user.save();
    } else {
      if (!user.avatar && googleUser.picture) {
        user.avatar = googleUser.picture;
        await user.save();
      }
    }

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    });
    await setAuthCookie(token);

    return NextResponse.redirect(`${siteUrl}/login?token=${token}`);
  } catch (err) {
    console.error("[Google OAuth Callback Error]", err);
    return NextResponse.redirect(`${siteUrl}/login?error=google_server_error`);
  }
}
