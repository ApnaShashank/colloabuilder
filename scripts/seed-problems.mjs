import mongoose from "mongoose";
import dotenv from "dotenv";
import Problem from "../lib/models/Problem.js";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define MONGODB_URI in .env.local");
  process.exit(1);
}

const seedProblems = [
  {
    title: "The Fibonacci Sequence",
    difficulty: "Easy",
    tags: ["Math", "Recursion", "DP"],
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\nF(0) = 0, F(1) = 1\nF(n) = F(n - 1) + F(n - 2), for n > 1.\n\nGiven n, calculate F(n).",
    examples: [
      { input: "n = 2", output: "1", explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1." },
      { input: "n = 3", output: "2", explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2." }
    ],
    constraints: ["0 <= n <= 30"],
    starterCode: {
      javascript: "function fib(n) {\n  // Implement logic\n}",
      python: "def fib(n):\n    # Implement logic",
      typescript: "function fib(n: number): number {\n  // Implement logic\n}"
    },
    testCases: [
      { input: "2", expectedOutput: "1", isPublic: true },
      { input: "4", expectedOutput: "3", isPublic: true },
      { input: "10", expectedOutput: "55", isPublic: false }
    ],
    acceptedCount: 1240,
    submissionsCount: 2000
  },
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    tags: ["Hash Table", "String", "Sorting"],
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    examples: [
      { input: "s = \"anagram\", t = \"nagaram\"", output: "true", explanation: "" },
      { input: "s = \"rat\", t = \"car\"", output: "false", explanation: "" }
    ],
    constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
    starterCode: {
      javascript: "function isAnagram(s, t) {\n  \n}",
      python: "def isAnagram(s, t):\n    ",
      typescript: "function isAnagram(s: string, t: string): boolean {\n  \n}"
    },
    testCases: [
      { input: "\"anagram\", \"nagaram\"", expectedOutput: "true", isPublic: true },
      { input: "\"rat\", \"car\"", expectedOutput: "false", isPublic: true }
    ],
    acceptedCount: 850,
    submissionsCount: 1100
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Two Pointers", "Array", "Greedy"],
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the i-th line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49." }
    ],
    constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    starterCode: {
      javascript: "function maxArea(height) {\n  \n}",
      python: "def maxArea(height):\n    ",
      typescript: "function maxArea(height: number[]): number {\n  \n}"
    },
    testCases: [
      { input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49", isPublic: true },
      { input: "[1,1]", expectedOutput: "1", isPublic: true }
    ],
    acceptedCount: 430,
    submissionsCount: 780
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing problems to avoid duplicates during seeding
    await Problem.deleteMany({});
    console.log("Cleared existing problems");

    await Problem.insertMany(seedProblems);
    console.log(`${seedProblems.length} problems seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
