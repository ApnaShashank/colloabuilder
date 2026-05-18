export const MEDIUM_PROBLEMS = [
  {
    title: "3Sum",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    description: "Find all unique triplets in the array which gives the sum of zero.",
    examples: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }],
    constraints: ["3 <= nums.length <= 3000"],
    starterCode: {
      javascript: "function threeSum(nums) {\n  \n}",
      typescript: "function threeSum(nums: number[]): number[][] {\n  \n}",
      python: "def threeSum(nums):\n    pass"
    },
    testCases: [{ input: "[-1,0,1,2,-1,-4]", expectedOutput: "[[-1,-1,2],[-1,0,1]]" }]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window"],
    description: "Find the length of the longest substring without repeating characters.",
    examples: [{ input: "s = 'abcabcbb'", output: "3" }],
    constraints: ["0 <= s.length <= 5*10^4"],
    starterCode: {
      javascript: "function lengthOfLongestSubstring(s) {\n  \n}",
      typescript: "function lengthOfLongestSubstring(s: string): number {\n  \n}",
      python: "def lengthOfLongestSubstring(s):\n    pass"
    },
    testCases: [{ input: "'abcabcbb'", expectedOutput: "3" }]
  },
  {
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math"],
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    examples: [{ input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]" }],
    constraints: ["The number of nodes in each linked list is in the range [1, 100]."],
    starterCode: {
      javascript: "function addTwoNumbers(l1, l2) {\n  \n}",
      typescript: "function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {\n  \n}",
      python: "def addTwoNumbers(l1, l2):\n    pass"
    },
    testCases: [{ input: "[2,4,3], [5,6,4]", expectedOutput: "[7,0,8]" }]
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Greedy"],
    description: "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    examples: [{ input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" }],
    constraints: ["n == height.length", "2 <= n <= 10^5"],
    starterCode: {
      javascript: "function maxArea(height) {\n  \n}",
      typescript: "function maxArea(height: number[]): number {\n  \n}",
      python: "def maxArea(height):\n    pass"
    },
    testCases: [{ input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49" }]
  },
  {
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Backtracking"],
    description: "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.",
    examples: [{ input: "digits = '23'", output: "['ad','ae','af','bd','be','bf','cd','ce','cf']" }],
    constraints: ["0 <= digits.length <= 4"],
    starterCode: {
      javascript: "function letterCombinations(digits) {\n  \n}",
      typescript: "function letterCombinations(digits: string): string[] {\n  \n}",
      python: "def letterCombinations(digits):\n    pass"
    },
    testCases: [{ input: "'23'", expectedOutput: "['ad','ae','af','bd','be','bf','cd','ce','cf']" }]
  },
  {
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    tags: ["Linked List", "Two Pointers"],
    description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    examples: [{ input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" }],
    constraints: ["The number of nodes in the list is sz.", "1 <= sz <= 30"],
    starterCode: {
      javascript: "function removeNthFromEnd(head, n) {\n  \n}",
      typescript: "function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {\n  \n}",
      python: "def removeNthFromEnd(head, n):\n    pass"
    },
    testCases: [{ input: "[1,2,3,4,5], 2", expectedOutput: "[1,2,3,5]" }]
  },
  {
    title: "Generate Parentheses",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming", "Backtracking"],
    description: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    examples: [{ input: "n = 3", output: "['((()))','(()())','(())()','()(())','()()()']" }],
    constraints: ["1 <= n <= 8"],
    starterCode: {
      javascript: "function generateParenthesis(n) {\n  \n}",
      typescript: "function generateParenthesis(n: number): string[] {\n  \n}",
      python: "def generateParenthesis(n):\n    pass"
    },
    testCases: [{ input: "3", expectedOutput: "['((()))','(()())','(())()','()(())','()()()']" }]
  },
  {
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    description: "Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
    examples: [{ input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" }],
    constraints: ["1 <= nums.length <= 5000", "-10^4 <= target <= 10^4"],
    starterCode: {
      javascript: "function search(nums, target) {\n  \n}",
      typescript: "function search(nums: number[], target: number): number {\n  \n}",
      python: "def search(nums, target):\n    pass"
    },
    testCases: [{ input: "[4,5,6,7,0,1,2], 0", expectedOutput: "4" }]
  },
  {
    title: "Find First and Last Position of Element in Sorted Array",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    description: "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.",
    examples: [{ input: "nums = [5,7,7,8,8,10], target = 8", output: "[3,4]" }],
    constraints: ["0 <= nums.length <= 10^5", "-10^9 <= target <= 10^9"],
    starterCode: {
      javascript: "function searchRange(nums, target) {\n  \n}",
      typescript: "function searchRange(nums: number[], target: number): number[] {\n  \n}",
      python: "def searchRange(nums, target):\n    pass"
    },
    testCases: [{ input: "[5,7,7,8,8,10], 8", expectedOutput: "[3,4]" }]
  },
  {
    title: "Valid Sudoku",
    difficulty: "Medium",
    tags: ["Array", "Hash Table", "Matrix"],
    description: "Determine if a 9 x 9 Sudoku board is valid.",
    examples: [{ input: "board = [...]", output: "true" }],
    constraints: ["board.length == 9", "board[i].length == 9"],
    starterCode: {
      javascript: "function isValidSudoku(board) {\n  \n}",
      typescript: "function isValidSudoku(board: string[][]): boolean {\n  \n}",
      python: "def isValidSudoku(board):\n    pass"
    },
    testCases: []
  }
].concat(Array.from({length: 40}, (_, i) => ({
  title: `Medium Problem ${i + 11}`,
  difficulty: "Medium",
  tags: ["Algorithm", "Intermediate"],
  description: `Master complex logic problem #${i + 11}. Utilize efficient data structures.`,
  examples: [{ input: "data = [...]", output: "result" }],
  constraints: ["1 <= data.length <= 10^4"],
  starterCode: {
    javascript: "function solveMedium(data) {\n  return true;\n}",
    typescript: "function solveMedium(data: any): any {\n  return true;\n}",
    python: "def solve_medium(data):\n    return True"
  },
  testCases: []
})));
