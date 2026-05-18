import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userObj = user.toObject();
    return NextResponse.json({
      success: true,
      user: {
        id: userObj._id,
        name: userObj.name,
        email: userObj.email,
        username: userObj.username,
        role: userObj.role,
        bio: userObj.bio,
        avatar: userObj.avatar,
        githubUrl: userObj.githubUrl,
        linkedinUrl: userObj.linkedinUrl,
        portfolioUrl: userObj.portfolioUrl,
        customLinks: userObj.customLinks || [],
        techStack: userObj.techStack || [],
        level: userObj.level,
        xp: userObj.xp,
        onboarded: userObj.onboarded
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, username, bio, githubUrl, portfolioUrl, linkedinUrl, role, techStack, customLinks } = body;

    await connectDB();

    const updateData: any = {
      name,
      bio,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      role,
      techStack,
      customLinks
    };

    if (username) {
      updateData.username = username.toLowerCase().replace(/\s/g, "");
    }

    const user = await User.findByIdAndUpdate(
      session.userId,
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userObj = user.toObject();
    return NextResponse.json({
      success: true,
      user: {
        id: userObj._id,
        name: userObj.name,
        email: userObj.email,
        username: userObj.username,
        role: userObj.role,
        bio: userObj.bio,
        githubUrl: userObj.githubUrl,
        linkedinUrl: userObj.linkedinUrl,
        portfolioUrl: userObj.portfolioUrl,
        customLinks: userObj.customLinks,
        techStack: userObj.techStack
      },
    });

  } catch (error) {
    console.error("Profile update error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
