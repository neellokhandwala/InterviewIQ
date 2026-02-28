import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useUser, SignUpButton } from '@clerk/clerk-react';
import { useScrollDirection } from '../hooks/useScrollDirection';

export default function Navbar() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const scrollDirection = useScrollDirection();

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate('/problems');
    }
  };

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

        {/* Get Started Button */}
        <div>
          {isSignedIn ? (
            <button
              onClick={handleGetStarted}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
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
