// @ts-nocheck
import { exec as execCb } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";
import Project from "../models/Project";

const exec = util.promisify(execCb);

export async function getNextAvailablePort(): Promise<number> {
  const projects = await Project.find({ assignedPort: { $exists: true } });
  const ports = projects.map(p => p.assignedPort as number);
  let port = 3001;
  while (ports.includes(port)) {
    port++;
  }
  return port;
}

export async function appendLog(projectId: string, message: string, sseClients: Map<string, any[]>) {
  await Project.findByIdAndUpdate(projectId, {
    $push: { logs: { message, timestamp: new Date() } }
  });
  
  const clients = sseClients.get(projectId) || [];
  clients.forEach(res => {
    res.write(`event: log\ndata: ${JSON.stringify({ message, timestamp: new Date() })}\n\n`);
  });
}

export async function updateStatus(projectId: string, status: string, sseClients: Map<string, any[]>) {
  await Project.findByIdAndUpdate(projectId, { deployStatus: status });
  const clients = sseClients.get(projectId) || [];
  clients.forEach(res => {
    res.write(`event: status\ndata: ${JSON.stringify({ status })}\n\n`);
  });
}

export async function handleDeployment(projectId: string, sseClients: Map<string, any[]>) {
  const project = await Project.findById(projectId);
  if (!project) return;

  const safeName = project.name.replace(/[^a-zA-Z0-9-_]/g, "").substring(0, 30);
  const workspaceRoot = path.resolve(__dirname, "../../workspaces");
  if (!fs.existsSync(workspaceRoot)) fs.mkdirSync(workspaceRoot);
  
  const outputDir = path.join(workspaceRoot, `${safeName}-${projectId}`);

  try {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    await updateStatus(projectId, "building", sseClients);
    await appendLog(projectId, "📦 Preparing static assets from snapshot...", sseClients);
    
    // Write code from DB to files
    fs.writeFileSync(path.join(outputDir, "index.html"), project.code?.html || "");
    fs.writeFileSync(path.join(outputDir, "style.css"), project.code?.css || "");
    fs.writeFileSync(path.join(outputDir, "script.js"), project.code?.js || "");

    // Generate Dockerfile
    const dockerfile = `FROM nginx:alpine\nCOPY . /usr/share/nginx/html\nEXPOSE 80`;
    fs.writeFileSync(path.join(outputDir, "Dockerfile"), dockerfile);

    const containerName = `cb-${safeName}-${projectId.toString().substring(18)}`.toLowerCase();
    const imageName = `${containerName}-img`.toLowerCase();

    await appendLog(projectId, "🐳 Building Docker image...", sseClients);
    await exec(`docker build -t ${imageName} "${outputDir}"`);

    await appendLog(projectId, "🚀 Launching container...", sseClients);
    
    // Cleanup old if exists
    try { await exec(`docker stop ${containerName} && docker rm ${containerName}`); } catch (e) {}

    const port = project.assignedPort || await getNextAvailablePort();
    await exec(`docker run -d --name ${containerName} -p ${port}:80 ${imageName}`);

    await Project.findByIdAndUpdate(projectId, {
      containerName,
      deployStatus: "live",
      assignedPort: port,
      deployUrl: `http://localhost:${port}`
    });

    await updateStatus(projectId, "live", sseClients);
    await appendLog(projectId, `✅ Deployment successful! Live at http://localhost:${port}`, sseClients);

  } catch (err: any) {
    console.error("Deployment Error:", err);
    await updateStatus(projectId, "failed", sseClients);
    await appendLog(projectId, `❌ Error: ${err.message}`, sseClients);
  }
}
