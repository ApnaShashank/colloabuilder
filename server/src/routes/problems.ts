import express from "express";
import Problem from "../models/Problem";

const router = express.Router();

const fallbackProblems = [
  {
    _id: "p1",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    acceptedCount: 4500,
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice."
  },
  {
    _id: "p2",
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    acceptedCount: 3800,
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if: Open brackets must be closed by the same type of brackets, and Open brackets must be closed in the correct order."
  },
  {
    _id: "p3",
    title: "Palindrome Number",
    difficulty: "Easy",
    tags: ["Math"],
    acceptedCount: 5200,
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward. For example, 121 is a palindrome while 123 is not."
  },
  {
    _id: "p4",
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math"],
    acceptedCount: 2100,
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list."
  },
  {
    _id: "p5",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Sliding Window", "Hash Table"],
    acceptedCount: 1900,
    description: "Given a string s, find the length of the longest substring without repeating characters."
  },
  {
    _id: "p6",
    title: "Group Anagrams",
    difficulty: "Medium",
    tags: ["Hash Table", "String"],
    acceptedCount: 1500,
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once."
  },
  {
    _id: "p7",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Binary Search", "Divide and Conquer"],
    acceptedCount: 800,
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n))."
  },
  {
    _id: "p8",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Two Pointers", "Stack"],
    acceptedCount: 950,
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining."
  },
  {
    _id: "p9",
    title: "Reverse String",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],
    acceptedCount: 6000,
    description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory."
  },
  {
    _id: "p10",
    title: "Climbing Stairs",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Math"],
    acceptedCount: 3100,
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?"
  }
];

router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find().select("title difficulty tags acceptedCount");
    if (problems.length === 0) {
      return res.json({ success: true, problems: fallbackProblems });
    }
    res.json({ success: true, problems });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      const fallback = fallbackProblems.find(p => p._id === req.params.id);
      if (fallback) return res.json({ success: true, problem: fallback });
      return res.status(404).json({ error: "Problem not found" });
    }
    res.json({ success: true, problem });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

export default router;
