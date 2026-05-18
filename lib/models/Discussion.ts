import mongoose, { Schema } from "mongoose";

const DiscussionSchema = new Schema({
  problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: String,
  userAvatar: String,
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

DiscussionSchema.index({ problemId: 1, createdAt: -1 });

export default mongoose.models.Discussion || mongoose.model("Discussion", DiscussionSchema);
