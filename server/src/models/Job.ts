import mongoose, { Schema } from "mongoose";

const JobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String, default: "" },
  location: { type: String, default: "Remote" },
  workMode: { type: String, enum: ["Remote", "On-site", "Hybrid"], default: "Remote" },
  type: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Hackathon"], default: "Full-time" },
  experienceLevel: { type: String, enum: ["Entry", "Mid", "Senior", "Lead", "Executive"], default: "Mid" },
  salary: { type: String, default: "" },
  salaryMin: { type: Number, default: 0 },
  salaryMax: { type: Number, default: 0 },
  currency: { type: String, default: "USD" },
  description: { type: String, required: true },
  requirements: { type: String, default: "" },
  url: { type: String, default: "" },
  tags: [String],
  // Source tracking
  source: { type: String, enum: ["manual", "ai_tavily", "ai_serpapi"], default: "manual" },
  sourceRaw: { type: String, default: "" }, // original AI result snippet
  author: { type: Schema.Types.ObjectId, ref: "User" }, // nullable for AI-sourced jobs
  isActive: { type: Boolean, default: true },
  applicantsCount: { type: Number, default: 0 },
  expiresAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

// Index for fast searching
JobSchema.index({ title: "text", company: "text", description: "text", tags: "text" });
JobSchema.index({ createdAt: -1 });
JobSchema.index({ isActive: 1 });

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);
export default Job;
