// @ts-nocheck
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth";
import jobRoutes from "./routes/jobs";
import userRoutes from "./routes/user";
import lessonRoutes from "./routes/lessons";
import problemRoutes from "./routes/problems";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/colloabuilder";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/user", userRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/problems", problemRoutes);

app.get("/", (req, res) => {
  res.send("Colloabuilder API is running...");
});

// Missing API Stubs for Dashboard parity
app.get("/api/teams", (req, res) => {
  res.json({ success: true, teams: [] });
});

app.get("/api/roadmap", (req, res) => {
  res.json({ success: true, roadmaps: [] });
});

app.get("/api/leaderboard", (req, res) => {
  res.json({ 
    success: true, 
    topUsers: [
      { _id: "1", username: "AlexDev", name: "Alex Rivera", xp: 12450, level: 42, role: "Fullstack Architect", avatar: "" },
      { _id: "2", username: "SarahCode", name: "Sarah Chen", xp: 11200, level: 38, role: "Frontend Lead", avatar: "" },
      { _id: "3", username: "MikeOps", name: "Mike Ross", xp: 9800, level: 35, role: "DevOps Engineer", avatar: "" },
      { _id: "4", username: "JaneDoe", name: "Jane Doe", xp: 8500, level: 31, role: "Backend Developer", avatar: "" },
      { _id: "5", username: "JohnSmith", name: "John Smith", xp: 7200, level: 28, role: "UI/UX Designer", avatar: "" },
    ],
    currentUserRank: 4,
    currentUserStats: { xp: 8500, level: 31 }
  });
});

// Dummy Dashboard Routes
app.get("/api/submissions/stats", (req, res) => {
  res.json({ stats: { solvedCount: 142, accuracy: 94, streak: 38, rank: 4 } });
});

app.get("/api/submissions", (req, res) => {
  res.json({ submissions: [
    { _id: "1", title: "Two Sum", status: "Accepted", submittedAt: new Date(), language: "TypeScript", runtime: "45ms" },
    { _id: "2", title: "Reverse Linked List", status: "Accepted", submittedAt: new Date(), language: "JavaScript", runtime: "52ms" },
  ] });
});

import { protect } from "./middleware/auth";
import Project from "./models/Project";

// Real Project Routes
app.get("/api/projects", protect, async (req: any, res) => {
  try {
    const projects = await Project.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/projects", protect, async (req: any, res) => {
  try {
    const { name, description, language, isPublic } = req.body;
    const project = await Project.create({
      userId: req.user.userId,
      name,
      description,
      language,
      isPublic,
      code: {
        html: "<!-- Start coding your site -->\n<div class='hero'>\n  <h1>My Site</h1>\n</div>",
        css: ".hero { text-align: center; padding: 50px; }",
        js: "console.log('Ready');"
      }
    });
    res.status(201).json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/projects/:id", protect, async (req: any, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/projects/:id", protect, async (req: any, res) => {
  try {
    const { name, description, code, isPublic } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { name, description, code, isPublic },
      { returnDocument: "after" }
    );
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

import { handleDeployment, getNextAvailablePort } from "./utils/deployer";
export const sseClients = new Map<string, any[]>();

// Integrated Deployment Routes
app.post("/api/projects/:id/deploy", protect, async (req: any, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!project) return res.status(404).json({ error: "Project not found" });

    const port = project.assignedPort || await getNextAvailablePort();
    project.assignedPort = port;
    project.deployStatus = "queued";
    await project.save();

    res.json({ success: true, message: "Deployment started" });

    handleDeployment(project._id.toString(), sseClients).catch(err => console.error(err));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/projects/:id/logs", async (req: any, res) => {
  const { id } = req.params;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const project = await Project.findById(id);
  if (!project) return res.end();

  res.write(`event: status\ndata: ${JSON.stringify({ status: project.deployStatus })}\n\n`);
  project.logs.forEach(log => {
    res.write(`event: log\ndata: ${JSON.stringify(log)}\n\n`);
  });

  if (!sseClients.has(id)) sseClients.set(id, []);
  sseClients.get(id)?.push(res);

  req.on("close", () => {
    const clients = sseClients.get(id) || [];
    sseClients.set(id, clients.filter(c => c !== res));
  });
});

app.delete("/api/projects/:id", protect, async (req: any, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (project.containerName) {
      const { exec } = require("child_process");
      exec(`docker stop ${project.containerName} && docker rm ${project.containerName}`);
    }

    res.json({ success: true, message: "Project deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/user/activity", (req, res) => {
  res.json({ activity: [] });
});

app.get("/api/notifications", (req, res) => {
  res.json({ success: true, notifications: [] });
});

// Start Server
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
