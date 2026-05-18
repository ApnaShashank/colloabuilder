import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification";
import SystemBroadcast from "@/lib/models/SystemBroadcast";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Fetch user to get interaction history
    const user = await User.findById(session.userId).select("dismissedBroadcasts readBroadcasts");
    const dismissedIds = user?.dismissedBroadcasts?.map((id: any) => id.toString()) || [];
    const readIds = user?.readBroadcasts?.map((id: any) => id.toString()) || [];

    // Fetch personal notifications
    const userNotifications = await Notification.find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .limit(30);

    // Fetch active system-wide broadcasts (excluding dismissed ones)
    const broadcasts = await SystemBroadcast.find({ 
      active: true,
      _id: { $nin: dismissedIds }
    })
      .sort({ createdAt: -1 })
      .limit(10);

    // Map broadcasts to notification-like objects for the UI
    const mappedBroadcasts = broadcasts.map(b => ({
      _id: b._id,
      title: `[ANNOUNCEMENT] ${b.title}`,
      desc: b.content,
      type: b.type.toLowerCase(),
      read: readIds.includes(b._id.toString()),
      createdAt: b.createdAt,
      isBroadcast: true
    }));

    // Combine and sort by date
    const combined = [...mappedBroadcasts, ...userNotifications].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ success: true, notifications: combined });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { notificationId, markAll, isBroadcast } = await req.json();
    await connectDB();

    if (markAll) {
      // Mark all personal ones as read
      await Notification.updateMany({ userId: session.userId }, { read: true });
      
      // For mark all read, we combine all active broadcasts into readBroadcasts
      const activeBroadcasts = await SystemBroadcast.find({ active: true }).select("_id");
      await User.findByIdAndUpdate(session.userId, {
        $addToSet: { readBroadcasts: { $each: activeBroadcasts.map(b => b._id) } }
      });
    } else if (notificationId) {
      if (isBroadcast) {
        await User.findByIdAndUpdate(session.userId, {
          $addToSet: { readBroadcasts: notificationId }
        });
      } else {
        await Notification.findOneAndUpdate(
          { _id: notificationId, userId: session.userId },
          { read: true }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const isBroadcast = searchParams.get("isBroadcast") === "true";

    await connectDB();

    if (isBroadcast) {
      // Add to user's dismissed list
      await User.findByIdAndUpdate(session.userId, {
        $addToSet: { dismissedBroadcasts: id }
      });
    } else {
      // Delete personal notification
      await Notification.findOneAndDelete({ _id: id, userId: session.userId });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
