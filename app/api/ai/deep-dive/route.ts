import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { type, context, parentTopic } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API key missing" }, { status: 500 });
    }

    let prompt = "";
    if (type === "day-topics") {
      prompt = `You are an expert tutor. For a roadmap about "${context.targetRole}" focusing on "${context.focusArea}", 
      generate a list of 5 key topics to learn on Day ${context.day}. 
      Each topic should be concise and actionable.
      Output ONLY as a raw JSON array of strings: ["Topic 1", "Topic 2", ...]`;
    } else if (type === "sub-topics") {
      prompt = `You are an expert tutor. For the topic "${parentTopic}" in the context of "${context.targetRole}", 
      generate 4-5 detailed sub-topics or specific sub-concepts to master.
      Each sub-topic should be a short phrase.
      Output ONLY as a raw JSON array of strings: ["Sub-topic 1", "Sub-topic 2", ...]`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) throw new Error("AI API failed");

    const data = await response.json();
    const aiText = data.choices[0].message.content.trim();
    
    // AI might wrap in { "topics": [...] } or just the array. We forced json_object, so it's an object.
    const parsed = JSON.parse(aiText);
    const results = parsed.topics || parsed.results || Object.values(parsed)[0];

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Deep Dive Error:", error);
    return NextResponse.json({ error: "Failed to generate deep dive." }, { status: 500 });
  }
}
