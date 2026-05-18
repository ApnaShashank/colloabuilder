import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import User from "@/lib/models/User";

// GET /api/auth/github/callback — GitHub redirects here after auth
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=github_denied`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${siteUrl}/api/auth/github/callback`,
      }),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=github_token`);
    }

    // Fetch GitHub user info
    const ghUserRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const ghUser = await ghUserRes.json();

    // Save token to the logged-in user's account
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(`${siteUrl}/login?error=unauthorized`);
    }

    await connectDB();
    await User.findByIdAndUpdate(session.userId, {
      "github.accessToken": tokenData.access_token,
      "github.username": ghUser.login,
      "github.avatarUrl": ghUser.avatar_url,
      "github.profileUrl": ghUser.html_url,
      "github.isConnected": true,
    });

    return NextResponse.redirect(`${siteUrl}/dashboard/settings?github=connected`);
  } catch (err) {
    console.error("[GitHub OAuth Callback]", err);
    return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=github_error`);
  }
}
