import { Link, useNavigate } from 'react-router';
import Navbar from '../components/Navbar';
import AnimatedCodeBox from '../components/AnimatedCodeBox';
import AnimatedCounter from '../components/AnimatedCounter';
import {
  Code2,
  Users,
  Zap,
  Terminal,
  GitBranch,
  BarChart3,
  ArrowRight,
  Check,
} from 'lucide-react';
import { SignUpButton, useUser } from '@clerk/clerk-react';

function HomePage() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const handleGetStartedNow = () => {
    if (isSignedIn) {
      navigate('/problems');
    }
  };

  return (
    <div className="min-h-screen overflow-hidden transition-colors duration-200" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -z-10" style={{ backgroundColor: 'rgba(217,119,6,0.04)' }}></div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
              <Terminal className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span className="text-sm transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>Interview at your pace</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span style={{ color: 'var(--text-primary)' }}>Master coding </span>
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--gradient-gold)' }}>
                interviews together
              </span>
            </h1>

            <p className="text-xl leading-relaxed max-w-lg transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
              Real-time collaboration, live code execution, and instant feedback.
              Practice with peers or interviewers in a professional coding environment.
            </p>

            {/* Feature List */}
            <div className="space-y-3">
              {[
                'Live pair programming sessions',
                'Multiple language support',
                'Real-time execution & feedback',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--success)' }} />
                  <span className="transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                </div>
              ))}
            </div>


          </div>

          {/* Right Side - Animated Code Editor Preview */}
          <div className="relative">
            <AnimatedCodeBox />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="mt-12 transition-colors duration-200" style={{ borderColor: 'var(--border)', borderTopWidth: '1px', borderBottomWidth: '1px', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 50%, transparent)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Users', value: '5K+' },
            { label: 'Sessions Completed', value: '50K+' },
            { label: 'Uptime', value: '99.9%' },
            { label: 'Languages Supported', value: '15+' },
          ].map((stat, i) => (
            <AnimatedCounter key={i} label={stat.label} finalValue={stat.value} />
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Designed for <span style={{ color: 'var(--accent-bright)' }}>developers</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
            Professional tools that make interview prep productive and collaborative
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Code2,
              title: 'Syntax Highlighting',
              description: 'Support for 15+ programming languages with professional syntax highlighting',
            },
            {
              icon: Users,
              title: 'Real-time Collaboration',
              description: 'Code with peers in real-time with instant synchronization',
            },
            {
              icon: Zap,
              title: 'Instant Execution',
              description: 'Run code immediately and see results with comprehensive test outputs',
            },
            {
              icon: Terminal,
              title: 'Terminal Output',
              description: 'Complete terminal integration for test cases and debugging',
            },
            {
              icon: GitBranch,
              title: 'Version Control',
              description: 'Track code changes and maintain session history',
            },
            {
              icon: BarChart3,
              title: 'Performance Analytics',
              description: 'Analyze algorithm efficiency and optimization opportunities',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-xl p-8 transition-all duration-300 group border"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-glow) 50%, transparent)' }}>
                <feature.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
              <p className="text-sm leading-relaxed transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-surface) 50%, transparent)', borderColor: 'var(--border)', borderTopWidth: '1px', borderBottomWidth: '1px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-4xl font-bold text-center mb-16 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>How it works</h2>

          <div className="space-y-8 max-w-3xl mx-auto">
            {[
              {
                step: '01',
                title: 'Create or Join a Session',
                description: 'Start a new interview session or join one with a unique code',
              },
              {
                step: '02',
                title: 'Write & Collaborate',
                description: 'Code together in real-time with syntax highlighting and instant feedback',
              },
              {
                step: '03',
                title: 'Execute & Debug',
                description: 'Run your code, see results, and iterate quickly with live execution',
              },
              {
                step: '04',
                title: 'Review & Learn',
                description: 'Access session history and learn from the interview experience',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-8 items-start">
                <div className="text-4xl font-bold flex-shrink-0 transition-colors duration-200" style={{ color: 'color-mix(in srgb, var(--accent) 30%, transparent)' }}>{item.step}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="rounded-2xl p-12 sm:p-16 text-center border transition-colors duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-dim) 50%, transparent)', borderColor: 'var(--border-accent)' }}>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>Ready to ace your interviews?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of developers preparing for technical interviews with confidence
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {isSignedIn ? (
              <button
                onClick={handleGetStartedNow}
                className="px-8 py-3 text-black font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                style={{ background: 'var(--gradient-gold)', boxShadow: `0 4px 20px var(--accent-glow)` }}
              >
                Get Started Now
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <SignUpButton mode="modal">
                <button className="px-8 py-3 text-black font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2" style={{ background: 'var(--gradient-gold)', boxShadow: `0 4px 20px var(--accent-glow)` }}>
                  Get Started Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="transition-colors duration-200" style={{ borderColor: 'var(--border)', borderTopWidth: '1px', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 50%, transparent)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-center items-center text-sm transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>
            <p>&copy; 2026 InterviewIQ by Neel Lokhandwala. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
