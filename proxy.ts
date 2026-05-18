import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "colloa-secret-key-123"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public and protected paths
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password");
  const isDashboardPage = pathname.startsWith("/dashboard");

  const token = request.cookies.get("auth_token")?.value;

  // 1. If trying to access dashboard without token
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. If trying to access auth pages with a valid token
  if (isAuthPage && token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (err) {
      // Invalid token, allow access to auth pages but delete the cookie
      const response = NextResponse.next();
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // 3. For dashboard pages, verify the token
  if (isDashboardPage && token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      // Invalid token, redirect to login and clear cookie
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/forgot-password"],
};
