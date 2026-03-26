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
    const styles = {
      Easy: { backgroundColor: 'rgba(101, 163, 13, 0.12)', color: '#65A30D', borderColor: 'rgba(101, 163, 13, 0.25)' },
      Medium: { backgroundColor: 'rgba(217, 119, 6, 0.12)', color: '#D97706', borderColor: 'rgba(217, 119, 6, 0.25)' },
      Hard: { backgroundColor: 'rgba(220, 38, 38, 0.12)', color: '#DC2626', borderColor: 'rgba(220, 38, 38, 0.25)' },
    };
    return styles[difficulty] || { backgroundColor: 'rgba(107, 94, 82, 0.12)', color: '#6B5E52', borderColor: 'rgba(107, 94, 82, 0.25)' };
  };

  const ProblemCard = ({ problem, isVisible }) => {
    const diffColor = getDifficultyColor(problem.difficulty);
    return (
      <div
        className={`group rounded-xl p-6 transition-all duration-500 transform border ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ 
          backgroundColor: 'var(--bg-surface)', 
          borderColor: 'var(--border)',
          boxShadow: isVisible ? `0 10px 25px var(--accent-glow)` : 'none'
        }}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-glow) 50%, transparent)' }}>
              <Code className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
                {problem.title}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="px-2 py-1 rounded-full border transition-colors duration-200" style={{ ...diffColor, borderWidth: '1px', borderStyle: 'solid' }}>
                  {problem.difficulty}
                </span>
                <span transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>{problem.category}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm mb-4 leading-relaxed transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>{problem.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Problem #{problem.id}</span>
          <button onClick={() => navigate(`/problems/${problem.id}`)} className="inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-lg transition-all duration-300 group-hover:gap-2" style={{ color: 'var(--accent)', backgroundColor: 'transparent', border: 'none' }}>
            Solve <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden transition-colors duration-200" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <Navbar />

      {/* Background accent */}
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl -z-10" style={{ backgroundColor: 'rgba(217,119,6,0.05)' }}></div>

      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors duration-200" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
            <Zap className="w-4 h-4" style={{ color: 'var(--success)' }} />
            <span className="text-sm transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>15 Curated Problems</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold">
            <span style={{ color: 'var(--text-primary)' }}>Practice </span>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--accent-bright), var(--accent), var(--accent-bright))' }}>
              Coding Problems
            </span>
          </h1>
          <p className="text-xl max-w-2xl transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
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
          <h2 className="text-3xl font-bold transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>Problem Breakdown</h2>
          <p className="mt-2 text-sm transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>Track your journey across all difficulty levels</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total */}
          <div className="relative group text-center p-6 rounded-2xl border transition-all duration-300 overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to bottom right, var(--accent-glow), transparent)' }} />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-glow) 50%, transparent)', color: 'var(--accent)' }}>
                <span className="text-lg font-bold">#</span>
              </div>
              <div className="text-4xl font-bold mb-1" style={{ color: 'var(--accent-bright)' }}>{problems.length}</div>
              <div className="text-xs font-medium uppercase tracking-wider transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Total</div>
            </div>
          </div>

          {/* Easy */}
          <div className="relative group text-center p-6 rounded-2xl border transition-all duration-300 overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to bottom right, rgba(101,163,13,0.1), transparent)' }} />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--success) 10%, transparent)' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
              </div>
              <AnimatedCounter label="" finalValue={String(difficultyStats.easy)} />
              <div className="text-xs font-medium uppercase tracking-wider mt-1 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Easy</div>
              <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ background: 'linear-gradient(to right, var(--success), #86efac)', width: `${(difficultyStats.easy / problems.length) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Medium */}
          <div className="relative group text-center p-6 rounded-2xl border transition-all duration-300 overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to bottom right, rgba(217,119,6,0.1), transparent)' }} />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--warning) 10%, transparent)' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--warning)' }} />
              </div>
              <AnimatedCounter label="" finalValue={String(difficultyStats.medium)} />
              <div className="text-xs font-medium uppercase tracking-wider mt-1 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Medium</div>
              <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ background: 'linear-gradient(to right, var(--warning), #fcd34d)', width: `${(difficultyStats.medium / problems.length) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Hard */}
          <div className="relative group text-center p-6 rounded-2xl border transition-all duration-300 overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to bottom right, rgba(220,38,38,0.1), transparent)' }} />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--danger) 10%, transparent)' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--danger)' }} />
              </div>
              <AnimatedCounter label="" finalValue={String(difficultyStats.hard)} />
              <div className="text-xs font-medium uppercase tracking-wider mt-1 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Hard</div>
              <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ background: 'linear-gradient(to right, var(--danger), #fca5a5)', width: `${(difficultyStats.hard / problems.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="rounded-2xl p-12 sm:p-16 text-center border transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-dim) 50%, transparent)', borderColor: 'var(--border-accent)' }}>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>Ready to ace your interviews?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
            Start solving problems today and build the confidence you need for your next coding interview.
          </p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-8 py-3 text-black font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105" style={{ background: 'var(--gradient-gold)', boxShadow: `0 4px 20px var(--accent-glow)` }}>
            Start Solving Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="transition-colors duration-200" style={{ borderColor: 'var(--border)', borderTopWidth: '1px', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 50%, transparent)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-center items-center text-sm transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>
            <p>&copy; 2026 InterviewIQ by Neel Lokhandwala. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProblemsPage;
