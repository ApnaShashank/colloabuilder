import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";
import Lesson from "@/lib/models/Lesson";

const TAILWIND_LESSONS = [
  {
    category: "tailwind", topic: "intro", title: "Introduction to Tailwind CSS", order: 1,
    content: {
      english: "Tailwind CSS is a utility-first CSS framework. Unlike Bootstrap, it doesn't give you pre-built components. Instead, it provides low-level utility classes like 'flex', 'pt-4', 'text-center' that let you build completely custom designs without leaving your HTML.",
      hinglish: "Tailwind CSS ek utility-first framework hai. Ye pre-built components nahi deta, balki 'flex', 'pt-4', 'text-center' jaise utility classes deta hai jisse aap bina CSS likhe apna custom design HTML mein hi bana sakte hain."
    },
    codeSample: { language: "html", filename: "tailwind.html", code: "<div class=\"p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4\">\n  <div class=\"shrink-0\">\n    <img class=\"h-12 w-12\" src=\"/img/logo.svg\" alt=\"Logo\">\n  </div>\n  <div>\n    <div class=\"text-xl font-medium text-black\">ChitChat</div>\n    <p class=\"text-slate-500\">You have a new message!</p>\n  </div>\n</div>" }
  },
  {
    category: "tailwind", topic: "responsive", title: "Responsive Design", order: 2,
    content: {
      english: "Tailwind uses a mobile-first breakpoint system. Use prefixes like 'sm:', 'md:', 'lg:', 'xl:' to apply styles at different screen sizes. For example, 'w-1/2 md:w-full' means half-width on small screens and full-width on medium and up.",
      hinglish: "Tailwind mobile-first approach use karta hai. 'sm:', 'md:', 'lg:' prefixes se aap responsive designs bana sakte hain. Jaise 'w-1/2 md:w-full' ka matlab hai ki mobile par half-width aur medium screens par full-width."
    },
    codeSample: { language: "html", filename: "responsive.html", code: "<div class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">\n  <div class=\"bg-primary p-4 rounded-xl\">Mobile: 1, Tablet: 2, Desktop: 3</div>\n</div>" }
  }
];

const REACT_LESSONS = [
  {
    category: "react", topic: "intro", title: "Introduction to React", order: 1,
    content: {
      english: "React is a JavaScript library for building user interfaces. It's component-based, meaning you build small, reusable pieces of UI and combine them to make complex apps. It uses a Virtual DOM for performance.",
      hinglish: "React ek JS library hai UI banane ke liye. Ye component-based hai, jiska matlab hai aap UI ko chhote reusable pieces mein divide karke unhe combine kar sakte hain."
    },
    codeSample: { language: "javascript", filename: "App.jsx", code: "function Welcome() {\n  return <h1>Hello, GenZ Club!</h1>;\n}\n\nexport default function App() {\n  return <Welcome />;\n}" }
  }
];

const NEXTJS_LESSONS = [
  {
    category: "nextjs", topic: "intro", title: "Introduction to Next.js", order: 1,
    content: {
      english: "Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features like routing and data fetching.",
      hinglish: "Next.js ek React framework hai full-stack apps banane ke liye. Ismein routing aur data fetching jaise features pehle se built-in hote hain."
    },
    codeSample: { language: "javascript", filename: "page.js", code: "export default function Page() {\n  return <h1>Hello, Next.js!</h1>;\n}" }
  }
];

const PROBLEMS = [
  // EASY (10)
  { title: "Two Sum", difficulty: "Easy", tags: ["Array"], description: "Find indices of two numbers that sum to target.", examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" }], constraints: ["2 <= nums.length <= 10^4"], starterCode: { javascript: "function twoSum(nums, target) {\n    \n}", python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        " }, testCases: [] },
  { title: "Palindrome Number", difficulty: "Easy", tags: ["Math"], description: "Check if integer is a palindrome.", examples: [{ input: "x = 121", output: "true", explanation: "121 reads same forward and backward." }], constraints: [], starterCode: { javascript: "function isPalindrome(x) {\n    \n}", python: "class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        " }, testCases: [] },
  { title: "Roman to Integer", difficulty: "Easy", tags: ["String"], description: "Convert Roman numeral to integer.", examples: [], constraints: [], starterCode: { javascript: "function romanToInt(s) {}", python: "" }, testCases: [] },
  { title: "Valid Parentheses", difficulty: "Easy", tags: ["Stack"], description: "Check if parentheses are valid.", examples: [], constraints: [], starterCode: { javascript: "function isValid(s) {}", python: "" }, testCases: [] },
  { title: "Merge Two Sorted Lists", difficulty: "Easy", tags: ["Linked List"], description: "Merge two sorted linked lists.", examples: [], constraints: [], starterCode: { javascript: "function mergeTwoLists(l1, l2) {}", python: "" }, testCases: [] },
  { title: "Remove Duplicates", difficulty: "Easy", tags: ["Array"], description: "Remove duplicates from sorted array.", examples: [], constraints: [], starterCode: { javascript: "function removeDuplicates(nums) {}", python: "" }, testCases: [] },
  { title: "Search Insert Position", difficulty: "Easy", tags: ["Array"], description: "Find index to insert target in sorted array.", examples: [], constraints: [], starterCode: { javascript: "function searchInsert(nums, target) {}", python: "" }, testCases: [] },
  { title: "Length of Last Word", difficulty: "Easy", tags: ["String"], description: "Return length of last word in string.", examples: [], constraints: [], starterCode: { javascript: "function lengthOfLastWord(s) {}", python: "" }, testCases: [] },
  { title: "Plus One", difficulty: "Easy", tags: ["Array"], description: "Increment large integer represented as array.", examples: [], constraints: [], starterCode: { javascript: "function plusOne(digits) {}", python: "" }, testCases: [] },
  { title: "Single Number", difficulty: "Easy", tags: ["Array"], description: "Find the single element in array where others appear twice.", examples: [], constraints: [], starterCode: { javascript: "function singleNumber(nums) {}", python: "" }, testCases: [] },

  // MEDIUM (10)
  { title: "Add Two Numbers", difficulty: "Medium", tags: ["Linked List"], description: "Add two numbers represented by linked lists.", examples: [], constraints: [], starterCode: { javascript: "function addTwoNumbers(l1, l2) {}", python: "" }, testCases: [] },
  { title: "Longest Substring", difficulty: "Medium", tags: ["Sliding Window"], description: "Length of longest substring without repeating characters.", examples: [], constraints: [], starterCode: { javascript: "function lengthOfLongestSubstring(s) {}", python: "" }, testCases: [] },
  { title: "Longest Palindrome", difficulty: "Medium", tags: ["String"], description: "Find longest palindromic substring.", examples: [], constraints: [], starterCode: { javascript: "function longestPalindrome(s) {}", python: "" }, testCases: [] },
  { title: "Reverse Integer", difficulty: "Medium", tags: ["Math"], description: "Reverse digits of an integer.", examples: [], constraints: [], starterCode: { javascript: "function reverse(x) {}", python: "" }, testCases: [] },
  { title: "String to Integer", difficulty: "Medium", tags: ["String"], description: "Implement atoi function.", examples: [], constraints: [], starterCode: { javascript: "function myAtoi(s) {}", python: "" }, testCases: [] },
  { title: "Container With Water", difficulty: "Medium", tags: ["Two Pointers"], description: "Find two lines that contain most water.", examples: [], constraints: [], starterCode: { javascript: "function maxArea(height) {}", python: "" }, testCases: [] },
  { title: "3Sum", difficulty: "Medium", tags: ["Two Pointers"], description: "Find all unique triplets that sum to zero.", examples: [], constraints: [], starterCode: { javascript: "function threeSum(nums) {}", python: "" }, testCases: [] },
  { title: "Letter Combinations", difficulty: "Medium", tags: ["Backtracking"], description: "Get letter combinations of a phone number.", examples: [], constraints: [], starterCode: { javascript: "function letterCombinations(digits) {}", python: "" }, testCases: [] },
  { title: "Generate Parentheses", difficulty: "Medium", tags: ["Backtracking"], description: "Generate all combinations of n pairs of parentheses.", examples: [], constraints: [], starterCode: { javascript: "function generateParenthesis(n) {}", python: "" }, testCases: [] },
  { title: "Rotate Image", difficulty: "Medium", tags: ["Matrix"], description: "Rotate n x n 2D matrix by 90 degrees.", examples: [], constraints: [], starterCode: { javascript: "function rotate(matrix) {}", python: "" }, testCases: [] },

  // HARD (10)
  { title: "Median of Arrays", difficulty: "Hard", tags: ["Binary Search"], description: "Median of two sorted arrays.", examples: [], constraints: [], starterCode: { javascript: "function findMedianSortedArrays(nums1, nums2) {}", python: "" }, testCases: [] },
  { title: "Regex Matching", difficulty: "Hard", tags: ["DP"], description: "Implement regex matching with . and *.", examples: [], constraints: [], starterCode: { javascript: "function isMatch(s, p) {}", python: "" }, testCases: [] },
  { title: "Merge K Sorted Lists", difficulty: "Hard", tags: ["Heap"], description: "Merge k sorted linked lists.", examples: [], constraints: [], starterCode: { javascript: "function mergeKLists(lists) {}", python: "" }, testCases: [] },
  { title: "Reverse K-Group", difficulty: "Hard", tags: ["Linked List"], description: "Reverse nodes of linked list in k-groups.", examples: [], constraints: [], starterCode: { javascript: "function reverseKGroup(head, k) {}", python: "" }, testCases: [] },
  { title: "Sudoku Solver", difficulty: "Hard", tags: ["Backtracking"], description: "Solve a Sudoku puzzle.", examples: [], constraints: [], starterCode: { javascript: "function solveSudoku(board) {}", python: "" }, testCases: [] },
  { title: "First Missing Positive", difficulty: "Hard", tags: ["Array"], description: "Smallest missing positive integer.", examples: [], constraints: [], starterCode: { javascript: "function firstMissingPositive(nums) {}", python: "" }, testCases: [] },
  { title: "Trapping Rain Water", difficulty: "Hard", tags: ["Stack"], description: "Compute how much water can be trapped.", examples: [], constraints: [], starterCode: { javascript: "function trap(height) {}", python: "" }, testCases: [] },
  { title: "Wildcard Matching", difficulty: "Hard", tags: ["DP"], description: "Implement wildcard pattern matching.", examples: [], constraints: [], starterCode: { javascript: "function isMatch(s, p) {}", python: "" }, testCases: [] },
  { title: "N-Queens", difficulty: "Hard", tags: ["Backtracking"], description: "Place n queens on n x n board.", examples: [], constraints: [], starterCode: { javascript: "function solveNQueens(n) {}", python: "" }, testCases: [] },
  { title: "Edit Distance", difficulty: "Hard", tags: ["DP"], description: "Find minimum operations to convert word1 to word2.", examples: [], constraints: [], starterCode: { javascript: "function minDistance(word1, word2) {}", python: "" }, testCases: [] }
];

export async function GET() {
  try {
    await connectDB();
    
    // Seed Lessons (React category fix)
    await Lesson.deleteMany({ category: { $in: ["tailwind", "react", "nextjs"] } });
    await Lesson.insertMany([...TAILWIND_LESSONS, ...REACT_LESSONS, ...NEXTJS_LESSONS]);

    // Seed Problems
    await Problem.deleteMany({});
    await Problem.insertMany(PROBLEMS);
    
    return NextResponse.json({ success: true, seeded: true });
  } catch (error) {
    return NextResponse.json({ error: "Seeding failed", details: String(error) }, { status: 500 });
  }
}
