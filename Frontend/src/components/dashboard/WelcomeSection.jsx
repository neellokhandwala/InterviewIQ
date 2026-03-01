import React from 'react';
import { Sparkles, Plus, ArrowRight } from 'lucide-react';

export default function WelcomeSection({ userName, onCreateSession }) {
  return (
    <div className="mb-8 animation-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{userName}</span>!
            </h1>
          </div>
          <p className="text-slate-400 text-lg ml-11">Ready to level up your coding skills?</p>
        </div>

        {/* Create Session Button */}
        <button
          onClick={onCreateSession}
          className="relative group h-12 px-6 rounded-xl overflow-hidden flex items-center gap-2 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-105 whitespace-nowrap"
        >
          {/* Button background */}
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
          
          {/* Shimmer effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          <span className="relative flex items-center gap-2">
            <Plus className="w-4 h-4" strokeWidth={3} />
            Create Session
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </span>
        </button>
      </div>
    </div>
  );
}
