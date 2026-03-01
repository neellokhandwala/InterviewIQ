import React, { useState, useEffect } from 'react';
import { ChevronRight, Code, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import Navbar from '../components/Navbar';
import AnimatedCounter from '../components/AnimatedCounter';

const ProblemsPage = () => {
  const navigate = useNavigate();
  const [visibleProblems, setVisibleProblems] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(false);

  // Sample problems data from LeetCode
  const problems = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      category: 'Array',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.',
    },
    {
      id: 2,
      title: 'Reverse String',
      difficulty: 'Easy',
      category: 'String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    },
    {
      id: 3,
      title: 'Valid Palindrome',
      difficulty: 'Easy',
      category: 'String',
      description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    },
    {
      id: 4,
      title: 'Maximum Subarray',
      difficulty: 'Medium',
      category: 'Array',
      description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    },
    {
      id: 5,
      title: 'Container With Most Water',
      difficulty: 'Medium',
      category: 'Array',
      description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).',
    },
    {
      id: 6,
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      category: 'String',
      description: 'Given a string s, find the length of the longest substring without repeating characters.',
    },
    {
      id: 7,
      title: 'Median of Two Sorted Arrays',
      difficulty: 'Hard',
      category: 'Array',
      description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
    },
    {
      id: 8,
      title: 'Regular Expression Matching',
      difficulty: 'Hard',
      category: 'String',
      description: 'Given an input string s and a pattern p, implement regular expression matching with support for "." and "*".',
    },
    {
      id: 9,
      title: 'Merge K Sorted Lists',
      difficulty: 'Hard',
      category: 'Linked List',
      description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.',
    },
    {
      id: 10,
      title: 'Word Ladder',
      difficulty: 'Hard',
      category: 'Graph',
      description: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words.',
    },
    {
      id: 11,
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      category: 'Dynamic Programming',
      description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps.',
    },
    {
      id: 12,
      title: 'Unique Paths',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: 'There is a robot on an m x n grid. The robot is initially at the top-left corner (grid[0][0]). It wants to reach the bottom-right corner.',
    },
    {
      id: 13,
      title: 'Longest Common Subsequence',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: 'Given two strings text1 and text2, return the length of their longest common subsequence.',
    },
    {
      id: 14,
      title: 'Coin Change',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.',
    },
    {
      id: 15,
      title: 'Word Break II',
      difficulty: 'Hard',
      category: 'Dynamic Programming',
      description: 'Given a string s and a dictionary of strings wordDict, add spaces in s to construct a sentence where each word is a valid dictionary word.',
    },
  ];

  const difficultyStats = {
    easy: problems.filter((p) => p.difficulty === 'Easy').length,
    medium: problems.filter((p) => p.difficulty === 'Medium').length,
    hard: problems.filter((p) => p.difficulty === 'Hard').length,
  };

  // Animate problems in on mount
  useEffect(() => {
    setProblemsLoading(true);
    problems.forEach((problem, index) => {
      setTimeout(() => {
        setVisibleProblems((prev) => [...prev, problem.id]);
      }, index * 50);
    });
    setProblemsLoading(false);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const ProblemCard = ({ problem, isVisible }) => (
    <div
      className={`group bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } hover:shadow-xl hover:shadow-blue-500/10 hover:bg-slate-900/80`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
            <Code className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
              {problem.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className={`px-2 py-1 rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className="text-slate-400">{problem.category}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-400 mb-4 leading-relaxed">{problem.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">Problem #{problem.id}</span>
        <button onClick={() => navigate(`/problems/${problem.id}`)} className="inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold text-green-400 hover:bg-green-500/10 rounded-lg transition-all duration-300 group-hover:gap-2">
          Solve <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen overflow-hidden">
      <Navbar />

      {/* Background accent */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-sm text-slate-300">15 Curated Problems</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold">
            <span className="text-slate-100">Practice </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-green-400">
              Coding Problems
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Sharpen your coding skills with these curated problems. Master algorithms and data structures one problem at a time.
          </p>
        </div>
      </section>

      {/* Problems Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              isVisible={visibleProblems.includes(problem.id)}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100">Problem Breakdown</h2>
          <p className="text-slate-400 mt-2 text-sm">Track your journey across all difficulty levels</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total */}
          <div className="relative group text-center p-6 bg-slate-900/60 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500/20 transition-colors">
                <span className="text-blue-400 text-lg font-bold">#</span>
              </div>
              <div className="text-4xl font-bold text-blue-400 mb-1">{problems.length}</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total</div>
            </div>
          </div>

          {/* Easy */}
          <div className="relative group text-center p-6 bg-slate-900/60 rounded-2xl border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500/20 transition-colors">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
              </div>
              <AnimatedCounter label="" finalValue={String(difficultyStats.easy)} />
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Easy</div>
              <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                  style={{ width: `${(difficultyStats.easy / problems.length) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Medium */}
          <div className="relative group text-center p-6 bg-slate-900/60 rounded-2xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-500/20 transition-colors">
                <div className="w-2.5 h-2.5 bg-orange-400 rounded-full" />
              </div>
              <AnimatedCounter label="" finalValue={String(difficultyStats.medium)} />
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Medium</div>
              <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"
                  style={{ width: `${(difficultyStats.medium / problems.length) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Hard */}
          <div className="relative group text-center p-6 bg-slate-900/60 rounded-2xl border border-slate-700/50 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-red-500/20 transition-colors">
                <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
              </div>
              <AnimatedCounter label="" finalValue={String(difficultyStats.hard)} />
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Hard</div>
              <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full"
                  style={{ width: `${(difficultyStats.hard / problems.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-12 sm:p-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Ready to ace your interviews?</h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Start solving problems today and build the confidence you need for your next coding interview.
          </p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
            Start Solving Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="border-slate-800 flex flex-col sm:flex-row justify-center items-center text-sm text-slate-400">
            <p>&copy; 2026 InterviewIQ by Neel Lokhandwala. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProblemsPage;
