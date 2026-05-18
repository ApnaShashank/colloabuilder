import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import { getSession } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const project = await Project.findById(id);

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Mocking Infrastructure Metrics for the Hackathon Demo
    // In a real app, this would fetch from Vercel/AWS/GCP APIs
    const now = new Date();
    const metrics = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getTime() - (11 - i) * 3600000); // last 12 hours
      const baseUsage = 20 + Math.random() * 40;
      const spike = i === 8 ? 60 : 0; // Simulate a spike at the 8th hour
      return {
        timestamp: date.toISOString(),
        cpu: baseUsage + spike,
        memory: 40 + Math.random() * 20,
        bandwidth: 100 + Math.random() * 200 + (spike * 10),
        cost: (baseUsage + spike) * 0.005 + (100 * 0.001)
      };
    });

    const totalCost = metrics.reduce((acc, m) => acc + m.cost, 0);
    const hasSpike = metrics.some(m => m.cpu > 75);

    // AI Suggestions based on metrics
    const suggestions = [
      { id: 1, title: "Enable Edge Caching", desc: "Your static assets are consuming 40% more bandwidth than expected. Enable edge caching to reduce costs.", impact: "High" },
      { id: 2, title: "Downscale DB Instance", desc: "Database CPU usage is consistently below 10%. Consider moving to a smaller instance.", impact: "Medium" },
      { id: 3, title: "Optimize Image Assets", desc: "Large images are increasing data egress. Use next/image for automatic optimization.", impact: "High" }
    ];

    return NextResponse.json({
      success: true,
      metrics,
      summary: {
        totalCost: totalCost.toFixed(2),
        currency: "USD",
        hasSpike,
        efficiencyScore: hasSpike ? 68 : 94
      },
      suggestions
    });
  } catch (error) {
    console.error("Metrics API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
