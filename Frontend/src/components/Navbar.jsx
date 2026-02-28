import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate("/problems");
    }
  };

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and name */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-base-900 leading-tight">
                InterviewIQ
              </h1>
              <p className="text-xs text-base-600 font-medium">Code Together</p>
            </div>
          </div>

          {/* Right side - Auth buttons or User menu */}
          <div className="flex items-center gap-3">
            {!isSignedIn ? (
              <button
                onClick={() => {
                  // The SignInButton from Clerk will handle the modal
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <SignInButton
                  mode="modal"
                  signUpForceRedirectUrl="/problems"
                  signInForceRedirectUrl="/problems"
                >
                  <button className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </SignInButton>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGetStarted}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
