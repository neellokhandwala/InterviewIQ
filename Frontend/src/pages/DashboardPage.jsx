import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Users, Zap, PlayCircle, Calendar, Clock, Code2, Plus, X, Check, Loader, Video } from 'lucide-react'
import { PROBLEMS_DATA } from '../data/problemsData'
import toast from 'react-hot-toast'

const DashboardPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [sessions, setSessions] = useState([])
  const [activeSessions, setActiveSessions] = useState([])
  const [pastSessions, setPastSessions] = useState([])
  const [isCreating, setIsCreating] = useState(false)

  // Mock data initialization
  useEffect(() => {
    // Simulate existing sessions
    const mockActiveSessions = [
      {
        id: 1,
        title: 'Two Sum',
        difficulty: 'Easy',
        participants: ['John Doe', 'Jane Smith'],
        currentParticipants: 2,
        maxParticipants: 2,
        videoParticipants: 2,
        status: 'live',
        createdAt: new Date(Date.now() - 5 * 60000),
      },
      {
        id: 2,
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        participants: ['Burak Orkimez'],
        currentParticipants: 1,
        maxParticipants: 2,
        videoParticipants: 1,
        status: 'live',
        createdAt: new Date(Date.now() - 15 * 60000),
      },
    ]

    const mockPastSessions = [
      {
        id: 10,
        title: 'Reverse String',
        difficulty: 'Easy',
        duration: '23 mins',
        participants: 3,
        endedAt: new Date(Date.now() - 2 * 3600000),
      },
      {
        id: 11,
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        duration: '18 mins',
        participants: 2,
        endedAt: new Date(Date.now() - 4 * 3600000),
      },
      {
        id: 12,
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        duration: '35 mins',
        participants: 2,
        endedAt: new Date(Date.now() - 24 * 3600000),
      },
      {
        id: 13,
        title: 'Container With Most Water',
        difficulty: 'Medium',
        duration: '31 mins',
        participants: 2,
        endedAt: new Date(Date.now() - 48 * 3600000),
      },
      {
        id: 14,
        title: 'Two Sum',
        difficulty: 'Easy',
        duration: '20 mins',
        participants: 2,
        endedAt: new Date(Date.now() - 5 * 24 * 3600000),
      },
    ]

    setActiveSessions(mockActiveSessions)
    setPastSessions(mockPastSessions)
  }, [])

  const handleCreateSession = () => {
    if (!selectedProblem) {
      toast.error('Please select a problem')
      return
    }

    setIsCreating(true)
    setTimeout(() => {
      const newSession = {
        id: Date.now(),
        title: selectedProblem.title,
        difficulty: selectedProblem.difficulty,
        participants: ['You'],
        currentParticipants: 1,
        maxParticipants: 2,
        videoParticipants: 1,
        status: 'live',
        createdAt: new Date(),
      }
      setActiveSessions([...activeSessions, newSession])
      setShowCreateModal(false)
      setSelectedProblem(null)
      setIsCreating(false)
      toast.success(`Session created for ${selectedProblem.title}!`)
    }, 800)
  }

  const handleJoinSession = (sessionId) => {
    const session = activeSessions.find(s => s.id === sessionId)
    if (session && session.currentParticipants < session.maxParticipants) {
      const updatedSessions = activeSessions.map(s => 
        s.id === sessionId 
          ? { ...s, currentParticipants: s.currentParticipants + 1 }
          : s
      )
      setActiveSessions(updatedSessions)
      toast.success(`Joined ${session.title} session!`)
    } else {
      toast.error('Session is full (max 2 participants)')
    }
  }

  const formatTimeAgo = (date) => {
    const diff = Date.now() - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }

  const problemsList = Object.values(PROBLEMS_DATA).slice(0, 15)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header Section */}
        <div className="mb-12 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                Welcome back, Burak!
              </h1>
              <p className="text-slate-400 text-lg">Ready to level up your coding skills?</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="group relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-95"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Create Session
              </span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Active Sessions Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/50 hover:from-slate-800/70 hover:to-slate-900/70 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl group-hover:blur-3xl group-hover:bg-emerald-500/20 transition-all duration-300" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-emerald-400" />
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
              <div className="text-4xl font-bold text-white mb-1">{activeSessions.length}</div>
              <p className="text-sm text-slate-400">Active Sessions</p>
            </div>
          </div>

          {/* Total Sessions Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/50 hover:from-slate-800/70 hover:to-slate-900/70 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:blur-3xl group-hover:bg-blue-500/20 transition-all duration-300" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <PlayCircle className="w-8 h-8 text-blue-400" />
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-semibold text-blue-300">
                  <Code2 className="w-3 h-3" />
                  All Time
                </span>
              </div>
              <div className="text-4xl font-bold text-white mb-1">{activeSessions.length + pastSessions.length}</div>
              <p className="text-sm text-slate-400">Total Sessions</p>
            </div>
          </div>

          {/* Live Participants */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/50 hover:from-slate-800/70 hover:to-slate-900/70 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl group-hover:blur-3xl group-hover:bg-purple-500/20 transition-all duration-300" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <Video className="w-8 h-8 text-purple-400" />
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs font-semibold text-purple-300">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                  Real-time
                </span>
              </div>
              <div className="text-4xl font-bold text-white mb-1">
                {activeSessions.reduce((sum, s) => sum + s.videoParticipants, 0)}
              </div>
              <p className="text-sm text-slate-400">Video Participants</p>
            </div>
          </div>
        </div>

        {/* Live Sessions Section */}
        <section className="mb-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Live Sessions
              <span className="ml-2 text-xs font-semibold text-emerald-400">
                {activeSessions.length > 0 && `• ${activeSessions.length} active`}
              </span>
            </h2>
          </div>

          {activeSessions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeSessions.map((session, idx) => (
                <div
                  key={session.id}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-emerald-500/30 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/60 hover:from-slate-800/60 hover:shadow-xl hover:shadow-emerald-500/20 animate-slideInUp"
                  style={{ animationDelay: `${0.5 + idx * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-white">{session.title}</h3>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/30 border border-emerald-500/50 text-xs font-semibold text-emerald-200">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Live
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">{session.difficulty}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {formatTimeAgo(session.createdAt)}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-300">
                          {session.currentParticipants}/{session.maxParticipants} Participants
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Video className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-300">
                          {session.videoParticipants}/{session.maxParticipants} on Video
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleJoinSession(session.id)}
                      disabled={session.currentParticipants >= session.maxParticipants}
                      className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        session.currentParticipants >= session.maxParticipants
                          ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <PlayCircle className="w-4 h-4" />
                      {session.currentParticipants >= session.maxParticipants ? 'Session Full' : 'Join Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30 p-12 text-center">
              <Zap className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400">No live sessions right now</p>
              <p className="text-sm text-slate-500 mt-2">Create one to get started!</p>
            </div>
          )}
        </section>

        {/* Past Sessions Section */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Your Past Sessions
              <span className="ml-2 text-xs font-semibold text-blue-400">
                {pastSessions.length > 0 && `• ${pastSessions.length} completed`}
              </span>
            </h2>
          </div>

          {pastSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastSessions.map((session, idx) => (
                <div
                  key={session.id}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-blue-500/20 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/50 hover:from-slate-800/60 hover:shadow-xl hover:shadow-blue-500/20 animate-slideInUp"
                  style={{ animationDelay: `${0.7 + idx * 0.05}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-2xl group-hover:blur-3xl group-hover:bg-blue-500/20 transition-all duration-300" />
                  
                  <div className="relative p-5">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-1">{session.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                          session.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          session.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                          'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {session.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span>{session.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>{session.participants} participant{session.participants !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatTimeAgo(session.endedAt)}
                      </div>
                    </div>

                    <button className="w-full py-2 rounded-lg font-semibold text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all duration-300 flex items-center justify-center gap-2">
                      <Code2 className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30 p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400">No past sessions yet</p>
              <p className="text-sm text-slate-500 mt-2">Your completed sessions will appear here</p>
            </div>
          )}
        </section>
      </main>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl shadow-black/50 overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="relative p-6 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
              <h2 className="text-2xl font-bold text-white">Create New Session</h2>
              <p className="text-sm text-slate-400 mt-1">Select a problem to start your interview session</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <label className="block text-sm font-semibold text-slate-300 mb-3">Select Problem *</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {problemsList.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem)}
                    className={`p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                      selectedProblem?.id === problem.id
                        ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/50 ring-2 ring-blue-500/30'
                        : 'bg-slate-800/50 border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{problem.title}</h3>
                      {selectedProblem?.id === problem.id && (
                        <Check className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <p className={`text-xs font-semibold px-2 py-1 rounded-lg w-fit ${
                      problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {problem.difficulty}
                    </p>
                  </button>
                ))}
              </div>

              {/* Room Summary */}
              {selectedProblem && (
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                  <div className="flex items-start gap-3">
                    <Code2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">Room Summary</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>Problem: <span className="text-emerald-300 font-semibold">{selectedProblem.title}</span></li>
                        <li>Max Participants: <span className="text-emerald-300 font-semibold">2 (1 on-1 session)</span></li>
                        <li>Video Limit: <span className="text-emerald-300 font-semibold">2 participants max on video</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-700/30 bg-slate-900/50 backdrop-blur-xl">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-300 bg-slate-700/50 hover:bg-slate-700 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSession}
                disabled={!selectedProblem || isCreating}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  selectedProblem && !isCreating
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95'
                    : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isCreating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Room
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default DashboardPage
