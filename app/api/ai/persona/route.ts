import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { persona } = await req.json();
    await connectDB();

    await User.findByIdAndUpdate(session.userId, { aiPersona: persona });

    return NextResponse.json({ success: true, message: "AI Persona updated" });
  } catch (error) {
    console.error("AI Persona API Error:", error);
    return NextResponse.json({ error: "Failed to update AI Persona" }, { status: 500 });
  }
}
