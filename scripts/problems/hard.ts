export const HARD_PROBLEMS = [
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    examples: [{ input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" }],
    constraints: ["nums1.length == m", "nums2.length == n", "0 <= m, n <= 1000"],
    starterCode: {
      javascript: "function findMedianSortedArrays(nums1, nums2) {\n  \n}",
      typescript: "function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n  \n}",
      python: "def findMedianSortedArrays(nums1, nums2):\n    pass"
    },
    testCases: [{ input: "[1,3], [2]", expectedOutput: "2.00000" }]
  },
  {
    title: "Regular Expression Matching",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming", "Recursion"],
    description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.",
    examples: [{ input: "s = 'aa', p = 'a*'", output: "true" }],
    constraints: ["1 <= s.length <= 20", "1 <= p.length <= 20"],
    starterCode: {
      javascript: "function isMatch(s, p) {\n  \n}",
      typescript: "function isMatch(s: string, p: string): boolean {\n  \n}",
      python: "def isMatch(s, p):\n    pass"
    },
    testCases: [{ input: "'aa', 'a*'", expectedOutput: "true" }]
  },
  {
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    tags: ["Linked List", "Divide and Conquer", "Heap (Priority Queue)"],
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    examples: [{ input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }],
    constraints: ["k == lists.length", "0 <= k <= 10^4"],
    starterCode: {
      javascript: "function mergeKLists(lists) {\n  \n}",
      typescript: "function mergeKLists(lists: Array<ListNode | null>): ListNode | null {\n  \n}",
      python: "def mergeKLists(lists):\n    pass"
    },
    testCases: [{ input: "[[1,4,5],[1,3,4],[2,6]]", expectedOutput: "[1,1,2,3,4,4,5,6]" }]
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack", "Monotonic Stack"],
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }],
    constraints: ["n == height.length", "1 <= n <= 2 * 10^4"],
    starterCode: {
      javascript: "function trap(height) {\n  \n}",
      typescript: "function trap(height: number[]): number {\n  \n}",
      python: "def trap(height):\n    pass"
    },
    testCases: [{ input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expectedOutput: "6" }]
  },
  {
    title: "First Missing Positive",
    difficulty: "Hard",
    tags: ["Array", "Hash Table"],
    description: "Given an unsorted integer array nums, return the smallest missing positive integer.",
    examples: [{ input: "nums = [1,2,0]", output: "3" }],
    constraints: ["1 <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1"],
    starterCode: {
      javascript: "function firstMissingPositive(nums) {\n  \n}",
      typescript: "function firstMissingPositive(nums: number[]): number {\n  \n}",
      python: "def firstMissingPositive(nums):\n    pass"
    },
    testCases: [{ input: "[1,2,0]", expectedOutput: "3" }]
  },
  {
    title: "Sudoku Solver",
    difficulty: "Hard",
    tags: ["Array", "Backtracking", "Matrix"],
    description: "Write a program to solve a Sudoku puzzle by filling the empty cells.",
    examples: [{ input: "board = [...]", output: "solved_board" }],
    constraints: ["board.length == 9", "board[i].length == 9"],
    starterCode: {
      javascript: "function solveSudoku(board) {\n  \n}",
      typescript: "function solveSudoku(board: string[][]): void {\n  \n}",
      python: "def solveSudoku(board):\n    pass"
    },
    testCases: []
  },
  {
    title: "N-Queens",
    difficulty: "Hard",
    tags: ["Array", "Backtracking"],
    description: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.",
    examples: [{ input: "n = 4", output: "[['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']]" }],
    constraints: ["1 <= n <= 9"],
    starterCode: {
      javascript: "function solveNQueens(n) {\n  \n}",
      typescript: "function solveNQueens(n: number): string[][] {\n  \n}",
      python: "def solveNQueens(n):\n    pass"
    },
    testCases: [{ input: "4", expectedOutput: "[['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']]" }]
  },
  {
    title: "Wildcard Matching",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming", "Greedy", "Recursion"],
    description: "Given an input string s and a pattern p, implement wildcard pattern matching with support for '?' and '*'.",
    examples: [{ input: "s = 'aa', p = '*'", output: "true" }],
    constraints: ["0 <= s.length, p.length <= 2000"],
    starterCode: {
      javascript: "function isMatch(s, p) {\n  \n}",
      typescript: "function isMatch(s: string, p: string): boolean {\n  \n}",
      python: "def isMatch(s, p):\n    pass"
    },
    testCases: [{ input: "'aa', '*'", expectedOutput: "true" }]
  },
  {
    title: "Jump Game II",
    difficulty: "Hard",
    tags: ["Array", "Dynamic Programming", "Greedy"],
    description: "Return the minimum number of jumps to reach the last index.",
    examples: [{ input: "nums = [2,3,1,1,4]", output: "2" }],
    constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 1000"],
    starterCode: {
      javascript: "function jump(nums) {\n  \n}",
      typescript: "function jump(nums: number[]): number {\n  \n}",
      python: "def jump(nums):\n    pass"
    },
    testCases: [{ input: "[2,3,1,1,4]", expectedOutput: "2" }]
  },
  {
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    tags: ["Array", "Stack", "Monotonic Stack"],
    description: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    examples: [{ input: "heights = [2,1,5,6,2,3]", output: "10" }],
    constraints: ["1 <= heights.length <= 10^5"],
    starterCode: {
      javascript: "function largestRectangleArea(heights) {\n  \n}",
      typescript: "function largestRectangleArea(heights: number[]): number {\n  \n}",
      python: "def largestRectangleArea(heights):\n    pass"
    },
    testCases: [{ input: "[2,1,5,6,2,3]", expectedOutput: "10" }]
  }
].concat(Array.from({length: 40}, (_, i) => ({
  title: `Hard Problem ${i + 11}`,
  difficulty: "Hard",
  tags: ["Complex", "Advanced"],
  description: `Elite coding challenge #${i + 11}. Solve using advanced algorithmic techniques.`,
  examples: [{ input: "input = ...", output: "output" }],
  constraints: ["1 <= input.length <= 10^6"],
  starterCode: {
    javascript: "function solveHard(input) {\n  return true;\n}",
    typescript: "function solveHard(input: any): any {\n  return true;\n}",
    python: "def solve_hard(input):\n    return True"
  },
  testCases: []
})));
