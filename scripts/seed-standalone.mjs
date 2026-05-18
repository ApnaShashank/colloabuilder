import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/genzclub";

const ExampleSchema = new mongoose.Schema({
  input: String,
  output: String,
  explanation: String,
});

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
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

const Problem = mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);

const seedProblems = [
  {
    title: "The Fibonacci Sequence",
    difficulty: "Easy",
    tags: ["Math", "Recursion", "DP"],
    description: "The Fibonacci numbers F(n) form a sequence, F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).\n\nGiven n, calculate F(n).",
    examples: [
      { input: "n = 2", output: "1", explanation: "F(2) = 1 + 0 = 1" }
    ],
    constraints: ["0 <= n <= 30"],
    starterCode: {
      javascript: "function fib(n) {\n  return 0;\n}",
      python: "def fib(n):\n    return 0",
      typescript: "function fib(n: number): number {\n  return 0;\n}"
    },
    testCases: [
      { input: "2", expectedOutput: "1", isPublic: true },
      { input: "10", expectedOutput: "55", isPublic: false }
    ]
  },
  {
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9" }
    ],
    starterCode: {
      javascript: "function twoSum(nums, target) {\n  return [];\n}",
      python: "def twoSum(nums, target):\n    return []",
      typescript: "function twoSum(nums: number[], target: number): number[] {\n  return [];\n}"
    },
    testCases: [
      { input: "[2,7,11,15], 9", expectedOutput: "[0,1]", isPublic: true }
    ]
  },
  {
    title: "Spiral Matrix II",
    difficulty: "Medium",
    tags: ["Matrix", "Simulation"],
    description: "Given a positive integer n, generate an n x n matrix filled with elements from 1 to n^2 in spiral order.",
    examples: [
      { input: "n = 3", output: "[[1,2,3],[8,9,4],[7,6,5]]", explanation: "" }
    ],
    starterCode: {
      javascript: "function generateMatrix(n) {\n  return [];\n}",
      python: "def generateMatrix(n):\n    return []",
      typescript: "function generateMatrix(n: number): number[][] {\n  return [];\n}"
    },
    testCases: [
      { input: "3", expectedOutput: "[[1,2,3],[8,9,4],[7,6,5]]", isPublic: true }
    ]
  }
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Problem.deleteMany({});
  await Problem.insertMany(seedProblems);
  console.log("Seeded successfully!");
  process.exit(0);
}

seed();
