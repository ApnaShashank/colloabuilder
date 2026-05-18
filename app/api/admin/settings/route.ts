import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/auth";
import connectDB from "@/lib/db";
import SystemConfig from "@/lib/models/SystemConfig";

async function getOrCreateConfig() {
  await connectDB();
  let config = await SystemConfig.findOne({ key: "main_config" });
  if (!config) {
    config = await SystemConfig.create({ key: "main_config" });
  }
  return config;
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const config = await getOrCreateConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("GET admin settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const updates = await req.json();
    await connectDB();
    const config = await SystemConfig.findOneAndUpdate(
      { key: "main_config" },
      { $set: updates },
      { new: true, upsert: true }
    );
    return NextResponse.json(config);
  } catch (error) {
    console.error("PATCH admin settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
