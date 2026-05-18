import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String },
  language: { type: String, default: "JavaScript" },
  isPublic: { type: Boolean, default: true },
  stars: { type: Number, default: 0 },
  branches: { type: Number, default: 1 },
  deployStatus: { 
    type: String, 
    enum: ["none", "queued", "cloning", "building", "launching", "live", "stopped", "failed"], 
    default: "none" 
  },
  deployUrl: { type: String },
  assignedPort: { type: Number },
  containerName: { type: String },
  logs: [{
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  githubUrl: { type: String },
  code: {
    html: { type: String, default: "" },
    css: { type: String, default: "" },
    js: { type: String, default: "" }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Project", ProjectSchema);
