import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useUser, SignUpButton } from '@clerk/clerk-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate('/problems');
    }
  };

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="p-2 bg-gradient-to-br from-primary to-primary/70 rounded-lg transition-transform group-hover:scale-110">
            <Sparkles className="w-5 h-5 text-base-100" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-base-content leading-none tracking-tight">
              InterviewIQ
            </h1>
            <p className="text-xs text-base-content/60 font-medium">Code Together</p>
          </div>
        </div>

        {/* Get Started Button */}
        <div>
          {isSignedIn ? (
            <button
              onClick={handleGetStarted}
              className="btn btn-primary btn-sm gap-2 font-semibold text-white hover:bg-primary/90"
            >
              Get Started
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          ) : (
            <SignUpButton mode="modal">
              <button className="btn btn-primary btn-sm gap-2 font-semibold text-white hover:bg-primary/90">
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
