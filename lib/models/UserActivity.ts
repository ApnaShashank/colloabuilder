import mongoose, { Schema } from "mongoose";

const UserActivitySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // Format: "YYYY-MM-DD"
  points: { type: Number, default: 0 },
  actionType: { type: String, default: "General" }, // e.g., "Quiz", "Roadmap", "Project"
  details: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

// A user should have only one activity record per day per action type (or just per day, but we might want multiple actions)
// For a standard GitHub-style heatmap, aggregating by date and userId is easiest.
UserActivitySchema.index({ userId: 1, date: 1, actionType: 1 }, { unique: true });

export default mongoose.models.UserActivity || mongoose.model("UserActivity", UserActivitySchema);
