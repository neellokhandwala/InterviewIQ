import { Sparkles, ArrowRight, Code2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useUser, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useScrollDirection } from '../hooks/useScrollDirection';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useUser();
  const scrollDirection = useScrollDirection();

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
      <div className="mx-4 mt-3 rounded-2xl bg-slate-900/70 backdrop-blur-2xl border border-slate-700/50 shadow-xl shadow-black/30">
        {/* Top glow line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent rounded-t-2xl" />

        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 group-hover:shadow-blue-500/60 group-hover:scale-110">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-40 group-hover:scale-150 transition-all duration-500" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold text-white tracking-tight">
                Interview<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">IQ</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Code Together</span>
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
                    className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30" />
                    )}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full shadow-sm shadow-blue-400" />
                    )}
                    <span className="relative">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-slate-400 font-medium">Online</span>
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9 rounded-xl ring-2 ring-blue-500/30 hover:ring-blue-500/60 transition-all',
                    },
                  }}
                />
              </div>
            ) : (
              <SignUpButton mode="modal">
                <button className="relative group px-5 py-2 text-sm font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40">
                  {/* Button background */}
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
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