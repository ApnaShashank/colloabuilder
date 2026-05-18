import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Roadmap from "@/lib/models/Roadmap";
import { getSession } from "@/lib/auth";


export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetRole, focusArea, additionalInfo } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API key is missing." }, { status: 500 });
    }

    const prompt = `You are an expert technical career coach. I want to become a ${targetRole} with a focus on ${focusArea}. 
${additionalInfo ? `Additional context: ${additionalInfo}` : ""}

Create a detailed, 4-step roadmap for me. Output the response ONLY as a raw JSON object. The JSON structure MUST match this exactly:
{
  "title": "Roadmap Title",
  "description": "Short inspirational description.",
  "level": "Beginner",
  "skills": ["Skill 1", "Skill 2"],
  "milestones": [
    {
      "id": "m1",
      "title": "Milestone 1 Title",
      "description": "What to learn here.",
      "resources": [
        {
          "title": "Resource Name",
          "url": "https://example.com/learn",
          "type": "Article"
        }
      ],
      "dailySchedule": [
        {
          "day": 1,
          "task": "Specific task for day 1",
          "hours": 2
        }
      ]
    }
  ]
}
RULES for "type": It MUST be exactly one of: "Video", "Article", "Course", "Documentation", "Tool". Do NOT use any other values.
For each milestone, generate a "dailySchedule" with at least 5 days. For each day, specify a clear "task" and the estimated "hours" (e.g., 2, 3).
Generate exactly 4 milestones, each with 2 resources. Use real, high-quality documentation or tutorial URLs.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText}`);
    }

    const aiData = await response.json();
    const aiText = aiData.choices[0].message.content.trim();
    
    // Attempt to parse the JSON
    let parsedData;
    try {
        parsedData = JSON.parse(aiText);
    } catch (e) {
        console.error("Failed to parse Groq output:", aiText);
        return NextResponse.json({ error: "AI generated invalid data." }, { status: 500 });
    }

    // Sanitize resource types to match Mongoose enum
    const validTypes = ["Video", "Article", "Course", "Documentation", "Tool"];
    if (parsedData.milestones) {
      parsedData.milestones = parsedData.milestones.map((m: any) => ({
        ...m,
        resources: (m.resources || []).map((r: any) => ({
          ...r,
          type: validTypes.includes(r.type) ? r.type : "Article"
        }))
      }));
    }

    await connectDB();

    const newRoadmap = new Roadmap({
      userId: session.userId,
      title: parsedData.title,
      description: parsedData.description,
      level: parsedData.level,
      skills: parsedData.skills || [],
      milestones: parsedData.milestones || []
    });

    await newRoadmap.save();

    return NextResponse.json({ success: true, roadmap: newRoadmap });
  } catch (error) {
    console.error("Roadmap generation error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
