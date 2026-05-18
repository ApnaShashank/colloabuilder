import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
  teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
