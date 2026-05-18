import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Problem from "../lib/models/Problem";

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/genzclub";

const EASY_PROBLEMS = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    starterCode: {
      javascript: "function twoSum(nums, target) {\n  // Write your code here\n};",
      typescript: "function twoSum(nums: number[], target: number): number[] {\n  // Write your code here\n};",
      python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass"
    },
    testCases: [
      { input: "[2,7,11,15], 9", expectedOutput: "[0,1]", isPublic: true },
      { input: "[3,2,4], 6", expectedOutput: "[1,2]", isPublic: true }
    ]
  },
  {
    title: "Palindrome Number",
    difficulty: "Easy",
    tags: ["Math"],
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    examples: [{ input: "x = 121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." }],
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    starterCode: {
      javascript: "function isPalindrome(x) {\n  \n};",
      typescript: "function isPalindrome(x: number): boolean {\n  \n};",
      python: "class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        pass"
    },
    testCases: [
      { input: "121", expectedOutput: "true", isPublic: true },
      { input: "-121", expectedOutput: "false", isPublic: true }
    ]
  },
  {
    title: "Roman to Integer",
    difficulty: "Easy",
    tags: ["Hash Table", "Math", "String"],
    description: "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Convert a given roman numeral to an integer.",
    examples: [{ input: "s = \"III\"", output: "3", explanation: "" }],
    constraints: ["1 <= s.length <= 15", "s contains only characters ('I', 'V', 'X', 'L', 'C', 'D', 'M')."],
    starterCode: {
      javascript: "function romanToInt(s) {\n  \n};",
      typescript: "function romanToInt(s: string): number {\n  \n};",
      python: "class Solution:\n    def romanToInt(self, s: str) -> int:\n        pass"
    },
    testCases: [
      { input: "\"III\"", expectedOutput: "3", isPublic: true },
      { input: "\"LVIII\"", expectedOutput: "58", isPublic: true }
    ]
  },
  {
    title: "Longest Common Prefix",
    difficulty: "Easy",
    tags: ["String"],
    description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string \"\".",
    examples: [{ input: "strs = [\"flower\",\"flow\",\"flight\"]", output: "\"fl\"", explanation: "" }],
    constraints: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200"],
    starterCode: {
      javascript: "function longestCommonPrefix(strs) {\n  \n};",
      typescript: "function longestCommonPrefix(strs: string[]): string {\n  \n};",
      python: "class Solution:\n    def longestCommonPrefix(self, strs: List[str]) -> str:\n        pass"
    },
    testCases: [
      { input: "[\"flower\",\"flow\",\"flight\"]", expectedOutput: "\"fl\"", isPublic: true },
      { input: "[\"dog\",\"racecar\",\"car\"]", expectedOutput: "\"\"", isPublic: true }
    ]
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [{ input: "s = \"()\"", output: "true", explanation: "" }],
    constraints: ["1 <= s.length <= 10^4"],
    starterCode: {
      javascript: "function isValid(s) {\n  \n};",
      typescript: "function isValid(s: string): boolean {\n  \n};",
      python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass"
    },
    testCases: [
      { input: "\"()\"", expectedOutput: "true", isPublic: true },
      { input: "\"(]\"", expectedOutput: "false", isPublic: true }
    ]
  }
  // ... more problems will be added in batches
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected Successfully.");

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("Existing problems cleared.");

    // We will combine all sets here
    const ALL_PROBLEMS = [...EASY_PROBLEMS];
    
    await Problem.insertMany(ALL_PROBLEMS);
    console.log(`✅ Seeded ${ALL_PROBLEMS.length} problems!`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
