import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/colloabuilder";

// Define Schemas
const LessonSchema = new mongoose.Schema({
  category: String,
  topic: String,
  title: String,
  order: Number,
  content: { english: String, hinglish: String },
  codeSample: { language: String, code: String, filename: String }
});

const ProblemSchema = new mongoose.Schema({
  title: String,
  difficulty: String,
  tags: [String],
  description: String,
  examples: [{ input: String, output: String, explanation: String }],
  constraints: [String],
  starterCode: { javascript: String, typescript: String, python: String },
  testCases: [{ input: String, expectedOutput: String, isPublic: Boolean }]
});

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);
const Problem = mongoose.models.Problem || mongoose.model('Problem', ProblemSchema);

// --- LESSONS DATA ---
const TAILWIND_LESSONS = [
  {
    category: "tailwind", topic: "intro", title: "Introduction to Tailwind CSS", order: 1,
    content: {
      english: "Tailwind CSS is a utility-first CSS framework. Unlike Bootstrap, it doesn't give you pre-built components. Instead, it provides low-level utility classes like 'flex', 'pt-4', 'text-center' that let you build completely custom designs without leaving your HTML.",
      hinglish: "Tailwind CSS ek utility-first framework hai. Ye pre-built components nahi deta, balki 'flex', 'pt-4', 'text-center' jaise small utility classes deta hai jisse aap bina CSS likhe apna custom design HTML mein hi bana sakte hain."
    },
    codeSample: { language: "html", filename: "tailwind.html", code: "<div class=\"p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4\">\n  <div class=\"shrink-0\">\n    <img class=\"h-12 w-12\" src=\"/img/logo.svg\" alt=\"Logo\">\n  </div>\n  <div>\n    <div class=\"text-xl font-medium text-black\">ChitChat</div>\n    <p class=\"text-slate-500\">You have a new message!</p>\n  </div>\n</div>" }
  },
  {
    category: "tailwind", topic: "responsive", title: "Responsive Design", order: 2,
    content: {
      english: "Tailwind uses a mobile-first breakpoint system. Use prefixes like 'sm:', 'md:', 'lg:', 'xl:' to apply styles at different screen sizes. For example, 'w-1/2 md:w-full' means half-width on small screens and full-width on medium and up.",
      hinglish: "Tailwind mobile-first approach use karta hai. 'sm:', 'md:', 'lg:' prefixes se aap responsive designs bana sakte hain. Jaise 'bg-red-500 md:bg-blue-500' ka matlab hai ki mobile par red aur medium screen par blue background hoga."
    },
    codeSample: { language: "html", filename: "responsive.html", code: "<div class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">\n  <div class=\"bg-primary p-4\">Item 1</div>\n  <div class=\"bg-primary p-4\">Item 2</div>\n  <div class=\"bg-primary p-4\">Item 3</div>\n</div>" }
  }
];

const REACT_LESSONS = [
  {
    category: "reactjs", topic: "intro", title: "Introduction to React", order: 1,
    content: {
      english: "React is a JavaScript library for building user interfaces. It's component-based, meaning you build small, reusable pieces of UI and combine them to make complex apps. It uses a Virtual DOM to efficiently update only the parts of the page that change.",
      hinglish: "React ek JS library hai UI banane ke liye. Ye component-based hai, jiska matlab hai aap UI ko chhote pieces mein divide karke unhe combine kar sakte hain. Ye Virtual DOM use karke fast rendering provide karta hai."
    },
    codeSample: { language: "javascript", filename: "App.jsx", code: "function Welcome() {\n  return <h1>Hello, GenZ Club!</h1>;\n}\n\nexport default function App() {\n  return (\n    <div>\n      <Welcome />\n    </div>\n  );\n}" }
  },
  {
    category: "reactjs", topic: "hooks", title: "React Hooks: useState", order: 2,
    content: {
      english: "Hooks are functions that let you 'hook into' React state and lifecycle features from function components. 'useState' is the most common hook, used to keep track of data that changes, like a counter or input value.",
      hinglish: "Hooks functions hain jo functional components mein state aur lifecycle features use karne ki permission dete hain. 'useState' hook ka use data change track karne ke liye hota hai, jaise button click count ya input text."
    },
    codeSample: { language: "javascript", filename: "Counter.jsx", code: "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count is {count}\n    </button>\n  );\n}" }
  }
];

const NEXTJS_LESSONS = [
  {
    category: "nextjs", topic: "intro", title: "Introduction to Next.js", order: 1,
    content: {
      english: "Next.js is a React framework that gives you building blocks to create web applications. It handles routing, data fetching, and performance optimizations out of the box. Key features include Server-Side Rendering (SSR) and Static Site Generation (SSG).",
      hinglish: "Next.js ek React framework hai jo full-stack features provide karta hai. Ismein routing, data fetching aur optimization pehle se handle hote hain. Iske main features SSR aur SSG hain jo performance badhate hain."
    },
    codeSample: { language: "javascript", filename: "page.js", code: "export default function Home() {\n  return (\n    <main className=\"flex min-h-screen flex-col items-center justify-between p-24\">\n      <h1 className=\"text-4xl font-bold\">Welcome to Next.js</h1>\n    </main>\n  );\n}" }
  }
];

// --- PROBLEMS DATA (30 TOTAL) ---
const PROBLEMS = [
  // EASY (10)
  { title: "Two Sum", difficulty: "Easy", tags: ["Array"], description: "Find indices of two numbers that sum to target.", examples: [], constraints: [], starterCode: { javascript: "function twoSum(nums, target) {}", python: "" }, testCases: [] },
  { title: "Palindrome Number", difficulty: "Easy", tags: ["Math"], description: "Check if integer is a palindrome.", examples: [], constraints: [], starterCode: { javascript: "function isPalindrome(x) {}", python: "" }, testCases: [] },
  { title: "Roman to Integer", difficulty: "Easy", tags: ["String"], description: "Convert Roman numeral to integer.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Valid Parentheses", difficulty: "Easy", tags: ["Stack"], description: "Check if parentheses are valid.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Merge Two Sorted Lists", difficulty: "Easy", tags: ["Linked List"], description: "Merge two sorted linked lists.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Remove Duplicates", difficulty: "Easy", tags: ["Array"], description: "Remove duplicates from sorted array.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Search Insert Position", difficulty: "Easy", tags: ["Array"], description: "Find index to insert target in sorted array.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Length of Last Word", difficulty: "Easy", tags: ["String"], description: "Return length of last word in string.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Plus One", difficulty: "Easy", tags: ["Array"], description: "Increment large integer represented as array.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Single Number", difficulty: "Easy", tags: ["Array"], description: "Find the single element in array where others appear twice.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },

  // MEDIUM (10)
  { title: "Add Two Numbers", difficulty: "Medium", tags: ["Linked List"], description: "Add two numbers represented by linked lists.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Longest Substring", difficulty: "Medium", tags: ["Sliding Window"], description: "Length of longest substring without repeating characters.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Longest Palindrome", difficulty: "Medium", tags: ["Dynamic Programming"], description: "Find longest palindromic substring.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Reverse Integer", difficulty: "Medium", tags: ["Math"], description: "Reverse digits of an integer.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "String to Integer", difficulty: "Medium", tags: ["String"], description: "Implement atoi function.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Container With Water", difficulty: "Medium", tags: ["Two Pointers"], description: "Find two lines that contain most water.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "3Sum", difficulty: "Medium", tags: ["Two Pointers"], description: "Find all unique triplets that sum to zero.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Letter Combinations", difficulty: "Medium", tags: ["Backtracking"], description: "Get letter combinations of a phone number.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Generate Parentheses", difficulty: "Medium", tags: ["Backtracking"], description: "Generate all combinations of n pairs of parentheses.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Rotate Image", difficulty: "Medium", tags: ["Matrix"], description: "Rotate n x n 2D matrix by 90 degrees.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },

  // HARD (10)
  { title: "Median of Arrays", difficulty: "Hard", tags: ["Binary Search"], description: "Median of two sorted arrays.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Regex Matching", difficulty: "Hard", tags: ["Dynamic Programming"], description: "Implement regex matching with . and *.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Merge K Sorted Lists", difficulty: "Hard", tags: ["Heap"], description: "Merge k sorted linked lists.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Reverse K-Group", difficulty: "Hard", tags: ["Linked List"], description: "Reverse nodes of linked list in k-groups.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Sudoku Solver", difficulty: "Hard", tags: ["Backtracking"], description: "Solve a Sudoku puzzle.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "First Missing Positive", difficulty: "Hard", tags: ["Array"], description: "Smallest missing positive integer.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Trapping Rain Water", difficulty: "Hard", tags: ["Stack"], description: "Compute how much water can be trapped.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Wildcard Matching", difficulty: "Hard", tags: ["Dynamic Programming"], description: "Implement wildcard pattern matching.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "N-Queens", difficulty: "Hard", tags: ["Backtracking"], description: "Place n queens on n x n board.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] },
  { title: "Edit Distance", difficulty: "Hard", tags: ["Dynamic Programming"], description: "Find minimum operations to convert word1 to word2.", examples: [], constraints: [], starterCode: { javascript: "", typescript: "", python: "" }, testCases: [] }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected Successfully.");

    // Seed Lessons
    console.log("Seeding Lessons...");
    await Lesson.deleteMany({ category: { $in: ["tailwind", "reactjs", "nextjs"] } });
    await Lesson.insertMany([...TAILWIND_LESSONS, ...REACT_LESSONS, ...NEXTJS_LESSONS]);
    console.log("Seeded Tailwind, React, and Next.js lessons.");

    // Seed Problems
    console.log("Seeding Problems...");
    await Problem.deleteMany({});
    await Problem.insertMany(PROBLEMS);
    console.log(`Seeded ${PROBLEMS.length} problems.`);

    console.log("Seeding Complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding Failed:", err);
    process.exit(1);
  }
}

seed();
