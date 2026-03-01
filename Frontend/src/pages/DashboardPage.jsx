import React from 'react';
import { BarChart3, TrendingUp, Code, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import AnimatedCounter from '../components/AnimatedCounter';

const DashboardPage = () => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen overflow-hidden">
      <Navbar />

      {/* Background accent */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">Your Performance Dashboard</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold">
            <span className="text-slate-100">Your Interview </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
              Dashboard
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Track your progress, analyze your performance, and improve your interview preparation journey.
          </p>
        </div>
      </section>

      {/* Main Content - Coming Soon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-400">Problems Solved</h3>
              <Code className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-slate-100">0</div>
            <p className="text-xs text-slate-500 mt-2">Keep solving to improve!</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-400">Accuracy Rate</h3>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-slate-100">0%</div>
            <p className="text-xs text-slate-500 mt-2">Solve problems to track</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-400">Streak Days</h3>
              <Award className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-slate-100">0</div>
            <p className="text-xs text-slate-500 mt-2">Start your journey today!</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-400">Total Hours</h3>
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-slate-100">0h</div>
            <p className="text-xs text-slate-500 mt-2">Consistency is key!</p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-16 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl font-bold">Dashboard Coming Soon</h2>
            <p className="text-xl text-slate-400">
              We're building powerful analytics and insights to help you track your progress, analyze patterns, and optimize your interview preparation.
            </p>
            <div className="pt-4">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                Back to Problems
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="border-slate-800 flex flex-col sm:flex-row justify-center items-center text-sm text-slate-400">
            <p>&copy; 2026 InterviewIQ by Neel Lokhandwala. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
