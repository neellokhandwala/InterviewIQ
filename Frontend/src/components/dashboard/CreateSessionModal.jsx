import React, { useState } from 'react';
import { X, ChevronDown, Code, Users } from 'lucide-react';
import { PROBLEMS_DATA } from '../../data/problemsData';

export default function CreateSessionModal({ onClose, onSessionCreated }) {
  const [selectedProblem, setSelectedProblem] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const problems = Object.values(PROBLEMS_DATA).slice(0, 10);
  const currentProblem = PROBLEMS_DATA[selectedProblem];

  const handleCreateRoom = async () => {
    setIsCreating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onSessionCreated();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="relative w-full max-w-md rounded-3xl overflow-hidden transition-all duration-300 animate-slide-up">
          {/* Glassmorphism Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl border border-slate-700/50" />

          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 opacity-10 blur-2xl -z-10" />

          {/* Content */}
          <div className="relative p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
                  <Code className="w-6 h-6 text-emerald-400" strokeWidth={2.5} />
                  Create New Session
                </h2>
                <p className="text-sm text-slate-400">Start practicing with a problem</p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-300 group"
              >
                <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" strokeWidth={2.5} />
              </button>
            </div>

            {/* Problem Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Select Problem <span className="text-red-400">*</span>
              </label>

              {/* Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 text-white text-left font-medium transition-all duration-300 flex items-center justify-between group"
                >
                  <span className="truncate">{currentProblem?.title || 'Select a problem'}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 group-hover:text-slate-300 transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} strokeWidth={2} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 shadow-xl max-h-64 overflow-y-auto z-10">
                    {problems.map((problem) => (
                      <button
                        key={problem.id}
                        onClick={() => {
                          setSelectedProblem(problem.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-slate-700/30 last:border-b-0 ${
                          selectedProblem === problem.id ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300'
                        }`}
                      >
                        <div className="font-medium">{problem.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{problem.difficulty} • {problem.category}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Room Summary */}
            {currentProblem && (
              <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/30 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Room Summary</h3>
                    <div className="space-y-1 text-sm text-slate-300">
                      <p>Problem: <span className="text-emerald-300 font-medium">{currentProblem.title}</span></p>
                      <p>Difficulty: <span className="text-emerald-300 font-medium">{currentProblem.difficulty}</span></p>
                      <p className="flex items-center gap-2">
                        <Users className="w-4 h-4" strokeWidth={2} />
                        Max Participants: <span className="text-emerald-300 font-medium">2 (1-on-1 session)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={isCreating}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/40 text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  `+ Create Room`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
