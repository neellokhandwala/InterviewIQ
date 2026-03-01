export const PROBLEMS_DATA = {
  1: {
    id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Array',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 9.' },
      { input: 'nums = [3,2,4], target = 6',     output: '[1,2]', explanation: 'nums[1] + nums[2] = 6.' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists.'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function twoSum(nums, target) {\n    // Your solution here\n}`,
      python: `def twoSum(nums, target):\n    # Your solution here\n    pass`,
      java: `import java.util.*;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your solution here\n        return new int[]{};\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(Arrays.toString(sol.twoSum(new int[]{2,7,11,15}, 9)));\n        System.out.println(Arrays.toString(sol.twoSum(new int[]{3,2,4}, 6)));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(JSON.stringify(twoSum([2,7,11,15], 9)));\nconsole.log(JSON.stringify(twoSum([3,2,4], 6)));`,
      python: `\nprint(twoSum([2, 7, 11, 15], 9))\nprint(twoSum([3, 2, 4], 6))`,
    },
    expectedOutput: {
      javascript: `[0,1]\n[1,2]`,
      python: `[0, 1]\n[1, 2]`,
      java: `[0, 1]\n[1, 2]`,
    },
  },
  2: {
    id: 2, title: 'Reverse String', difficulty: 'Easy', category: 'String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s. You must do this in-place with O(1) extra memory.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: 'Reverse the array in-place.' },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁵', 's[i] is a printable ASCII character.'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function reverseString(s) {\n    // Your solution here\n}`,
      python: `def reverseString(s):\n    # Your solution here\n    pass`,
      java: `import java.util.*;\nclass Solution {\n    public void reverseString(char[] s) {\n        // Your solution here\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        char[] s = {'h','e','l','l','o'};\n        sol.reverseString(s);\n        System.out.println(Arrays.toString(s));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconst s = ["h","e","l","l","o"];\nreverseString(s);\nconsole.log(JSON.stringify(s));`,
      python: `\ns = ["h","e","l","l","o"]\nreverseString(s)\nprint(s)`,
    },
    expectedOutput: {
      javascript: `["o","l","l","e","h"]`,
      python: `['o', 'l', 'l', 'e', 'h']`,
      java: `[o, l, l, e, h]`,
    },
  },
  3: {
    id: 3, title: 'Valid Palindrome', difficulty: 'Easy', category: 'String',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true',  explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"',                     output: 'false', explanation: '"raceacar" is not a palindrome.' },
    ],
    constraints: ['1 ≤ s.length ≤ 2×10⁵'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function isPalindrome(s) {\n    // Your solution here\n}`,
      python: `def isPalindrome(s):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        // Your solution here\n        return false;\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.isPalindrome("A man, a plan, a canal: Panama"));\n        System.out.println(sol.isPalindrome("race a car"));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(isPalindrome("A man, a plan, a canal: Panama"));\nconsole.log(isPalindrome("race a car"));`,
      python: `\nprint(isPalindrome("A man, a plan, a canal: Panama"))\nprint(isPalindrome("race a car"))`,
    },
    expectedOutput: {
      javascript: `true\nfalse`,
      python: `True\nFalse`,
      java: `true\nfalse`,
    },
  },
  4: {
    id: 4, title: 'Maximum Subarray', difficulty: 'Medium', category: 'Array',
    description: 'Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has the largest sum = 6.' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function maxSubArray(nums) {\n    // Your solution here\n}`,
      python: `def maxSubArray(nums):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4}));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));`,
      python: `\nprint(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))`,
    },
    expectedOutput: { javascript: `6`, python: `6`, java: `6` },
  },
  5: {
    id: 5, title: 'Container With Most Water', difficulty: 'Medium', category: 'Array',
    description: 'Given an integer array height, find two lines that together with the x-axis form a container that holds the most water. Return the maximum water.',
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Lines at index 1 and 8 form the max container.' },
    ],
    constraints: ['2 ≤ n ≤ 10⁵', '0 ≤ height[i] ≤ 10⁴'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function maxArea(height) {\n    // Your solution here\n}`,
      python: `def maxArea(height):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public int maxArea(int[] height) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.maxArea(new int[]{1,8,6,2,5,4,8,3,7}));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(maxArea([1,8,6,2,5,4,8,3,7]));`,
      python: `\nprint(maxArea([1,8,6,2,5,4,8,3,7]))`,
    },
    expectedOutput: { javascript: `49`, python: `49`, java: `49` },
  },
  6: {
    id: 6, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', category: 'String',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: '"abc" has length 3.' },
      { input: 's = "bbbbb"',    output: '1', explanation: '"b" has length 1.' },
    ],
    constraints: ['0 ≤ s.length ≤ 5×10⁴'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n    // Your solution here\n}`,
      python: `def lengthOfLongestSubstring(s):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.lengthOfLongestSubstring("abcabcbb"));\n        System.out.println(sol.lengthOfLongestSubstring("bbbbb"));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(lengthOfLongestSubstring("abcabcbb"));\nconsole.log(lengthOfLongestSubstring("bbbbb"));`,
      python: `\nprint(lengthOfLongestSubstring("abcabcbb"))\nprint(lengthOfLongestSubstring("bbbbb"))`,
    },
    expectedOutput: { javascript: `3\n1`, python: `3\n1`, java: `3\n1` },
  },
  7: {
    id: 7, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', category: 'Array',
    description: 'Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays. Overall run time complexity should be O(log(m+n)).',
    examples: [
      { input: 'nums1=[1,3], nums2=[2]',   output: '2.00000', explanation: 'Merged=[1,2,3], median=2.' },
      { input: 'nums1=[1,2], nums2=[3,4]', output: '2.50000', explanation: 'Merged=[1,2,3,4], median=2.5.' },
    ],
    constraints: ['0 ≤ m,n ≤ 1000', '1 ≤ m+n ≤ 2000'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n    // Your solution here\n}`,
      python: `def findMedianSortedArrays(nums1, nums2):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Your solution here\n        return 0.0;\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.findMedianSortedArrays(new int[]{1,3}, new int[]{2}));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(findMedianSortedArrays([1,3],[2]));`,
      python: `\nprint(findMedianSortedArrays([1,3],[2]))`,
    },
    expectedOutput: { javascript: `2`, python: `2.0`, java: `2.0` },
  },
  8: {
    id: 8, title: 'Regular Expression Matching', difficulty: 'Hard', category: 'String',
    description: 'Implement regular expression matching with support for "." (matches any single character) and "*" (matches zero or more of the preceding element).',
    examples: [
      { input: 's="aa", p="a"',  output: 'false', explanation: '"a" does not match "aa".' },
      { input: 's="aa", p="a*"', output: 'true',  explanation: '"a*" matches zero or more "a"s.' },
    ],
    constraints: ['1 ≤ s.length ≤ 20', '1 ≤ p.length ≤ 30'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function isMatch(s, p) {\n    // Your solution here\n}`,
      python: `def isMatch(s, p):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public boolean isMatch(String s, String p) {\n        // Your solution here\n        return false;\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.isMatch("aa","a"));\n        System.out.println(sol.isMatch("aa","a*"));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(isMatch("aa","a"));\nconsole.log(isMatch("aa","a*"));`,
      python: `\nprint(isMatch("aa","a"))\nprint(isMatch("aa","a*"))`,
    },
    expectedOutput: { javascript: `false\ntrue`, python: `False\nTrue`, java: `false\ntrue` },
  },
  9: {
    id: 9, title: 'Merge K Sorted Lists', difficulty: 'Hard', category: 'Linked List',
    description: 'You are given an array of k linked-lists, each sorted in ascending order. Merge all into one sorted linked-list and return it.',
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'Merge all lists into one sorted list.' },
    ],
    constraints: ['0 ≤ k ≤ 10⁴', '0 ≤ lists[i].length ≤ 500'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function mergeKLists(lists) {\n    // lists is array of sorted arrays for simplicity\n    // Your solution here\n}`,
      python: `def mergeKLists(lists):\n    # lists is array of sorted arrays for simplicity\n    # Your solution here\n    pass`,
      java: `import java.util.*;\nclass Solution {\n    public List<Integer> mergeKLists(List<List<Integer>> lists) {\n        // Your solution here\n        return new ArrayList<>();\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        List<List<Integer>> lists = Arrays.asList(\n            Arrays.asList(1,4,5), Arrays.asList(1,3,4), Arrays.asList(2,6)\n        );\n        System.out.println(sol.mergeKLists(lists));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(JSON.stringify(mergeKLists([[1,4,5],[1,3,4],[2,6]])));`,
      python: `\nprint(mergeKLists([[1,4,5],[1,3,4],[2,6]]))`,
    },
    expectedOutput: { javascript: `[1,1,2,3,4,4,5,6]`, python: `[1, 1, 2, 3, 4, 4, 5, 6]`, java: `[1, 1, 2, 3, 4, 4, 5, 6]` },
  },
  10: {
    id: 10, title: 'Word Ladder', difficulty: 'Hard', category: 'Graph',
    description: 'Given beginWord, endWord, and a wordList, return the number of words in the shortest transformation sequence from beginWord to endWord. Return 0 if no sequence exists.',
    examples: [
      { input: 'beginWord="hit", endWord="cog", wordList=["hot","dot","dog","lot","log","cog"]', output: '5', explanation: '"hit"→"hot"→"dot"→"dog"→"cog"' },
    ],
    constraints: ['1 ≤ beginWord.length ≤ 10', 'endWord.length == beginWord.length'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function ladderLength(beginWord, endWord, wordList) {\n    // Your solution here\n}`,
      python: `def ladderLength(beginWord, endWord, wordList):\n    # Your solution here\n    pass`,
      java: `import java.util.*;\nclass Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.ladderLength("hit","cog",Arrays.asList("hot","dot","dog","lot","log","cog")));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(ladderLength("hit","cog",["hot","dot","dog","lot","log","cog"]));`,
      python: `\nprint(ladderLength("hit","cog",["hot","dot","dog","lot","log","cog"]))`,
    },
    expectedOutput: { javascript: `5`, python: `5`, java: `5` },
  },
  11: {
    id: 11, title: 'Climbing Stairs', difficulty: 'Easy', category: 'Dynamic Programming',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1.' },
    ],
    constraints: ['1 ≤ n ≤ 45'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function climbStairs(n) {\n    // Your solution here\n}`,
      python: `def climbStairs(n):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public int climbStairs(int n) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.climbStairs(2));\n        System.out.println(sol.climbStairs(3));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(climbStairs(2));\nconsole.log(climbStairs(3));`,
      python: `\nprint(climbStairs(2))\nprint(climbStairs(3))`,
    },
    expectedOutput: { javascript: `2\n3`, python: `2\n3`, java: `2\n3` },
  },
  12: {
    id: 12, title: 'Unique Paths', difficulty: 'Medium', category: 'Dynamic Programming',
    description: 'A robot is on an m×n grid at the top-left corner. It can only move right or down. How many unique paths are there to reach the bottom-right corner?',
    examples: [
      { input: 'm=3, n=7', output: '28', explanation: '28 unique paths.' },
    ],
    constraints: ['1 ≤ m,n ≤ 100'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function uniquePaths(m, n) {\n    // Your solution here\n}`,
      python: `def uniquePaths(m, n):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public int uniquePaths(int m, int n) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.uniquePaths(3, 7));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(uniquePaths(3, 7));`,
      python: `\nprint(uniquePaths(3, 7))`,
    },
    expectedOutput: { javascript: `28`, python: `28`, java: `28` },
  },
  13: {
    id: 13, title: 'Longest Common Subsequence', difficulty: 'Medium', category: 'Dynamic Programming',
    description: 'Given two strings text1 and text2, return the length of their longest common subsequence. Return 0 if there is none.',
    examples: [
      { input: 'text1="abcde", text2="ace"', output: '3', explanation: 'LCS is "ace" with length 3.' },
    ],
    constraints: ['1 ≤ text1.length, text2.length ≤ 1000'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function longestCommonSubsequence(text1, text2) {\n    // Your solution here\n}`,
      python: `def longestCommonSubsequence(text1, text2):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.longestCommonSubsequence("abcde","ace"));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(longestCommonSubsequence("abcde","ace"));`,
      python: `\nprint(longestCommonSubsequence("abcde","ace"))`,
    },
    expectedOutput: { javascript: `3`, python: `3`, java: `3` },
  },
  14: {
    id: 14, title: 'Coin Change', difficulty: 'Medium', category: 'Dynamic Programming',
    description: 'Given an array of coins and an amount, return the fewest coins needed to make up that amount. Return -1 if it cannot be achieved.',
    examples: [
      { input: 'coins=[1,5,10], amount=11', output: '2', explanation: '10+1 = 11, using 2 coins.' },
    ],
    constraints: ['1 ≤ coins.length ≤ 12', '0 ≤ amount ≤ 10⁴'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function coinChange(coins, amount) {\n    // Your solution here\n}`,
      python: `def coinChange(coins, amount):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.coinChange(new int[]{1,5,10}, 11));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(coinChange([1,5,10], 11));`,
      python: `\nprint(coinChange([1,5,10], 11))`,
    },
    expectedOutput: { javascript: `2`, python: `2`, java: `2` },
  },
  15: {
    id: 15, title: 'Word Break II', difficulty: 'Hard', category: 'Dynamic Programming',
    description: 'Given a string s and a dictionary wordDict, add spaces in s to construct sentences where each word is a valid dictionary word. Return all such possible sentences.',
    examples: [
      { input: 's="catsanddog", wordDict=["cat","cats","and","sand","dog"]', output: '["cats and dog","cat sand dog"]', explanation: 'Both are valid sentences.' },
    ],
    constraints: ['1 ≤ s.length ≤ 20', '1 ≤ wordDict.length ≤ 1000'],
    timeLimit: '1 second', memoryLimit: '256 MB',
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {\n    // Your solution here\n}`,
      python: `def wordBreak(s, wordDict):\n    # Your solution here\n    pass`,
      java: `import java.util.*;\nclass Solution {\n    public List<String> wordBreak(String s, List<String> wordDict) {\n        // Your solution here\n        return new ArrayList<>();\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.wordBreak("catsanddog", Arrays.asList("cat","cats","and","sand","dog")));\n    }\n}`,
    },
    testRunner: {
      javascript: `\nconsole.log(JSON.stringify(wordBreak("catsanddog",["cat","cats","and","sand","dog"])));`,
      python: `\nprint(wordBreak("catsanddog",["cat","cats","and","sand","dog"]))`,
    },
    expectedOutput: { javascript: `["cats and dog","cat sand dog"]`, python: `['cats and dog', 'cat sand dog']`, java: `[cats and dog, cat sand dog]` },
  },
};