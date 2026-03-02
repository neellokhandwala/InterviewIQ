import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Navbar from '../components/Navbar'
import { useUser } from '@clerk/clerk-react'
import {
  Users, Zap, PlayCircle, Calendar, Clock, Code2,
  Plus, X, Check, Loader, Video, Trophy, TrendingUp,
  ChevronRight, Flame, Target
} from 'lucide-react'
import { PROBLEMS_DATA } from '../data/problemsData'
import toast from 'react-hot-toast'
import axiosInstance from '../lib/axios'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const firstName = user?.firstName || 'Coder'

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [activeSessions, setActiveSessions] = useState([])
  const [pastSessions, setPastSessions] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [filterDifficulty, setFilterDifficulty] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        const [activRes, pastRes] = await Promise.all([
          axiosInstance.get('/sessions/active'),
          axiosInstance.get('/sessions/my-recent')
        ])
        
        console.log("[v0] Active sessions response:", activRes.data)
        console.log("[v0] Past sessions response:", pastRes.data)
        
        setActiveSessions(Array.isArray(activRes.data.sessions) ? activRes.data.sessions : [])
        setPastSessions(Array.isArray(pastRes.data.sessions) ? pastRes.data.sessions : [])
      } catch (error) {
        console.error('Error fetching sessions:', error)
        console.log("[v0] Error response:", error.response?.data)
        toast.error('Failed to load sessions')
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchSessions()
    }
  }, [user?.id])

  const handleCreateSession = async () => {
    if (!selectedProblem) { toast.error('Please select a problem'); return }
    setIsCreating(true)
    try {
      const response = await axiosInstance.post('/sessions', {
        problem: selectedProblem.title,
        difficulty: selectedProblem.difficulty.toLowerCase()
      })
      
      console.log("[v0] Create session response:", response.data)
      const newSession = response.data.session
      if (!newSession || !newSession._id) {
        toast.error('Invalid session response from server')
        return
      }
      setActiveSessions([...activeSessions, newSession])
      setShowCreateModal(false)
      setSelectedProblem(null)
      toast.success(`Session created for ${selectedProblem.title}!`)
      // Navigate to the session
      navigate(`/session/${newSession._id}`)
    } catch (error) {
      console.error('Error creating session:', error)
      console.log("[v0] Create session error response:", error.response?.data)
      toast.error('Failed to create session')
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinSession = (sessionId) => {
    navigate(`/session/${sessionId}`)
  }

  const formatTimeAgo = (date) => {
    const diff = Date.now() - date
    const m = Math.floor(diff / 60000)
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)
    if (m < 60) return `${m}m ago`
    if (h < 24) return `${h}h ago`
    return `${d}d ago`
  }

  const diffColor = (d) => ({
    easy:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/15  text-amber-400  border-amber-500/30',
    hard:   'bg-red-500/15    text-red-400    border-red-500/30',
  }[d?.toLowerCase()] ?? 'bg-slate-500/15 text-slate-400 border-slate-500/30')

  const problemsList = Object.values(PROBLEMS_DATA)
  const filtered = filterDifficulty === 'All'
    ? problemsList
    : problemsList.filter(p => p.difficulty === filterDifficulty)

  const stats = [
    {
      icon: Flame,
      value: activeSessions.length,
      label: 'Live Sessions',
      badge: 'Live',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-400',
      glow: 'group-hover:shadow-emerald-500/20',
      pulse: true,
    },
    {
      icon: Trophy,
      value: activeSessions.length + pastSessions.length,
      label: 'Total Sessions',
      badge: 'All Time',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      iconColor: 'text-blue-400',
      glow: 'group-hover:shadow-blue-500/20',
    },
    {
      icon: TrendingUp,
      value: activeSessions.filter(s => !s.participant).length,
      label: 'Open Sessions',
      badge: 'Real-time',
      badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      iconColor: 'text-violet-400',
      glow: 'group-hover:shadow-violet-500/20',
      pulse: true,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-500/4 rounded-full blur-[80px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-1">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{firstName}</span>
            </h1>
            <p className="text-slate-400 text-sm">Ready to crush your next interview?</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="relative group hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Zap className="relative w-4 h-4" />
            <span className="relative">New Session</span>
          </button>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {stats.map(({ icon: Icon, value, label, badge, badgeColor, iconColor, glow, pulse }, i) => (
            <div
              key={label}
              className={`group relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 p-5 hover:border-slate-700 transition-all duration-300 hover:shadow-xl ${glow} backdrop-blur-sm`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* top-right glow orb */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ background: iconColor.replace('text-', 'var(--tw-') }} />
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-slate-800/80 ${iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${badgeColor}`}>
                  {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                  {badge}
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-0.5">{value}</div>
              <div className="text-xs text-slate-500 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* ── LIVE SESSIONS ── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-100">Live Sessions</h2>
              {activeSessions.length > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  {activeSessions.length} active
                </span>
              )}
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="sm:hidden flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>

          {activeSessions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeSessions.map((session) => {
                const participantCount = session.participant ? 2 : 1
                return (
                  <div key={session._id}
                    className="group relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 backdrop-blur-sm">
                    {/* left accent bar */}
                    <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 rounded-full" />

                    <div className="p-5 pl-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-100">{session.problem}</h3>
                            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                              <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />Live
                            </span>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${diffColor(session.difficulty)}`}>
                            {session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-600">{formatTimeAgo(new Date(session.createdAt))}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
                          <Users className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs text-slate-300 font-medium">
                            {participantCount}/2 joined
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
                          <Video className="w-3.5 h-3.5 text-violet-400" />
                          <span className="text-xs text-slate-300 font-medium">
                            {participantCount}/2 on video
                          </span>
                        </div>
                      </div>

                      {/* Capacity bar */}
                      <div className="mb-4">
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                            style={{ width: `${(participantCount / 2) * 100}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinSession(session._id)}
                        disabled={participantCount >= 2}
                        className={`w-full py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                          participantCount >= 2
                            ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-95'
                        }`}
                      >
                        <PlayCircle className="w-4 h-4" />
                        {participantCount >= 2 ? 'Session Full' : 'Join Now'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800 border-dashed p-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium mb-1">No live sessions</p>
              <p className="text-sm text-slate-600">Create one to get started!</p>
            </div>
          )}
        </section>

        {/* ── PAST SESSIONS ── */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">Past Sessions</h2>
            {pastSessions.length > 0 && (
              <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                {pastSessions.length} completed
              </span>
            )}
          </div>

          {pastSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastSessions.map((session) => (
                <div key={session._id}
                  className="group relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/30 backdrop-blur-sm">
                  <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 rounded-full" />

                  <div className="p-5 pl-6">
                    <div className="mb-3">
                      <h3 className="font-bold text-slate-100 mb-2 group-hover:text-blue-300 transition-colors">{session.problem}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${diffColor(session.difficulty)}`}>
                        {session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        Completed
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        {session.participant ? '2' : '1'} participant{(session.participant ? 2 : 1) !== 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatTimeAgo(new Date(session.updatedAt))}
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/session/${session._id}`)}
                      className="w-full py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-800/60 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200 flex items-center justify-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" /> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800 border-dashed p-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium mb-1">No past sessions yet</p>
              <p className="text-sm text-slate-600">Completed sessions will appear here</p>
            </div>
          )}
        </section>
      </main>

      {/* ── CREATE SESSION MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/60 shadow-2xl shadow-black/60 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Create New Session</h2>
                <p className="text-xs text-slate-500 mt-0.5">Pick a problem to start your interview</p>
              </div>
              <button onClick={() => { setShowCreateModal(false); setSelectedProblem(null) }}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Difficulty filter */}
            <div className="flex items-center gap-2 px-6 pt-4">
              {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                <button key={d} onClick={() => setFilterDifficulty(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                    filterDifficulty === d
                      ? d === 'All'     ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      : d === 'Easy'    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : d === 'Medium'  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/40 hover:border-slate-600'
                  }`}>
                  {d}
                </button>
              ))}
              <span className="ml-auto text-xs text-slate-600">{filtered.length} problems</span>
            </div>

            {/* Problem list */}
            <div className="p-6 pt-3 max-h-80 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filtered.map((problem) => {
                  const isSelected = selectedProblem?.id === problem.id
                  return (
                    <button key={problem.id} onClick={() => setSelectedProblem(problem)}
                      className={`group relative p-3.5 rounded-xl text-left transition-all duration-200 border ${
                        isSelected
                          ? 'bg-blue-500/10 border-blue-500/50 ring-1 ring-blue-500/30'
                          : 'bg-slate-800/40 border-slate-700/40 hover:border-slate-600 hover:bg-slate-800/60'
                      }`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-slate-100 truncate pr-2">{problem.title}</span>
                        {isSelected
                          ? <Check className="w-4 h-4 text-blue-400 shrink-0" />
                          : <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0 transition-colors" />
                        }
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${diffColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected summary */}
            {selectedProblem && (
              <div className="mx-6 mb-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-slate-200">Session Summary</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-slate-500 mb-0.5">Problem</p>
                    <p className="text-emerald-400 font-semibold truncate">{selectedProblem.title}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-0.5">Difficulty</p>
                    <p className="text-slate-300 font-semibold">{selectedProblem.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-0.5">Max Players</p>
                    <p className="text-slate-300 font-semibold">2 (1v1)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => { setShowCreateModal(false); setSelectedProblem(null) }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-400 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 transition-all">
                Cancel
              </button>
              <button onClick={handleCreateSession} disabled={!selectedProblem || isCreating}
                className={`relative group flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 ${
                  selectedProblem && !isCreating
                    ? 'text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-95'
                    : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                }`}>
                {selectedProblem && !isCreating && (
                  <>
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500" />
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </>
                )}
                <span className="relative flex items-center gap-2">
                  {isCreating
                    ? <><Loader className="w-4 h-4 animate-spin" />Creating...</>
                    : <><Plus className="w-4 h-4" />Create Room</>
                  }
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* FOOTER */}
        <footer className="border-t border-slate-800 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="border-slate-800 flex flex-col sm:flex-row justify-center items-center text-sm text-slate-400">
               <p>&copy; 2026 InterviewIQ by Neel Lokhandwala. All rights reserved.</p>
            </div>
          </div>
        </footer>
    </div>
  )
}

export default DashboardPage
