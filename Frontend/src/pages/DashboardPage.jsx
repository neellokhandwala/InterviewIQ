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
  const [detailSession, setDetailSession] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        const [activRes, pastRes] = await Promise.all([
          axiosInstance.get('/sessions/active'),
          axiosInstance.get('/sessions/my-recent')
        ])
        
        setActiveSessions(Array.isArray(activRes.data.sessions) ? activRes.data.sessions : [])
        setPastSessions(Array.isArray(pastRes.data.sessions) ? pastRes.data.sessions : [])
      } catch (error) {
        console.error('Error fetching sessions:', error)
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

  const formatDuration = (start, end) => {
    const diffMs = new Date(end) - new Date(start);
    const totalMin = Math.floor(diffMs / 60000);
    if (totalMin < 1) return '< 1 min';
    if (totalMin < 60) return `${totalMin} min`;
    return `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;
  };

  const diffColor = (d) => {
    const styles = {
      easy: { backgroundColor: 'rgba(101, 163, 13, 0.12)', color: '#65A30D', borderColor: 'rgba(101, 163, 13, 0.25)' },
      medium: { backgroundColor: 'rgba(217, 119, 6, 0.12)', color: '#D97706', borderColor: 'rgba(217, 119, 6, 0.25)' },
      hard: { backgroundColor: 'rgba(220, 38, 38, 0.12)', color: '#DC2626', borderColor: 'rgba(220, 38, 38, 0.25)' },
    };
    return styles[d?.toLowerCase()] || { backgroundColor: 'rgba(107, 94, 82, 0.12)', color: '#6B5E52', borderColor: 'rgba(107, 94, 82, 0.25)' };
  }

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
      badgeColor: { color: '#65A30D', backgroundColor: 'rgba(101, 163, 13, 0.12)', borderColor: 'rgba(101, 163, 13, 0.25)' },
      iconColor: '#65A30D',
      glowColor: 'rgba(101, 163, 13, 0.15)',
      pulse: true,
    },
    {
      icon: Trophy,
      value: activeSessions.length + pastSessions.length,
      label: 'Total Sessions',
      badge: 'All Time',
      badgeColor: { color: '#0EA5E9', backgroundColor: 'rgba(14, 165, 233, 0.12)', borderColor: 'rgba(14, 165, 233, 0.25)' },
      iconColor: '#0EA5E9',
      glowColor: 'rgba(14, 165, 233, 0.15)',
    },
    {
      icon: TrendingUp,
      value: activeSessions.filter(s => !s.participant).length,
      label: 'Open Sessions',
      badge: 'Real-time',
      badgeColor: { color: '#D97706', backgroundColor: 'rgba(217, 119, 6, 0.12)', borderColor: 'rgba(217, 119, 6, 0.25)' },
      iconColor: '#D97706',
      glowColor: 'rgba(217, 119, 6, 0.15)',
      pulse: true,
    },
  ]

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <Navbar />

      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px]" style={{ backgroundColor: 'rgba(217,119,6,0.04)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-[100px]" style={{ backgroundColor: 'rgba(245,158,11,0.03)' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[80px]" style={{ backgroundColor: 'rgba(146,64,14,0.03)' }} />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-1 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
              Welcome back, <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--accent), var(--info))' }}>{firstName}</span>
            </h1>
            <p className="text-sm transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>Ready to crush your next interview?</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="relative group hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-black overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ background: 'var(--gradient-gold)', boxShadow: `0 4px 20px var(--accent-glow)` }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Zap className="relative w-4 h-4" />
            <span className="relative">New Session</span>
          </button>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {stats.map(({ icon: Icon, value, label, badge, badgeColor, iconColor, glowColor, pulse }, i) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-xl backdrop-blur-sm"
              style={{ animationDelay: `${i * 0.1}s`, backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: `0 8px 32px ${glowColor}` }}
            >
              {/* top-right glow orb */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: glowColor }} />
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-muted) 80%, transparent)', color: iconColor }}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border transition-colors duration-200" style={{ ...badgeColor, borderWidth: '1px', borderStyle: 'solid' }}>
                  {pulse && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: badgeColor.color }} />}
                  {badge}
                </span>
              </div>
              <div className="text-3xl font-bold mb-0.5 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>{value}</div>
              <div className="text-xs font-medium transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── LIVE SESSIONS ── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--success) 12%, transparent)', borderColor: 'rgba(101, 163, 13, 0.25)', color: '#65A30D' }}>
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>Live Sessions</h2>
              {activeSessions.length > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors duration-200" style={{ color: '#65A30D', backgroundColor: 'rgba(101, 163, 13, 0.12)', borderColor: 'rgba(101, 163, 13, 0.25)' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#65A30D' }} />
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
                    className="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl backdrop-blur-sm"
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: '0 8px 32px rgba(101, 163, 13, 0.1)' }}>
                    {/* left accent bar */}
                    <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full" style={{ background: 'linear-gradient(to bottom, rgba(101, 163, 13, 0), rgba(101, 163, 13, 0.6), rgba(101, 163, 13, 0))' }} />

                    <div className="p-5 pl-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>{session.problem}</h3>
                            <span className="flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full border transition-colors duration-200" style={{ color: '#65A30D', backgroundColor: 'rgba(101, 163, 13, 0.12)', borderColor: 'rgba(101, 163, 13, 0.25)' }}>
                              <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: '#65A30D' }} />Live
                            </span>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors duration-200" style={{ ...diffColor(session.difficulty), borderWidth: '1px', borderStyle: 'solid' }}>
                            {session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}
                          </span>
                        </div>
                        <span className="text-xs transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>{formatTimeAgo(new Date(session.createdAt))}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                          <Users className="w-3.5 h-3.5" style={{ color: '#65A30D' }} />
                          <span className="text-xs font-medium transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
                            {participantCount}/2 joined
                          </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                          <Video className="w-3.5 h-3.5" style={{ color: '#D97706' }} />
                          <span className="text-xs font-medium transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
                            {participantCount}/2 on video
                          </span>
                        </div>
                      </div>

                      {/* Capacity bar */}
                      <div className="mb-4">
                        <div className="h-1 rounded-full overflow-hidden transition-colors duration-200" style={{ backgroundColor: 'var(--bg-muted)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ background: 'linear-gradient(to right, #65A30D, #84CC16)', width: `${(participantCount / 2) * 100}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinSession(session._id)}
                        disabled={participantCount >= 2}
                        className="w-full py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                        style={{
                          backgroundColor: participantCount >= 2 ? 'var(--bg-muted)' : 'transparent',
                          color: participantCount >= 2 ? 'var(--text-muted)' : '#000',
                          background: participantCount >= 2 ? 'var(--bg-muted)' : 'linear-gradient(135deg, #65A30D, #84CC16)',
                          cursor: participantCount >= 2 ? 'not-allowed' : 'pointer',
                          opacity: participantCount >= 2 ? '0.5' : '1',
                          boxShadow: participantCount < 2 ? '0 4px 20px rgba(101, 163, 13, 0.15)' : 'none'
                        }}
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
            <div className="rounded-2xl border border-dashed p-12 text-center transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors duration-200" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }}>
                <Zap className="w-6 h-6" />
              </div>
              <p className="font-medium mb-1 transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>No live sessions</p>
              <p className="text-sm transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Create one to get started!</p>
            </div>
          )}
        </section>

        {/* ── PAST SESSIONS ── */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--info) 12%, transparent)', borderColor: 'rgba(14, 165, 233, 0.25)', color: '#0EA5E9' }}>
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>Past Sessions</h2>
            {pastSessions.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors duration-200" style={{ color: '#0EA5E9', backgroundColor: 'rgba(14, 165, 233, 0.12)', borderColor: 'rgba(14, 165, 233, 0.25)' }}>
                {pastSessions.length} completed
              </span>
            )}
          </div>

          {pastSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastSessions.map((session) => (
                <div key={session._id}
                  className="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl backdrop-blur-sm"
                  style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                  <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full" style={{ background: 'linear-gradient(to bottom, rgba(217,119,6,0), rgba(217,119,6,0.4), rgba(217,119,6,0))' }} />

                  <div className="p-5 pl-6">
                    <div className="mb-3">
                      <h3 className="font-bold mb-2 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>{session.problem}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors duration-200" style={{ ...diffColor(session.difficulty), borderWidth: '1px', borderStyle: 'solid' }}>
                        {session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
                        <Clock className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                        Completed
                      </div>
                      <div className="flex items-center gap-2 text-xs transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
                        <Users className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                        {session.participant ? '2' : '1'} participant{(session.participant ? 2 : 1) !== 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-2 text-xs transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>
                        <Calendar className="w-3.5 h-3.5" />
                        {formatTimeAgo(new Date(session.updatedAt))}
                      </div>
                    </div>

                    <button 
                      onClick={() => setDetailSession(session)}
                      className="w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 border"
                      style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                      <Code2 className="w-3.5 h-3.5" /> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed p-12 text-center transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors duration-200" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }}>
                <Calendar className="w-6 h-6" />
              </div>
              <p className="font-medium mb-1 transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>No past sessions yet</p>
              <p className="text-sm transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Completed sessions will appear here</p>
            </div>
          )}
        </section>
      </main>

      {/* ── CREATE SESSION MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 transition-colors" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b transition-colors duration-200" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h2 className="text-lg font-bold transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>Create New Session</h2>
                <p className="text-xs mt-0.5 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Pick a problem to start your interview</p>
              </div>
              <button onClick={() => { setShowCreateModal(false); setSelectedProblem(null) }}
                className="p-2 rounded-lg transition-all duration-200"
                style={{ color: 'var(--text-muted)', backgroundColor: 'transparent' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Difficulty filter */}
            <div className="flex items-center gap-2 px-6 pt-4">
              {['All', 'Easy', 'Medium', 'Hard'].map(d => {
                let bgColor, textColor, borderColor;
                if (filterDifficulty === d) {
                  bgColor = d === 'All' ? 'color-mix(in srgb, var(--accent) 12%, transparent)'
                         : d === 'Easy' ? 'rgba(101, 163, 13, 0.12)'
                         : d === 'Medium' ? 'rgba(217, 119, 6, 0.12)'
                         : 'rgba(220, 38, 38, 0.12)';
                  textColor = d === 'All' ? 'var(--accent)'
                           : d === 'Easy' ? '#65A30D'
                           : d === 'Medium' ? '#D97706'
                           : '#DC2626';
                  borderColor = d === 'All' ? 'var(--border-accent)'
                             : d === 'Easy' ? 'rgba(101, 163, 13, 0.25)'
                             : d === 'Medium' ? 'rgba(217, 119, 6, 0.25)'
                             : 'rgba(220, 38, 38, 0.25)';
                } else {
                  bgColor = 'var(--bg-elevated)';
                  textColor = 'var(--text-secondary)';
                  borderColor = 'var(--border)';
                }
                return (
                  <button key={d} onClick={() => setFilterDifficulty(d)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border"
                    style={{ backgroundColor: bgColor, color: textColor, borderColor: borderColor }}>
                    {d}
                  </button>
                );
              })}
              <span className="ml-auto text-xs transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>{filtered.length} problems</span>
            </div>

            {/* Problem list */}
            <div className="p-6 pt-3 max-h-80 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filtered.map((problem) => {
                  const isSelected = selectedProblem?.id === problem.id
                  return (
                    <button key={problem.id} onClick={() => setSelectedProblem(problem)}
                      className="group relative p-3.5 rounded-xl text-left transition-all duration-200 border"
                      style={{
                        backgroundColor: isSelected ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'var(--bg-elevated)',
                        borderColor: isSelected ? 'var(--border-accent)' : 'var(--border)'
                      }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold truncate pr-2 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>{problem.title}</span>
                        {isSelected
                          ? <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
                          : <ChevronRight className="w-3.5 h-3.5 shrink-0 transition-colors duration-200" style={{ color: 'var(--text-muted)' }} />
                        }
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors duration-200" style={{ ...diffColor(problem.difficulty), borderWidth: '1px', borderStyle: 'solid' }}>
                        {problem.difficulty}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected summary */}
            {selectedProblem && (
              <div className="mx-6 mb-4 p-4 rounded-xl border transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--success) 10%, transparent)', borderColor: 'var(--success)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4" style={{ color: 'var(--success)' }} />
                  <span className="text-sm font-semibold transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>Session Summary</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="mb-0.5 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Problem</p>
                    <p className="font-semibold truncate transition-colors duration-200" style={{ color: 'var(--accent)' }}>{selectedProblem.title}</p>
                  </div>
                  <div>
                    <p className="mb-0.5 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Difficulty</p>
                    <p className="font-semibold transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>{selectedProblem.difficulty}</p>
                  </div>
                  <div>
                    <p className="mb-0.5 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Max Players</p>
                    <p className="font-semibold transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>2 (1v1)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => { setShowCreateModal(false); setSelectedProblem(null) }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Cancel
              </button>
              <button onClick={handleCreateSession} disabled={!selectedProblem || isCreating}
                className="relative group flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 overflow-hidden transition-all duration-300"
                style={{
                  background: (selectedProblem && !isCreating) ? 'linear-gradient(135deg, #65A30D, #84CC16)' : 'var(--bg-muted)',
                  color: (selectedProblem && !isCreating) ? '#000' : 'var(--text-muted)',
                  cursor: (selectedProblem && !isCreating) ? 'pointer' : 'not-allowed',
                  opacity: (selectedProblem && !isCreating) ? '1' : '0.6',
                  boxShadow: (selectedProblem && !isCreating) ? '0 4px 20px rgba(101, 163, 13, 0.15)' : 'none'
                }}>
                {selectedProblem && !isCreating && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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
      {/* ── SESSION DETAIL MODAL ── */}
      {detailSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 transition-colors" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b transition-colors duration-200" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-base font-bold transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>Session Details</h2>
              <button onClick={() => setDetailSession(null)}
                className="p-2 rounded-lg transition-all duration-200"
                style={{ color: 'var(--text-muted)', backgroundColor: 'transparent' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs mb-1 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Problem</p>
                <p className="text-sm font-semibold transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>{detailSession.problem}</p>
              </div>
              <div>
                <p className="text-xs mb-1 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Difficulty</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors duration-200" style={{ ...diffColor(detailSession.difficulty), borderWidth: '1px', borderStyle: 'solid' }}>
                  {detailSession.difficulty.charAt(0).toUpperCase() + detailSession.difficulty.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-xs mb-1 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Created</p>
                <p className="text-sm transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>{new Date(detailSession.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs mb-1 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Duration</p>
                <p className="text-sm transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>{formatDuration(detailSession.createdAt, detailSession.updatedAt)}</p>
              </div>
              <div>
                <p className="text-xs mb-1 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Participants</p>
                <p className="text-sm transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>{detailSession.participant ? '2 participants' : '1 participant'}</p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button onClick={() => setDetailSession(null)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* FOOTER */}
        <footer className="border-t transition-colors duration-200" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 50%, transparent)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-center items-center text-sm transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>
               <p>&copy; 2026 InterviewIQ by Neel Lokhandwala. All rights reserved.</p>
            </div>
          </div>
        </footer>
    </div>
  )
}

export default DashboardPage
