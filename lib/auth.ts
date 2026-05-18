import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "colloa-secret-key-123";

export interface UserPayload {
  userId: string;
  email: string;
  username: string;
}

export async function signToken(payload: UserPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (_err) {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function getSession(): Promise<UserPayload | null> {
  // 1. Check Cookies
  const cookieStore = await cookies();
  let token = cookieStore.get("auth_token")?.value;

  // 2. Check Authorization Header if cookie is missing (Common in API calls)
  if (!token) {
    // We can't access headers easily in a shared getSession unless we pass them, 
    // but in Next.js 15 we can use headers() from next/headers
    const { headers } = await import("next/headers");
    const headerStore = await headers();
    const authHeader = headerStore.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}

export async function checkAdmin(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  const ADMIN_EMAIL = "shashank8808108802@gmail.com";
  if (session.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) return true;

  // Otherwise check the DB flag
  const user = await User.findById(session.userId);
  return user?.isAdmin || false;
}
