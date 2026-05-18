import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) return NextResponse.json({ error: "ImageKit configuration missing" }, { status: 500 });

    // 1. Prepare for ImageKit Upload
    const ikFormData = new FormData();
    ikFormData.append("file", file);
    ikFormData.append("fileName", `avatar-${session.userId}-${Date.now()}`);
    ikFormData.append("useUniqueFileName", "true");
    ikFormData.append("folder", "/profile-avatars");

    // 2. Upload to ImageKit via REST API (using Basic Auth)
    const authHeader = `Basic ${Buffer.from(privateKey + ":").toString("base64")}`;

    const ikRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: { "Authorization": authHeader },
      body: ikFormData,
    });

    const ikData = await ikRes.json();

    if (!ikRes.ok) {
      console.error("ImageKit Error:", ikData);
      return NextResponse.json({ 
        error: "ImageKit Upload Failed", 
        message: ikData.message || "Failed to upload to ImageKit"
      }, { status: 502 });
    }

    const imageUrl = ikData.url;

    // 3. Update User Profile in DB
    await connectDB();
    await User.findByIdAndUpdate(session.userId, { avatar: imageUrl });

    return NextResponse.json({ success: true, imageUrl });
  } catch (error: any) {
    console.error("ImageKit Upload Crash:", error);
    return NextResponse.json({ error: "Server Error", message: error.message }, { status: 500 });
  }
}
