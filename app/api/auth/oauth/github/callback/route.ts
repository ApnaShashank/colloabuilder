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
    return NextResponse.redirect(`${siteUrl}/login?error=github_denied`);
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${siteUrl}/api/auth/oauth/github/callback`,
      }),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${siteUrl}/login?error=github_token`);
    }

    const ghUserRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const ghUser = await ghUserRes.json();

    const ghEmailRes = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const ghEmails = await ghEmailRes.json();
    const primaryEmail = ghEmails.find((e: any) => e.primary)?.email || ghEmails[0]?.email;

    if (!primaryEmail) {
      return NextResponse.redirect(`${siteUrl}/login?error=no_email`);
    }

    await connectDB();

    let user = await User.findOne({ email: primaryEmail });
    if (!user) {
      user = new User({
        name: ghUser.name || ghUser.login,
        email: primaryEmail,
        username: ghUser.login + "_" + crypto.randomBytes(2).toString("hex"),
        password: crypto.randomBytes(16).toString("hex"),
        avatar: ghUser.avatar_url,
        github: {
          accessToken: tokenData.access_token,
          username: ghUser.login,
          avatarUrl: ghUser.avatar_url,
          profileUrl: ghUser.html_url,
          isConnected: true,
        }
      });
      await user.save();
    } else {
      user.github = {
        accessToken: tokenData.access_token,
        username: ghUser.login,
        avatarUrl: ghUser.avatar_url,
        profileUrl: ghUser.html_url,
        isConnected: true,
      };
      if (!user.avatar) user.avatar = ghUser.avatar_url;
      await user.save();
    }

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    });
    await setAuthCookie(token);

    return NextResponse.redirect(`${siteUrl}/login?token=${token}`);
  } catch (err) {
    console.error("[GitHub OAuth Callback Error]", err);
    return NextResponse.redirect(`${siteUrl}/login?error=github_server_error`);
  }
}
