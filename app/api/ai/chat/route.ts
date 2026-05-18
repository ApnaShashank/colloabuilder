import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/db';
import ChatMessage from '@/lib/models/ChatMessage';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, history } = await req.json();
    await connectDB();

    // Fetch user persona
    const user = await User.findById(session.userId);
    const aiPersona = user?.aiPersona || "";

    const customApiKey = req.headers.get("x-custom-api-key") || req.headers.get("X-Custom-API-Key");
    const apiKey = customApiKey || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key is not configured. Please add one in AI Settings." }, { status: 400 });
    }

    // Save user message to DB
    await ChatMessage.create({
      userId: session.userId,
      role: 'user',
      text: prompt,
    });

    // Format history for Groq
    const messages = [
      {
        role: "system",
        content: `You are a helpful and direct AI assistant. 
        Answer the user's questions as concisely as possible. 
        DO NOT engage in small talk. 
        DO NOT ask follow-up questions like "How's your project?" unless necessary.
        If the user says "hello", just say "Hello! How can I help you?".
        Provide code only when relevant and keep explanations brief and technical.`
      },
      ...(history ? history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      })) : [])
    ];

    messages.push({ role: 'user', content: prompt });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.6,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API error text:", errorText);
        throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    // Parse code if present
    const codeRegex = /```(?:[a-z]+)?\n([\s\S]*?)```/g;
    const matches = [...text.matchAll(codeRegex)];
    const code = matches.length > 0 ? matches[0][1].trim() : null;

    // Save AI response to DB
    await ChatMessage.create({
      userId: session.userId,
      role: 'ai',
      text: text.replace(codeRegex, '').trim(),
      code: code,
    });

    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
