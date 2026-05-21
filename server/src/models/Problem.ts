import mongoose, { Schema } from "mongoose";

const ProblemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  tags: [{ type: String }],
  acceptedCount: { type: Number, default: 0 },
  submissionsCount: { type: Number, default: 0 },
  constraints: [{ type: String }],
  examples: [
    {
      input: { type: String },
      output: { type: String },
      explanation: { type: String }
    }
  ],
  starterCode: {
    javascript: { type: String },
    typescript: { type: String },
    python: { type: String }
  }
}, { timestamps: true });

const Problem: mongoose.Model<any> = mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);
export default Problem;
