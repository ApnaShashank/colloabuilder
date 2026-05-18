import mongoose, { Schema } from "mongoose";

const SystemBroadcastSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["Info", "Update", "Alert", "Success"], 
    default: "Info" 
  },
  priority: { type: String, enum: ["Normal", "High", "Critical"], default: "Normal" },
  active: { type: Boolean, default: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SystemBroadcast || mongoose.model("SystemBroadcast", SystemBroadcastSchema);
