import { NextResponse } from "next/server";

// GET /api/auth/github — redirect user to GitHub OAuth
export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/github/callback`;

  if (!clientId || clientId === "YOUR_GITHUB_CLIENT_ID") {
    return NextResponse.json({ error: "GitHub OAuth not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo read:user user:email",
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
