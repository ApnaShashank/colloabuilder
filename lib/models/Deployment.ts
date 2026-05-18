import mongoose, { Schema } from "mongoose";

const LogLineSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  level: { type: String, enum: ["info", "success", "error", "warn"], default: "info" },
  message: { type: String, required: true },
}, { _id: false });

const DeploymentSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

  // Version & Identity
  version: { type: Number, required: true, default: 1 },
  commitHash: { type: String, default: "" },
  commitMessage: { type: String, default: "" },
  branch: { type: String, default: "main" },
  vercelId: { type: String, default: "" },

  // Status
  status: {
    type: String,
    enum: ["queued", "building", "live", "failed", "cancelled", "rolled_back"],
    default: "queued",
  },

  // Trigger source
  triggeredBy: { type: String, enum: ["manual", "webhook", "rollback"], default: "manual" },

  // Output
  deployUrl: { type: String, default: "" },
  buildDuration: { type: Number, default: 0 }, // seconds

  // Logs (capped for performance — last 500 lines kept)
  logs: [LogLineSchema],

  // Timestamps
  startedAt: { type: Date },
  finishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Deployment ||
  mongoose.model("Deployment", DeploymentSchema);
