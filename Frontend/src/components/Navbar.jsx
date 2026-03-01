import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useUser, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useScrollDirection } from '../hooks/useScrollDirection';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useUser();
  const scrollDirection = useScrollDirection();
  const isProblemsPage = location.pathname === '/problems';

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate('/problems');
    }
  };

  const navItems = isSignedIn ? [
    { label: 'Problems', path: '/problems' },
    { label: 'Dashboard', path: '/dashboard' },
  ] : [];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-transform duration-300 ${
      scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
    } bg-slate-950/40 backdrop-blur-xl border-b border-slate-800/50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between w-full">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg transition-transform group-hover:scale-110">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-slate-100 leading-none tracking-tight">
              InterviewIQ
            </h1>
            <p className="text-xs text-slate-400 font-medium">Code Together</p>
          </div>
        </div>

        {/* Navigation Items - Only show when signed in */}
        {isSignedIn && (
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1'
                    : 'text-slate-300 hover:text-blue-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Right Side - Button or User Profile */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10 rounded-lg',
                },
              }}
            />
          ) : (
            <SignUpButton mode="modal">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </SignUpButton>
          )}
        </div>
      </div>
    </nav>
  );
}
