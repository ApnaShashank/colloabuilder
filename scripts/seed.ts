import mongoose from "mongoose";
import Problem from "../lib/models/Problem";

const MONGODB_URI = "mongodb://127.0.0.1:27017/genzclub";

const baseProblems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Arrays", "Hash Table"],
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    starterCode: {
      javascript: "function twoSum(nums, target) {\n\n}",
      python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:",
    }
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window"],
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' }
    ],
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    starterCode: {
      javascript: "function lengthOfLongestSubstring(s) {\n\n}",
      python: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:",
    }
  },
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Arrays", "Binary Search", "Divide and Conquer"],
    description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.",
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000", explanation: "merged array = [1,2,3] and median is 2." }
    ],
    constraints: ["nums1.length == m", "nums2.length == n", "0 <= m, n <= 1000"],
    starterCode: {
      javascript: "function findMedianSortedArrays(nums1, nums2) {\n\n}",
      python: "class Solution:\n    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:",
    }
  }
];

async function seed() {
  try {
    console.log("Seeding started...");
    await mongoose.connect(MONGODB_URI);
    
    // Clear existing
    await Problem.deleteMany({});
    
    // Insert new
    await Problem.insertMany(baseProblems);
    
    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
