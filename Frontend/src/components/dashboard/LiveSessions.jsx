import React, { useState, useEffect } from 'react';
import { Radio, Users, Play, MoreVertical } from 'lucide-react';

export default function LiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock live sessions data
    setTimeout(() => {
      setSessions([
        {
          id: 1,
          title: 'Valid Palindrome',
          difficulty: 'Easy',
          participants: ['Burak Orkimer', 'John Doe'],
          participantCount: 2,
          status: 'live',
          timestamp: 'Just started',
        },
        {
          id: 2,
          title: 'Two Sum',
          difficulty: 'Easy',
          participants: ['Alice Smith'],
          participantCount: 1,
          status: 'live',
          timestamp: '5 mins ago',
        },
      ]);
      setLoading(false);
    }, 300);
  }, []);

  return (
    <div className="mb-8 animation-fade-in animation-delay-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30">
            <Radio className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-white">Live Sessions</h2>
          <span className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg shadow-red-500/30 animate-pulse">
            {sessions.length} {sessions.length === 1 ? 'Active' : 'Active'}
          </span>
        </div>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-700/50 mb-4 mx-auto">
            <Radio className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
          </div>
          <p className="text-slate-400 font-medium">No live sessions right now</p>
          <p className="text-slate-500 text-sm mt-1">Create a new session to get started</p>
        </div>
      )}
    </div>
  );
}

function SessionCard({ session }) {
  const isAtCapacity = session.participantCount >= 2;

  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 group-hover:border-emerald-500/50 transition-colors" />

      {/* Animated gradient border on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity -z-10" />

      {/* Live indicator */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 group-hover:bg-red-500/30 transition-all">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-xs font-semibold text-red-300">LIVE</span>
      </div>

      {/* Content */}
      <div className="relative p-6 flex flex-col">
        {/* Title and Difficulty */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
            {session.title}
          </h3>
          <span className="inline-block px-2.5 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/20 rounded-lg border border-emerald-500/40">
            {session.difficulty}
          </span>
        </div>

        {/* Participants */}
        <div className="mb-4 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-slate-400" strokeWidth={2} />
            <span className="text-sm text-slate-300 font-medium">
              {session.participantCount} / 2 {isAtCapacity ? '(Full)' : '(Can join)'}
            </span>
          </div>
          <div className="space-y-1">
            {session.participants.map((participant, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                {participant}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <span className="text-xs text-slate-400">{session.timestamp}</span>
          
          <button className={`p-2 rounded-lg transition-all duration-300 ${
            isAtCapacity
              ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 hover:text-emerald-200'
          }`}>
            <Play className="w-4 h-4 fill-current" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
