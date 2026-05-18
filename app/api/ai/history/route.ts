import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/db';
import ChatMessage from '@/lib/models/ChatMessage';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const messages = await ChatMessage.find({ userId: session.userId })
      .sort({ timestamp: 1 })
      .limit(100);
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("AI History GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await req.json();
    await connectDB();
    await ChatMessage.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("AI History DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete history" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id, newText } = await req.json();
    await connectDB();
    await ChatMessage.findByIdAndUpdate(id, { text: newText });
    return NextResponse.json({ success: true, message: "Message renamed" });
  } catch (error) {
    console.error("AI History PATCH Error:", error);
    return NextResponse.json({ error: "Failed to rename history" }, { status: 500 });
  }
}
