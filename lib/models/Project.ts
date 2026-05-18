import mongoose, { Schema } from "mongoose";

const EnvVarSchema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }, // stored as plain (encrypt in API layer)
  environment: { type: String, enum: ["production", "preview", "all"], default: "production" },
}, { _id: true });

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  language: { type: String, default: "TypeScript" },
  langColor: { type: String, default: "#3178c6" },
  isPublic: { type: Boolean, default: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User" },
  teamId: { type: Schema.Types.ObjectId, ref: "Team" },
  contributors: [{ type: Schema.Types.ObjectId, ref: "User" }],
  tags: [String],
  stars: { type: Number, default: 0 },
  branches: { type: Number, default: 1 },

  // GitHub Integration
  github: {
    repoUrl: { type: String, default: "" },
    repoName: { type: String, default: "" },
    repoId: { type: String, default: "" },
    repoOwner: { type: String, default: "" },
    defaultBranch: { type: String, default: "main" },
    deployBranch: { type: String, default: "main" },
    isConnected: { type: Boolean, default: false },
    webhookId: { type: String, default: "" },
    accessToken: { type: String, default: "" }, // encrypted
    lastCommit: { type: String, default: "" },
    lastCommitMessage: { type: String, default: "" },
  },

  // Deployment Config
  deploy: {
    buildCommand: { type: String, default: "npm run build" },
    outputDir: { type: String, default: ".next" },
    installCommand: { type: String, default: "npm install" },
    nodeVersion: { type: String, default: "18" },
    framework: { type: String, default: "nextjs" },
    autoDeploy: { type: Boolean, default: true },
  },

  // Environment Variables
  envVars: [EnvVarSchema],

  // Virtual Files Map (path -> content)
  files: { type: Schema.Types.Mixed, default: {} },

  // Current Deployment Status
  currentDeploymentId: { type: Schema.Types.ObjectId, ref: "Deployment" },
  deployStatus: { type: String, enum: ["none", "queued", "building", "live", "failed", "rolled_back"], default: "none" },
  deployUrl: { type: String, default: "" },

  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

if (mongoose.models.Project) {
  delete (mongoose.models as any).Project;
}
export default mongoose.model("Project", ProjectSchema);
