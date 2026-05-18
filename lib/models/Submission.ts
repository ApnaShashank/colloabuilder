import mongoose, { Schema } from "mongoose";

const SubmissionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  status: { type: String, enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error"], required: true },
  runtime: String,
  memory: String,
  score: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
