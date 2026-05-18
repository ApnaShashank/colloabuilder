import mongoose, { Schema } from "mongoose";

const ExampleSchema = new Schema({
  input: String,
  output: String,
  explanation: String,
});

const ProblemSchema = new Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  difficultyRank: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  tags: [String],
  description: { type: String, required: true },
  examples: [ExampleSchema],
  constraints: [String],
  starterCode: {
    javascript: String,
    typescript: String,
    python: String,
  },
  testCases: [
    {
      input: String,
      expectedOutput: String,
      isPublic: { type: Boolean, default: true },
    },
  ],
  submissionsCount: { type: Number, default: 0 },
  acceptedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

ProblemSchema.index({ createdAt: -1 });

export default mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);
