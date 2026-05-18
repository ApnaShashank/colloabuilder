import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  isPublic: { type: Boolean, default: true },
  avatar: { type: String, default: "" },
  members: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["Lead", "Backend", "Frontend", "DevOps", "Member"], default: "Member" },
    },
  ],
  category: { type: String, default: "General" },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  projects: { type: Number, default: 0 },
  ownerId: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);
export default Team;
