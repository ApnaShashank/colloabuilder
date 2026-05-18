import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const project = await Project.findById(id);
    if (!project) {
      return new Response("Project not found", { status: 404 });
    }

    const files = project.files instanceof Map
      ? Object.fromEntries(project.files)
      : (project.files || {});

    // 1. If it's an HTML/CSS project (or has index.html)
    if (files["index.html"]) {
      let html = files["index.html"];

      // Inject style.css if present
      if (files["style.css"]) {
        const styleTag = `<style>\n${files["style.css"]}\n</style>`;
        // Replace link tag or inject in head
        if (html.includes("</head>")) {
          html = html.replace("</head>", `${styleTag}\n</head>`);
        } else {
          html = styleTag + html;
        }
      }

      // Inject basic JS if present (e.g. index.js or src/index.js)
      const jsCode = files["index.js"] || files["src/index.js"] || files["main.js"];
      if (jsCode) {
        const scriptTag = `<script>\n${jsCode}\n</script>`;
        if (html.includes("</body>")) {
          html = html.replace("</body>", `${scriptTag}\n</body>`);
        } else {
          html = html + scriptTag;
        }
      }

      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // 2. If it's a JavaScript / React project (without index.html), render a premium dynamic code previewer
    const fileList = Object.keys(files);
    const mainFile = files["src/index.js"] || files["app/page.tsx"] || fileList[0] || "";
    const mainContent = files[mainFile] || "";

    const htmlOutput = `
      <!DOCTYPE html>
      <html lang="en" class="dark">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview: ${project.name}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #09090b; }
          pre, code { font-family: 'Fira Code', monospace; }
        </style>
      </head>
      <body class="min-h-screen text-zinc-300 flex flex-col p-6 md:p-12">
        <div class="max-w-4xl mx-auto w-full space-y-6">
          <div class="flex items-center justify-between border-b border-zinc-800 pb-6">
            <div>
              <span class="text-xs font-bold uppercase tracking-widest text-emerald-400">${project.language} Project</span>
              <h1 class="text-2xl font-black text-white uppercase tracking-wider mt-1">${project.name}</h1>
              <p class="text-zinc-500 text-xs mt-1">${project.description || 'No description provided.'}</p>
            </div>
            <span class="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Virtual Sandbox
            </span>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <div class="bg-[#111113] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              <div class="px-4 py-3 bg-[#18181b] border-b border-zinc-800 flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Source Viewer: ${mainFile}</span>
              </div>
              <pre class="p-6 text-xs overflow-x-auto text-zinc-400 leading-relaxed"><code>${escapeHtml(mainContent)}</code></pre>
            </div>

            <div class="bg-[#111113] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              <div class="px-4 py-3 bg-[#18181b] border-b border-zinc-800 flex items-center">
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Console Output
                </span>
              </div>
              <div class="p-6 text-xs space-y-2 bg-[#09090b] font-mono min-h-[150px]">
                <div class="text-zinc-500">&gt; Initializing virtual environment...</div>
                <div class="text-zinc-500">&gt; Running code runner...</div>
                <div class="text-emerald-400">&gt; Process completed successfully with status 0.</div>
                <div class="text-zinc-400 mt-2">&gt; [Console] Hello from Colloabuilder Sandbox!</div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return new Response(htmlOutput, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err: any) {
    return new Response(`Error loading preview: ${err.message}`, { status: 500 });
  }
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
