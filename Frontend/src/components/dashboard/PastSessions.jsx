import React, { useState, useEffect } from 'react';
import { Clock, Code, Users, Award, Eye } from 'lucide-react';

export default function PastSessions() {
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock past sessions data
    setTimeout(() => {
      setPastSessions([
        {
          id: 1,
          title: 'Reverse String',
          difficulty: 'Easy',
          category: 'String',
          duration: '45 mins',
          participants: 2,
          timestamp: 'about 3 hours ago',
          completedAt: 'Completed',
          rating: 4.5,
        },
        {
          id: 2,
          title: 'Valid Palindrome',
          difficulty: 'Easy',
          category: 'String',
          duration: '32 mins',
          participants: 1,
          timestamp: 'about 2 hours ago',
          completedAt: 'Completed',
          rating: 4.0,
        },
        {
          id: 3,
          title: 'Maximum Subarray',
          difficulty: 'Medium',
          category: 'Array',
          duration: '1h 15mins',
          participants: 2,
          timestamp: 'Yesterday',
          completedAt: 'Completed',
          rating: 4.8,
        },
        {
          id: 4,
          title: 'Container With Most Water',
          difficulty: 'Medium',
          category: 'Array',
          duration: '58 mins',
          participants: 1,
          timestamp: 'Yesterday',
          completedAt: 'Completed',
          rating: 3.5,
        },
        {
          id: 5,
          title: 'Two Sum',
          difficulty: 'Easy',
          category: 'Array',
          duration: '28 mins',
          participants: 2,
          timestamp: '2 days ago',
          completedAt: 'Completed',
          rating: 5.0,
        },
        {
          id: 6,
          title: 'Longest Substring Without Repeating',
          difficulty: 'Medium',
          category: 'String',
          duration: '1h 42mins',
          participants: 2,
          timestamp: '3 days ago',
          completedAt: 'Completed',
          rating: 4.2,
        },
      ]);
      setLoading(false);
    }, 400);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'Hard':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="animation-fade-in animation-delay-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/30">
          <Clock className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold text-white">Your Past Sessions</h2>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : pastSessions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pastSessions.map((session) => (
            <SessionCard key={session.id} session={session} difficultyColor={getDifficultyColor(session.difficulty)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-xl">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-slate-400 font-medium">No past sessions yet</p>
          <p className="text-slate-500 text-sm mt-1">Complete your first session to see it here</p>
        </div>
      )}
    </div>
  );
}

function SessionCard({ session, difficultyColor }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-xl transition-all duration-500 hover:scale-102">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 group-hover:border-blue-500/50 transition-colors" />

      {/* Hover glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 opacity-0 group-hover:opacity-10 blur-xl transition-opacity -z-10" />

      {/* Content */}
      <div className="relative p-5 space-y-4">
        {/* Top Row - Title and Difficulty */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white truncate group-hover:text-blue-300 transition-colors">
              {session.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{session.category}</p>
          </div>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border flex-shrink-0 whitespace-nowrap ${difficultyColor}`}>
            {session.difficulty}
          </span>
        </div>

        {/* Middle Row - Meta Info */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="truncate">{session.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Users className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{session.participants} person</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Award className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="text-yellow-400 font-medium">{session.rating}</span>
          </div>
        </div>

        {/* Bottom Row - Timestamp and Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
          <span className="text-xs text-slate-500">{session.timestamp}</span>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-blue-500/20 text-slate-400 hover:text-blue-300 transition-all duration-300 group/btn"
          >
            <Eye className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="pt-3 border-t border-slate-700/50 space-y-2 animate-slide-down">
            <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-300 font-medium">{session.completedAt}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Rating</span>
                <span className="text-yellow-400 font-medium">{'⭐'.repeat(Math.floor(session.rating))}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
