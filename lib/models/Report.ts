import mongoose, { Schema } from "mongoose";

const ReportSchema = new Schema({
  reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
  targetId: { type: Schema.Types.ObjectId, required: true }, // Can be UserId, ProjectId, or TeamId
  targetType: { type: String, enum: ["User", "Project", "Team", "Comment"], required: true },
  reason: { type: String, required: true },
  details: { type: String, default: "" },
  priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
  status: { type: String, enum: ["Pending", "Reviewed", "Resolved", "Dismissed"], default: "Pending" },
  reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
