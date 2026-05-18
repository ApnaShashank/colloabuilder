import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    await connectDB();

    const query = session 
      ? { $or: [{ isPublic: true }, { contributors: session.userId }] }
      : { isPublic: true };

    const projects = await Project.find(query).sort({ updatedAt: -1 });
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description, language, isPublic } = await req.json();

    let defaultFiles: Record<string, string> = {};
    if (language === "React" || language === "TypeScript") {
      defaultFiles = {
        "app/page.tsx": `"use client";\nimport React, { useState } from 'react';\n\nexport default function Home() {\n  const [count, setCount] = useState(0);\n  return (\n    <div className="flex flex-col items-center justify-center p-8 text-white min-h-[300px]">\n      <h1 className="text-xl font-black uppercase tracking-wider text-cyan-400">React Workspace</h1>\n      <p className="text-neutral-500 text-xs mt-2">Active count: {count}</p>\n      <button onClick={() => setCount(count + 1)} className="mt-4 px-4 py-2 bg-white text-black font-bold text-xs rounded-lg hover:bg-neutral-200 uppercase tracking-widest">Increment</button>\n    </div>\n  );\n}`,
        "app/layout.tsx": `import React from 'react';\n\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <div className="min-h-screen bg-black text-white">{children}</div>\n  );\n}`,
        "package.json": `{\n  "name": "colloabuilder-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}`
      };
    } else if (language === "HTML/CSS") {
      defaultFiles = {
        "index.html": `<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-h-screen; background: #000; color: #fff; font-family: sans-serif;">\n  <h1 style="text-transform: uppercase; letter-spacing: 0.1em; color: #10b981;">HTML Workspace</h1>\n  <p>Modify index.html or style.css to begin building.</p>\n</body>\n</html>`,
        "style.css": `body {\n  margin: 0;\n  background: #000;\n  color: #fff;\n}`
      };
    } else {
      defaultFiles = {
        "src/index.js": `console.log("Hello from JavaScript workspace!");\n\nconst greet = (user) => {\n  return \`Welcome to Colloabuilder, \${user}!\`;\n};\n\nconsole.log(greet("Developer"));`,
        "package.json": `{\n  "name": "js-workspace",\n  "version": "1.0.0"\n}`,
        "README.md": `# JavaScript Project\n\nModify src/index.js and click Run to test.`
      };
    }

    await connectDB();
    const project = new Project({
      name,
      description,
      language,
      isPublic,
      contributors: [session.userId],
      files: defaultFiles
    });

    await project.save();

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
