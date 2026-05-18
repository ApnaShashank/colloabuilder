import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  skills: { type: [String], default: [] },
  onboarded: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  role: { type: String, default: "" },
  skillLevel: { type: String, default: "" },
  interests: { type: [String], default: [] },
  techStack: { type: [String], default: [] },
  goal: { type: String, default: "" },
  githubUrl: { type: String, default: "" },
  linkedinUrl: { type: String, default: "" },
  portfolioUrl: { type: String, default: "" },
  github: {
    accessToken: { type: String, default: "" },
    username: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    profileUrl: { type: String, default: "" },
    isConnected: { type: Boolean, default: false },
  },
  notifications: {
    teamAlerts: { type: Boolean, default: true },
    projectSync: { type: Boolean, default: true },
    badgeMastery: { type: Boolean, default: true },
    securityPulse: { type: Boolean, default: true }
  },
  privacyPrefs: {
    discovery: { type: Boolean, default: true },
    liveStream: { type: Boolean, default: true },
    eliteBadge: { type: Boolean, default: true }
  },
  dismissedBroadcasts: [{ type: Schema.Types.ObjectId, ref: "SystemBroadcast" }],
  readBroadcasts: [{ type: Schema.Types.ObjectId, ref: "SystemBroadcast" }],
  createdAt: { type: Date, default: Date.now },
});

UserSchema.index({ createdAt: -1 });

const User = mongoose.model("User", UserSchema);
export default User;
