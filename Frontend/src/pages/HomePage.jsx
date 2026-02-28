import { Link } from 'react-router';
import Navbar from '../components/Navbar';
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
import { SignUpButton } from '@clerk/clerk-react';

function HomePage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen overflow-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Interview at your pace</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-slate-100">Master coding </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
                interviews together
              </span>
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
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
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <SignUpButton mode="modal">
                <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>
              <button className="px-8 py-3 border border-slate-700 text-slate-300 font-semibold rounded-lg hover:border-slate-600 hover:bg-slate-900 transition-all duration-300">
                View Demo
              </button>
            </div>
          </div>

          {/* Right Side - Code Editor Preview */}
          <div className="relative">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
              {/* Editor Header */}
              <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm text-slate-400 font-mono">solution.js</span>
              </div>

              {/* Code Content */}
              <div className="p-6 text-sm font-mono text-slate-300 bg-slate-900">
                <div className="space-y-2">
                  <div>
                    <span className="text-purple-400">function</span>{' '}
                    <span className="text-blue-400">mergeSortedArrays</span>
                    <span className="text-slate-400">(</span>
                    <span>arr1, arr2</span>
                    <span className="text-slate-400">)</span> {'{'}
                  </div>
                  <div className="ml-4 space-y-1">
                    <div>
                      <span className="text-purple-400">const</span>{' '}
                      <span className="text-blue-400">result</span>
                      <span className="text-slate-400"> = [];</span>
                    </div>
                    <div>
                      <span className="text-purple-400">let</span> i = 0, j = 0;
                    </div>
                    <div>
                      <span className="text-slate-500">// Merge logic here...</span>
                    </div>
                  </div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Collaboration Indicator */}
              <div className="bg-slate-800 px-6 py-3 border-t border-slate-700 flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 border border-slate-800"></div>
                  <div className="w-6 h-6 rounded-full bg-purple-500 border border-slate-800"></div>
                </div>
                <span className="text-sm text-slate-400">2 collaborating now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Users', value: '5K+' },
            { label: 'Sessions Completed', value: '50K+' },
            { label: 'Uptime', value: '99.9%' },
            { label: 'Languages Supported', value: '15+' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Designed for <span className="text-blue-400">developers</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
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
              className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-100">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-4xl font-bold text-center mb-16">How it works</h2>

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
                <div className="text-4xl font-bold text-blue-400/30 flex-shrink-0">{item.step}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-100">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-12 sm:p-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Ready to ace your interviews?</h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of developers preparing for technical interviews with confidence
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <SignUpButton mode="modal">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                Get Started Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </SignUpButton>
            <button className="px-8 py-3 border border-slate-700 text-slate-300 font-semibold rounded-lg hover:border-slate-600 hover:bg-slate-900 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-slate-200 transition">Features</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-slate-200 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">Blog</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-slate-200 transition">About</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">Contact</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Social</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-slate-200 transition">Twitter</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">GitHub</a></li>
                <li><a href="#" className="hover:text-slate-200 transition">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-400">
            <p>&copy; 2024 InterviewIQ. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-slate-200 transition">Terms</a>
              <a href="#" className="hover:text-slate-200 transition">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
