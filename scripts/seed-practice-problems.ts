import connectDB from "../lib/db";
import Problem from "../lib/models/Problem";

type Difficulty = "Easy" | "Medium" | "Hard";

type ProblemSeed = {
  title: string;
  tags: string[];
};

const TAG_SETS = {
  array: ["Array", "Hash Table"],
  string: ["String", "Two Pointers"],
  math: ["Math", "Simulation"],
  stack: ["Stack", "String"],
  tree: ["Tree", "DFS"],
  graph: ["Graph", "BFS"],
  dp: ["Dynamic Programming", "Memoization"],
  greedy: ["Greedy", "Sorting"],
  heap: ["Heap", "Priority Queue"],
  binary: ["Binary Search", "Array"],
};

const EASY_PROBLEMS: ProblemSeed[] = [
  { title: "Two Sum", tags: TAG_SETS.array },
  { title: "Palindrome Number", tags: TAG_SETS.math },
  { title: "Valid Parentheses", tags: TAG_SETS.stack },
  { title: "Merge Sorted Arrays", tags: TAG_SETS.array },
  { title: "Remove Duplicates from Sorted Array", tags: TAG_SETS.array },
  { title: "Search Insert Position", tags: TAG_SETS.binary },
  { title: "Length of Last Word", tags: TAG_SETS.string },
  { title: "Plus One", tags: TAG_SETS.array },
  { title: "Add Binary", tags: TAG_SETS.string },
  { title: "Sqrt Integer", tags: TAG_SETS.binary },
  { title: "Climbing Stairs", tags: TAG_SETS.dp },
  { title: "Remove Element", tags: TAG_SETS.array },
  { title: "First Unique Character", tags: TAG_SETS.string },
  { title: "Valid Anagram", tags: TAG_SETS.string },
  { title: "Contains Duplicate", tags: TAG_SETS.array },
  { title: "Move Zeroes", tags: TAG_SETS.array },
  { title: "Majority Element", tags: TAG_SETS.array },
  { title: "Best Time to Buy Stock", tags: TAG_SETS.greedy },
  { title: "Single Number", tags: TAG_SETS.array },
  { title: "Intersection of Two Arrays", tags: TAG_SETS.array },
  { title: "Reverse String", tags: TAG_SETS.string },
  { title: "Fizz Buzz", tags: TAG_SETS.math },
  { title: "Power of Two", tags: TAG_SETS.math },
  { title: "Happy Number", tags: TAG_SETS.math },
  { title: "Missing Number", tags: TAG_SETS.array },
  { title: "Valid Palindrome", tags: TAG_SETS.string },
  { title: "Isomorphic Strings", tags: TAG_SETS.string },
  { title: "Word Pattern", tags: TAG_SETS.string },
  { title: "Summary Ranges", tags: TAG_SETS.array },
  { title: "Find Pivot Index", tags: TAG_SETS.array },
  { title: "Running Sum of Array", tags: TAG_SETS.array },
  { title: "Richest Customer Wealth", tags: TAG_SETS.array },
  { title: "Number of Good Pairs", tags: TAG_SETS.array },
  { title: "Kids With Candies", tags: TAG_SETS.array },
  { title: "Shuffle the Array", tags: TAG_SETS.array },
  { title: "Jewels and Stones", tags: TAG_SETS.string },
  { title: "Defanging IP Address", tags: TAG_SETS.string },
  { title: "Goal Parser Interpretation", tags: TAG_SETS.string },
  { title: "Maximum Number of Words", tags: TAG_SETS.string },
  { title: "Count Items Matching Rule", tags: TAG_SETS.array },
  { title: "Decode XORed Array", tags: TAG_SETS.array },
  { title: "Find Center of Star Graph", tags: TAG_SETS.graph },
  { title: "Leaf Similar Trees", tags: TAG_SETS.tree },
  { title: "Invert Binary Tree", tags: TAG_SETS.tree },
  { title: "Maximum Depth of Binary Tree", tags: TAG_SETS.tree },
  { title: "Symmetric Tree", tags: TAG_SETS.tree },
  { title: "Same Tree", tags: TAG_SETS.tree },
  { title: "Binary Tree Paths", tags: TAG_SETS.tree },
  { title: "Path Sum", tags: TAG_SETS.tree },
  { title: "Min Stack Basic", tags: TAG_SETS.stack },
  { title: "Queue Using Stacks", tags: TAG_SETS.stack },
  { title: "Implement Stack Using Queues", tags: TAG_SETS.stack },
  { title: "Valid Mountain Array", tags: TAG_SETS.array },
  { title: "Sort Array by Parity", tags: TAG_SETS.array },
  { title: "Height Checker", tags: TAG_SETS.array },
  { title: "Relative Sort Array", tags: TAG_SETS.array },
  { title: "Find Common Characters", tags: TAG_SETS.string },
  { title: "Excel Sheet Column Number", tags: TAG_SETS.math },
  { title: "Roman to Integer", tags: TAG_SETS.string },
  { title: "Pascal Triangle", tags: TAG_SETS.dp },
];

const MEDIUM_PROBLEMS: ProblemSeed[] = [
  { title: "Add Two Numbers", tags: ["Linked List", "Math"] },
  { title: "Longest Substring Without Repeating Characters", tags: ["Sliding Window", "Hash Table"] },
  { title: "Longest Palindromic Substring", tags: TAG_SETS.dp },
  { title: "Container With Most Water", tags: ["Two Pointers", "Greedy"] },
  { title: "Three Sum", tags: ["Two Pointers", "Sorting"] },
  { title: "Letter Combinations of Phone Number", tags: ["Backtracking", "String"] },
  { title: "Generate Parentheses", tags: ["Backtracking", "Recursion"] },
  { title: "Rotate Image", tags: ["Matrix", "Array"] },
  { title: "Group Anagrams", tags: ["Hash Table", "String"] },
  { title: "Maximum Subarray", tags: TAG_SETS.dp },
  { title: "Spiral Matrix", tags: ["Matrix", "Simulation"] },
  { title: "Jump Game", tags: TAG_SETS.greedy },
  { title: "Merge Intervals", tags: ["Intervals", "Sorting"] },
  { title: "Unique Paths", tags: TAG_SETS.dp },
  { title: "Set Matrix Zeroes", tags: ["Matrix", "Array"] },
  { title: "Search 2D Matrix", tags: TAG_SETS.binary },
  { title: "Sort Colors", tags: ["Two Pointers", "Sorting"] },
  { title: "Subsets", tags: ["Backtracking", "Bitmask"] },
  { title: "Word Search", tags: ["Backtracking", "Matrix"] },
  { title: "Decode Ways", tags: TAG_SETS.dp },
  { title: "Validate Binary Search Tree", tags: TAG_SETS.tree },
  { title: "Level Order Traversal", tags: ["Tree", "BFS"] },
  { title: "Construct Binary Tree", tags: TAG_SETS.tree },
  { title: "Flatten Binary Tree", tags: TAG_SETS.tree },
  { title: "Best Time to Buy Stock II", tags: TAG_SETS.greedy },
  { title: "Longest Consecutive Sequence", tags: ["Hash Table", "Union Find"] },
  { title: "Clone Graph", tags: TAG_SETS.graph },
  { title: "Gas Station", tags: TAG_SETS.greedy },
  { title: "Word Break", tags: TAG_SETS.dp },
  { title: "LRU Cache", tags: ["Hash Table", "Design"] },
  { title: "Min Stack Advanced", tags: ["Stack", "Design"] },
  { title: "Evaluate Reverse Polish Notation", tags: TAG_SETS.stack },
  { title: "Maximum Product Subarray", tags: TAG_SETS.dp },
  { title: "Find Minimum in Rotated Sorted Array", tags: TAG_SETS.binary },
  { title: "Search in Rotated Sorted Array", tags: TAG_SETS.binary },
  { title: "Course Schedule", tags: TAG_SETS.graph },
  { title: "Trie Implementation", tags: ["Trie", "Design"] },
  { title: "House Robber", tags: TAG_SETS.dp },
  { title: "Number of Islands", tags: TAG_SETS.graph },
  { title: "Kth Largest Element", tags: TAG_SETS.heap },
  { title: "Combination Sum", tags: ["Backtracking", "Array"] },
  { title: "Permutations", tags: ["Backtracking", "Array"] },
  { title: "Daily Temperatures", tags: ["Stack", "Monotonic Stack"] },
  { title: "Top K Frequent Elements", tags: TAG_SETS.heap },
  { title: "Product of Array Except Self", tags: ["Prefix Sum", "Array"] },
  { title: "Find All Anagrams", tags: ["Sliding Window", "String"] },
  { title: "Subarray Sum Equals K", tags: ["Prefix Sum", "Hash Table"] },
  { title: "Task Scheduler", tags: ["Greedy", "Heap"] },
  { title: "Partition Labels", tags: TAG_SETS.greedy },
  { title: "Accounts Merge", tags: ["Union Find", "Graph"] },
  { title: "Rotting Oranges", tags: TAG_SETS.graph },
  { title: "Pacific Atlantic Water Flow", tags: TAG_SETS.graph },
  { title: "Meeting Rooms II", tags: TAG_SETS.heap },
  { title: "Insert Interval", tags: ["Intervals", "Array"] },
  { title: "Coin Change", tags: TAG_SETS.dp },
  { title: "Target Sum", tags: TAG_SETS.dp },
  { title: "Longest Increasing Subsequence", tags: TAG_SETS.dp },
  { title: "Binary Tree Right Side View", tags: TAG_SETS.tree },
  { title: "Reorder List", tags: ["Linked List", "Two Pointers"] },
  { title: "String Compression", tags: TAG_SETS.string },
];

const HARD_PROBLEMS: ProblemSeed[] = [
  { title: "Median of Two Sorted Arrays", tags: ["Binary Search", "Divide and Conquer"] },
  { title: "Regular Expression Matching", tags: TAG_SETS.dp },
  { title: "Merge K Sorted Lists", tags: TAG_SETS.heap },
  { title: "Reverse Nodes in K Group", tags: ["Linked List", "Recursion"] },
  { title: "Sudoku Solver", tags: ["Backtracking", "Matrix"] },
  { title: "First Missing Positive", tags: ["Array", "In-place"] },
  { title: "Trapping Rain Water", tags: ["Two Pointers", "Stack"] },
  { title: "Wildcard Matching", tags: TAG_SETS.dp },
  { title: "N Queens", tags: ["Backtracking", "Matrix"] },
  { title: "Edit Distance", tags: TAG_SETS.dp },
  { title: "Minimum Window Substring", tags: ["Sliding Window", "Hash Table"] },
  { title: "Largest Rectangle in Histogram", tags: ["Stack", "Monotonic Stack"] },
  { title: "Maximal Rectangle", tags: TAG_SETS.dp },
  { title: "Interleaving String", tags: TAG_SETS.dp },
  { title: "Distinct Subsequences", tags: TAG_SETS.dp },
  { title: "Word Ladder II", tags: TAG_SETS.graph },
  { title: "Palindrome Partitioning II", tags: TAG_SETS.dp },
  { title: "Candy Distribution", tags: TAG_SETS.greedy },
  { title: "Word Break II", tags: ["DP", "Backtracking"] },
  { title: "Max Points on a Line", tags: ["Math", "Hash Table"] },
  { title: "Dungeon Game", tags: TAG_SETS.dp },
  { title: "Best Time to Buy Stock III", tags: TAG_SETS.dp },
  { title: "Binary Tree Maximum Path Sum", tags: TAG_SETS.tree },
  { title: "Serialize and Deserialize Binary Tree", tags: ["Tree", "Design"] },
  { title: "Sliding Window Maximum", tags: ["Deque", "Sliding Window"] },
  { title: "Basic Calculator", tags: ["Stack", "Parsing"] },
  { title: "Shortest Palindrome", tags: ["String", "KMP"] },
  { title: "Burst Balloons", tags: TAG_SETS.dp },
  { title: "Count of Smaller Numbers After Self", tags: ["Fenwick Tree", "Merge Sort"] },
  { title: "Remove Invalid Parentheses", tags: ["BFS", "Backtracking"] },
  { title: "Longest Increasing Path in Matrix", tags: TAG_SETS.dp },
  { title: "Russian Doll Envelopes", tags: TAG_SETS.dp },
  { title: "Design Twitter", tags: ["Design", "Heap"] },
  { title: "Data Stream Median", tags: TAG_SETS.heap },
  { title: "Expression Add Operators", tags: ["Backtracking", "String"] },
  { title: "Alien Dictionary", tags: TAG_SETS.graph },
  { title: "Shortest Distance from All Buildings", tags: TAG_SETS.graph },
  { title: "Reconstruct Itinerary", tags: TAG_SETS.graph },
  { title: "Minimum Cost to Hire Workers", tags: TAG_SETS.heap },
  { title: "Swim in Rising Water", tags: ["Graph", "Dijkstra"] },
  { title: "Cracking the Safe", tags: ["Graph", "Eulerian Path"] },
  { title: "Race Car", tags: TAG_SETS.dp },
  { title: "Minimum Number of Refueling Stops", tags: TAG_SETS.heap },
  { title: "Super Egg Drop", tags: TAG_SETS.dp },
  { title: "Shortest Path Visiting All Nodes", tags: ["Graph", "Bitmask"] },
  { title: "K Empty Slots", tags: ["Ordered Set", "Sliding Window"] },
  { title: "Palindrome Pairs", tags: ["Trie", "String"] },
  { title: "Count Vowels Permutation", tags: TAG_SETS.dp },
  { title: "Minimum Window Subsequence", tags: TAG_SETS.dp },
  { title: "Number of Atoms", tags: ["Stack", "Parsing"] },
  { title: "Critical Connections in Network", tags: ["Graph", "Tarjan"] },
  { title: "Cherry Pickup", tags: TAG_SETS.dp },
  { title: "Frog Jump", tags: TAG_SETS.dp },
  { title: "Maximum Profit in Job Scheduling", tags: TAG_SETS.dp },
  { title: "Find Median from Data Stream", tags: TAG_SETS.heap },
  { title: "Minimum Cost to Cut a Stick", tags: TAG_SETS.dp },
  { title: "Stone Game III", tags: TAG_SETS.dp },
  { title: "Shortest Common Supersequence", tags: TAG_SETS.dp },
  { title: "Minimum Insertion Steps to Palindrome", tags: TAG_SETS.dp },
  { title: "Word Search II", tags: ["Trie", "Backtracking"] },
];

function toFunctionName(title: string) {
  const words = title.replace(/[^a-zA-Z0-9 ]/g, " ").trim().split(/\s+/);
  return words
    .map((word, index) => {
      const normalized = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      return index === 0 ? normalized.charAt(0).toLowerCase() + normalized.slice(1) : normalized;
    })
    .join("");
}

function createProblem(problem: ProblemSeed, difficulty: Difficulty, order: number) {
  const functionName = toFunctionName(problem.title);
  const difficultyRank = difficulty === "Easy" ? 1 : difficulty === "Medium" ? 2 : 3;

  return {
    title: problem.title,
    difficulty,
    difficultyRank,
    order,
    tags: problem.tags,
    description: `${problem.title} is a ${difficulty} practice challenge. Read the input carefully, design an efficient algorithm, and return the expected output. Focus areas: ${problem.tags.join(", ")}.\n\nYour task is to implement the function with clean logic and handle edge cases.`,
    examples: [
      {
        input: "input = sampleData",
        output: "expectedResult",
        explanation: "The function should transform the sample input into the expected result using the required algorithm.",
      },
      {
        input: "input = edgeCase",
        output: "edgeResult",
        explanation: "Edge cases should be handled without crashing or returning invalid output.",
      },
    ],
    constraints: [
      "Use the function signature provided in the editor.",
      "Return the answer instead of printing it.",
      "Handle empty, small, and boundary inputs.",
      difficulty === "Easy" ? "Aim for clear O(n) or O(n log n) logic." : difficulty === "Medium" ? "Optimize beyond brute force when possible." : "Choose an advanced algorithm and justify complexity.",
    ],
    starterCode: {
      javascript: `function ${functionName}(input) {\n  // Write your JavaScript solution here\n  return null;\n}`,
      python: `def ${functionName}(input):\n    # Write your Python solution here\n    return None`,
      typescript: `function ${functionName}(input: unknown): unknown {\n  // Write your TypeScript solution here\n  return null;\n}`,
    },
    testCases: [
      { input: "sampleData", expectedOutput: "expectedResult", isPublic: true },
      { input: "edgeCase", expectedOutput: "edgeResult", isPublic: true },
      { input: "hiddenCase", expectedOutput: "hiddenResult", isPublic: false },
    ],
    acceptedCount: Math.floor(80 + order * (difficultyRank === 1 ? 21 : difficultyRank === 2 ? 13 : 8)),
    submissionsCount: Math.floor(180 + order * (difficultyRank === 1 ? 35 : difficultyRank === 2 ? 25 : 18)),
  };
}

export async function seedPracticeProblems() {
  await connectDB();
  const problems = [
    ...EASY_PROBLEMS.map((problem, index) => createProblem(problem, "Easy", index + 1)),
    ...MEDIUM_PROBLEMS.map((problem, index) => createProblem(problem, "Medium", index + 1)),
    ...HARD_PROBLEMS.map((problem, index) => createProblem(problem, "Hard", index + 1)),
  ];

  await Problem.collection.deleteMany({});
  await Problem.collection.insertMany(problems);

  return {
    success: true,
    count: problems.length,
    easy: EASY_PROBLEMS.length,
    medium: MEDIUM_PROBLEMS.length,
    hard: HARD_PROBLEMS.length,
  };
}
