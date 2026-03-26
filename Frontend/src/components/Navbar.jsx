import { Sparkles, ArrowRight, Code2, Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useUser, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useUser();
  const scrollDirection = useScrollDirection();
  const { theme, toggleTheme } = useTheme();

  const navItems = isSignedIn
    ? [
        { label: 'Problems', path: '/problems' },
        { label: 'Dashboard', path: '/dashboard' },
      ]
    : [];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Glassmorphism bar */}
      <div className="mx-4 mt-3 rounded-2xl backdrop-blur-2xl shadow-xl transition-colors duration-200 border" style={{ backgroundColor: theme === 'light' ? 'var(--bg-elevated)' : 'color-mix(in srgb, var(--bg-surface) 70%, transparent)', borderColor: 'var(--border)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)' }}>
        {/* Top glow line */}
        <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl" style={{ background: 'linear-gradient(to right, transparent, var(--accent-bright) 50%, transparent)' }} />

        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="relative p-2 rounded-xl transition-all duration-300 group-hover:scale-110" style={{ background: 'var(--gradient-gold)', boxShadow: `0 8px 16px var(--accent-glow)` }}>
              <Sparkles className="w-4 h-4 text-black" strokeWidth={2.5} />
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-40 group-hover:scale-150 transition-all duration-500" style={{ background: 'var(--gradient-gold)' }} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Interview<span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--gradient-gold)' }}>IQ</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Code Together</span>
            </div>
          </div>

          {/* Nav Items */}
          {isSignedIn && (
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300"
                    style={{
                      color: isActive ? 'var(--accent-bright)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'transparent' : 'transparent'
                    }}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-xl border" style={{ borderColor: 'var(--border-accent)', background: 'color-mix(in srgb, var(--accent-glow) 50%, transparent)' }} />
                    )}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
                    )}
                    <span className="relative">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border transition-all duration-300"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
              title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors duration-200" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--success)' }} />
                  <span className="text-xs font-medium">Online</span>
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: `w-9 h-9 rounded-xl ring-2 transition-all`,
                    },
                  }}
                  style={{
                    '--ring-color': 'var(--accent-glow)',
                  }}
                />
              </div>
            ) : (
              <SignUpButton mode="modal">
                <button className="relative group px-5 py-2 text-sm font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 text-black" style={{ background: 'var(--gradient-gold)', boxShadow: '0 4px 20px var(--accent-glow)' }}>
                  {/* Shimmer effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                  </span>
                </button>
              </SignUpButton>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
