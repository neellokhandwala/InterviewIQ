import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import {
  Play, Copy, Check, AlertCircle, Clock,
  ChevronRight, BookOpen, TestTube,
  Terminal, CheckCircle, XCircle,
  Users, Phone, Home, LogOut,
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';

// Stream Video
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  useCallStateHooks,
  CallingState,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

// Stream Chat
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  ChannelHeader,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

import { PROBLEMS_DATA } from '../data/problemsData';
import { executeCode } from '../lib/piston';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

// ─── Constants ───────────────────────────────────────────────────
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: '📜', monacoLang: 'javascript' },
  { id: 'python',     name: 'Python',     icon: '🐍', monacoLang: 'python'     },
  { id: 'java',       name: 'Java',       icon: '☕', monacoLang: 'java'       },
];

const getDifficultyColor = (d) => ({
  Easy:   'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Medium: 'bg-amber-500/20  text-amber-400  border-amber-500/30',
  Hard:   'bg-red-500/20    text-red-400    border-red-500/30',
}[d] ?? 'bg-slate-500/20 text-slate-400 border-slate-500/30');

const normalize = (str) =>
  str.trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, '').toLowerCase();

// ─── VideoCallUI (must live inside <StreamCall>) ──────────────────
function VideoCallUI({ onLeave }) {
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const count        = useParticipantCount();

  if (callingState === CallingState.LEFT) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900">
        <p className="text-slate-400 text-sm">You have left the call.</p>
      </div>
    );
  }

  return (
    <StreamTheme>
      <div className="h-full flex flex-col bg-slate-900">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Live Video</span>
            <span className="text-xs text-slate-600">• {count} participant{count !== 1 ? 's' : ''}</span>
          </div>
          <button onClick={onLeave}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-medium transition-all">
            <Phone className="w-3 h-3" /> Leave
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <SpeakerLayout participantsBarPosition="bottom" />
        </div>
        <div className="shrink-0 flex justify-center py-2 bg-slate-950/80 border-t border-slate-800">
          <CallControls onLeave={onLeave} />
        </div>
      </div>
    </StreamTheme>
  );
}

// ─── Main page ────────────────────────────────────────────────────
export default function SessionPage() {
  const { sessionId } = useParams();
  const navigate      = useNavigate();
  const { user }      = useUser();

  // Refs — never trigger re-renders, safe to use in cleanup
  const codeRef    = useRef('');
  const vcRef      = useRef(null);   // StreamVideoClient
  const callRef    = useRef(null);   // Call
  const ccRef      = useRef(null);   // StreamChat

  // Stream UI state
  const [videoClient,  setVideoClient]  = useState(null);
  const [call,         setCall]         = useState(null);
  const [chatClient,   setChatClient]   = useState(null);
  const [chatChannel,  setChatChannel]  = useState(null);

  // Editor state
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code,             setCode]             = useState('');
  const [output,           setOutput]           = useState(null);
  const [isRunning,        setIsRunning]         = useState(false);
  const [copied,           setCopied]           = useState(false);
  const [activeTab,        setActiveTab]         = useState('description');
  const [mobileView,       setMobileView]        = useState('problem');

  // ── Fetch session ────────────────────────────────────────────
  const { data: sessionData, isLoading: sessionLoading, error: sessionError } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/sessions/${sessionId}`);
      return data.session;
    },
    enabled: !!sessionId,
  });

  // ── Fetch Stream token ───────────────────────────────────────
  const { data: tokenData } = useQuery({
    queryKey: ['stream-token'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/chat/token');
      return data;
    },
    enabled: !!user,
  });

  // ── Derive problem ───────────────────────────────────────────
  const problem = sessionData
    ? Object.values(PROBLEMS_DATA).find(p => p.title === sessionData.problem) || PROBLEMS_DATA[1]
    : PROBLEMS_DATA[1];

  // ── Load code from localStorage ──────────────────────────────
  useEffect(() => {
    const saved   = localStorage.getItem(`code_${problem.id}_${selectedLanguage}`);
    const initial = saved || problem.starterCode?.[selectedLanguage] || '';
    setCode(initial);
    codeRef.current = initial;
    setOutput(null);
  }, [problem.id, selectedLanguage]);

  // ── Initialize Stream Video + Chat ───────────────────────────
  useEffect(() => {
    if (!tokenData || !sessionData || !user) return;

    const { token, videoToken, userId } = tokenData;
    const callId  = sessionData.callId;
    // Guarantee name is always a non-empty string (fixes "user_details" WS error)
    const userName = user.fullName || user.username || userId;

    // ── Video ── use getOrCreateInstance to avoid duplicate-client warning
    const vc = StreamVideoClient.getOrCreateInstance({
      apiKey: STREAM_API_KEY,
      user:   { id: userId, name: userName },
      token:  videoToken || token,
    });
    const c = vc.call('default', callId);
    c.join({ create: true }).catch(err => console.error('[stream] join failed:', err));

    vcRef.current  = vc;
    callRef.current = c;
    setVideoClient(vc);
    setCall(c);

    // ── Chat ── async IIFE keeps cleanup synchronous
    const cc = StreamChat.getInstance(STREAM_API_KEY);
    ccRef.current = cc;

    (async () => {
      try {
        // If a previous session left the singleton connected, disconnect first
        if (cc.userID) {
          await cc.disconnectUser();
        }
        await cc.connectUser({ id: userId, name: userName }, token);
        console.log('[stream] chat connected');
        const ch = cc.channel('messaging', callId);
        await ch.watch();
        // Only update state if still on this page
        setChatClient(cc);
        setChatChannel(ch);
        console.log('[stream] channel ready:', callId);
      } catch (err) {
        console.error('[stream] chat error:', err);
      }
    })();

    // ── Cleanup ─────────────────────────────────────────────────
    // IMPORTANT: null the React state first (removes Stream components from DOM),
    // then disconnect on the next animation frame — this prevents the crash
    // "can't use a channel after client.disconnect()" caused by React still
    // rendering ChannelInner children when disconnect is called synchronously.
    return () => {
      setChatChannel(null);
      setChatClient(null);
      setCall(null);
      setVideoClient(null);

      requestAnimationFrame(() => {
        callRef.current?.leave().catch(console.error);
        vcRef.current?.disconnectUser().catch(console.error);
        ccRef.current?.disconnectUser().catch(console.error);
        callRef.current  = null;
        vcRef.current    = null;
        ccRef.current    = null;
      });
    };
  }, [tokenData, sessionData, user]);

  // ── Full-session guard ───────────────────────────────────────
  useEffect(() => {
    if (!sessionData || !user) return;
    const isHost        = sessionData.host?.clerkId === user.id;
    const isParticipant = sessionData.participant?.clerkId === user.id;
    if (sessionData.participant && !isHost && !isParticipant) {
      toast.error('This session is full (2/2)');
      navigate('/dashboard');
    }
  }, [sessionData, user]);

  // ── Handlers ─────────────────────────────────────────────────
  const handleLanguageChange = (langId) => setSelectedLanguage(langId);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    try {
      let codeToRun = codeRef.current || code;
      if (selectedLanguage !== 'java' && problem.testRunner?.[selectedLanguage]) {
        codeToRun = codeRef.current + '\n' + problem.testRunner[selectedLanguage];
      }
      const result = await executeCode(selectedLanguage, codeToRun);
      if (result.success) {
        const expected = problem.expectedOutput?.[selectedLanguage];
        const passed   = expected ? normalize(result.output) === normalize(expected) : true;
        if (passed) {
          confetti({ particleCount: 100, spread: 220, origin: { x: 0.5, y: 0.6 } });
          toast.success('All tests passed! 🎉');
          setOutput({ success: true,  text: `${result.output.trim()}\n\n✓ All tests passed!` });
        } else {
          toast.error('Wrong answer.');
          setOutput({ success: false, text: `Your Output:\n${result.output.trim()}\n\nExpected:\n${expected}` });
        }
      } else {
        toast.error('Execution error!');
        setOutput({ success: false, text: result.error || 'Something went wrong.' });
      }
    } catch (err) {
      toast.error('Failed to run code');
      setOutput({ success: false, text: `Error: ${err.message}` });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeRef.current || code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEndSession = async () => {
    try {
      await axiosInstance.post(`/sessions/${sessionId}/end`);
      toast.success('Session ended');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to end session');
    }
  };

  const handleLeaveCall = () => {
    callRef.current?.leave().catch(console.error);
    navigate('/dashboard');
  };

  const isHost = sessionData?.host?.clerkId === user?.id;

  const tabs = [
    { id: 'description', label: 'Description', icon: BookOpen },
    { id: 'examples',    label: 'Examples',    icon: TestTube },
    { id: 'constraints', label: 'Constraints', icon: AlertCircle },
  ];

  // ── Loading / error ──────────────────────────────────────────
  if (sessionLoading) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading session...</p>
      </div>
    </div>
  );

  if (sessionError) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-red-400">Failed to load session.</p>
        <button onClick={() => navigate('/dashboard')} className="text-blue-400 hover:underline text-sm">
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );

  // ── Sub-panels ───────────────────────────────────────────────
  const ProblemPanel = () => (
    <div className="h-full flex flex-col border-r border-slate-800 bg-slate-950 overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-slate-800 space-y-2 shrink-0">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('/dashboard')}
            className="hover:text-blue-400 flex items-center gap-1 transition-colors">
            <Home className="w-3 h-3" /> Dashboard
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-300 truncate">#{problem.id} {problem.title}</span>
        </div>
        <h1 className="text-lg font-bold text-slate-100">{problem.title}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
            {problem.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-500 ml-auto">
            <Clock className="w-3 h-3" />{problem.timeLimit}
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-800 px-3 shrink-0 overflow-x-auto">
        {tabs.map(({ id: tabId, label, icon: Icon }) => (
          <button key={tabId} onClick={() => setActiveTab(tabId)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tabId ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {activeTab === 'description' && (
          <p className="text-slate-300 leading-relaxed text-sm">{problem.description}</p>
        )}
        {activeTab === 'examples' && (
          <div className="space-y-3">
            {problem.examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                <div className="px-4 py-2 bg-slate-800/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Example {i + 1}
                </div>
                <div className="p-4 space-y-2 font-mono text-xs">
                  <div className="flex gap-2"><span className="text-blue-400 font-bold w-16 shrink-0">Input:</span><span className="text-slate-300">{ex.input}</span></div>
                  <div className="flex gap-2"><span className="text-green-400 font-bold w-16 shrink-0">Output:</span><span className="text-slate-300">{ex.output}</span></div>
                  {ex.explanation && (
                    <div className="flex gap-2 pt-2 border-t border-slate-800">
                      <span className="text-slate-500 font-bold w-16 shrink-0">Explain:</span>
                      <span className="text-slate-400">{ex.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'constraints' && (
          <ul className="space-y-2">
            {problem.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-3 bg-slate-900/40 border border-slate-800 rounded-lg px-4 py-3">
                <span className="text-blue-400 font-bold mt-0.5">•</span>
                <code className="font-mono text-xs text-slate-300">{c}</code>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const EditorPanel = () => (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 shrink-0">
        <div className="flex gap-1.5">
          {languages.map(lang => (
            <button key={lang.id} onClick={() => handleLanguageChange(lang.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedLanguage === lang.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}>
              <span>{lang.icon}</span>{lang.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-all text-xs">
            {copied
              ? <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Copied!</span></>
              : <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>}
          </button>
          <button onClick={handleRunCode} disabled={isRunning}
            className="relative group flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 text-xs overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {isRunning
              ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Running...</>
              : <><Play className="w-3.5 h-3.5" />Run Code</>}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          key={`${problem.id}_${selectedLanguage}`}
          height="100%"
          language={languages.find(l => l.id === selectedLanguage)?.monacoLang}
          defaultValue={code}
          onChange={val => {
            codeRef.current = val || '';
            localStorage.setItem(`code_${problem.id}_${selectedLanguage}`, val || '');
          }}
          theme="vs-dark"
          options={{
            fontSize: 14, fontFamily: 'Fira Code, JetBrains Mono, monospace',
            fontLigatures: true, lineNumbers: 'on', minimap: { enabled: false },
            scrollBeyondLastLine: false, automaticLayout: true,
            padding: { top: 12 }, renderLineHighlight: 'gutter', smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );

  const OutputPanel = () => (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 shrink-0">
        <Terminal className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Output</span>
        {output && (
          <span className={`ml-auto flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${
            output.success
              ? 'bg-green-500/10 text-green-400 border-green-500/30'
              : 'bg-red-500/10   text-red-400   border-red-500/30'
          }`}>
            {output.success
              ? <><CheckCircle className="w-3 h-3" />All Passed</>
              : <><XCircle    className="w-3 h-3" />Failed</>}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output === null
          ? <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-600">
              <Terminal className="w-7 h-7" />
              <p className="text-sm">Click "Run Code" to see output</p>
            </div>
          : <pre className={`text-sm font-mono whitespace-pre-wrap leading-relaxed ${output.success ? 'text-green-400' : 'text-red-400'}`}>
              {output.text}
            </pre>
        }
      </div>
    </div>
  );

  const VideoSection = () => (
    videoClient && call
      ? <StreamVideo client={videoClient}>
          <StreamCall call={call}>
            <VideoCallUI onLeave={handleLeaveCall} />
          </StreamCall>
        </StreamVideo>
      : <div className="h-full flex flex-col items-center justify-center bg-slate-900 gap-3">
          <div className="w-8 h-8 border-2 border-blue-500/40 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Connecting to call...</p>
        </div>
  );

  const ChatSection = () => (
    chatClient && chatChannel
      ? <Chat client={chatClient} theme="str-chat__theme-dark">
          <Channel channel={chatChannel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
          </Channel>
        </Chat>
      : <div className="h-full flex flex-col items-center justify-center bg-slate-950 gap-2">
          <div className="w-6 h-6 border-2 border-blue-500/40 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Connecting to chat...</p>
        </div>
  );

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="bg-slate-950 text-slate-100 h-screen flex flex-col overflow-hidden">

      {/* Top bar */}
      <header className="h-14 flex items-center justify-between px-4 bg-slate-900/80 border-b border-slate-800 shrink-0 backdrop-blur-sm z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors">
            <Home className="w-4 h-4" /> Dashboard
          </button>
          <span className="text-slate-700">/</span>
          <span className="text-xs text-slate-300 font-medium truncate max-w-40">{problem.title}</span>
          <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {sessionData && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Users className="w-3.5 h-3.5" />
              <span>{sessionData.participant ? '2/2' : '1/2'}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400">Live</span>
          </div>
          {isHost
            ? <button onClick={handleEndSession}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-medium transition-all">
                <Phone className="w-3.5 h-3.5" /> End Session
              </button>
            : <button onClick={handleLeaveCall}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium transition-all">
                <LogOut className="w-3.5 h-3.5" /> Leave
              </button>
          }
        </div>
      </header>

      {/* Mobile tab switcher */}
      <div className="lg:hidden flex border-b border-slate-800 bg-slate-900/50 shrink-0">
        {['problem', 'editor'].map(v => (
          <button key={v} onClick={() => setMobileView(v)}
            className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-all border-b-2 ${
              mobileView === v ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500'
            }`}>
            {v === 'problem' ? 'Problem' : 'Code Editor'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">

        {/* ══════ DESKTOP ══════ */}
        <div className="hidden lg:block h-full">
          <PanelGroup direction="horizontal">

            {/* LEFT: Problem */}
            <Panel defaultSize={40} minSize={30} maxSize={48}>
              <ProblemPanel />
            </Panel>

            <PanelResizeHandle className="w-1.5 bg-slate-800 hover:bg-blue-500/40 transition-colors cursor-col-resize" />

            {/* MIDDLE: Video (top) + Editor (bottom) — one shared resize handle */}
            <Panel defaultSize={28} minSize={22}>
              <PanelGroup direction="vertical">

                {/* ── Video ── */}
                <Panel defaultSize={35} minSize={22}>
                  <VideoSection />
                </Panel>

                {/* ← drag this handle to balance video vs editor → */}
                <PanelResizeHandle className="h-2 bg-blue-500/40 hover:bg-blue-500/70 transition-colors cursor-row-resize" />

                {/* ── Editor ── */}
                <Panel defaultSize={65} minSize={35}>
                  <EditorPanel />
                </Panel>

              </PanelGroup>
            </Panel>

            <PanelResizeHandle className="w-1.5 bg-slate-800 hover:bg-blue-500/40 transition-colors cursor-col-resize" />

            {/* RIGHT: Output + Chat */}
            <Panel defaultSize={32} minSize={24}>
              <PanelGroup direction="vertical">

                <Panel defaultSize={38} minSize={15}>
                  <OutputPanel />
                </Panel>

                <PanelResizeHandle className="h-1.5 bg-slate-800 hover:bg-blue-500/40 transition-colors cursor-row-resize" />

                <Panel defaultSize={62} minSize={25}>
                  <div className="h-full overflow-hidden">
                    <ChatSection />
                  </div>
                </Panel>

              </PanelGroup>
            </Panel>

          </PanelGroup>
        </div>

        {/* ══════ MOBILE ══════ */}
        <div className="lg:hidden h-full">
          {mobileView === 'problem' ? (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="h-48 shrink-0 border-b border-slate-800">
                <VideoSection />
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="flex border-b border-slate-800 px-3 bg-slate-900/50 sticky top-0">
                  {tabs.map(({ id: tabId, label, icon: Icon }) => (
                    <button key={tabId} onClick={() => setActiveTab(tabId)}
                      className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                        activeTab === tabId ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'
                      }`}>
                      <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                  ))}
                </div>
                <div className="p-4 space-y-4 pb-20">
                  {activeTab === 'description' && <p className="text-slate-300 text-sm leading-relaxed">{problem.description}</p>}
                  {activeTab === 'examples' && problem.examples.map((ex, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                      <div className="px-4 py-2 bg-slate-800/60 text-xs font-semibold text-slate-400 uppercase">Example {i + 1}</div>
                      <div className="p-4 font-mono text-xs space-y-2">
                        <div><span className="text-blue-400 font-bold">Input: </span><span className="text-slate-300">{ex.input}</span></div>
                        <div><span className="text-green-400 font-bold">Output: </span><span className="text-slate-300">{ex.output}</span></div>
                      </div>
                    </div>
                  ))}
                  {activeTab === 'constraints' && problem.constraints.map((c, i) => (
                    <div key={i} className="flex gap-2 bg-slate-900/40 border border-slate-800 rounded-lg px-4 py-3 text-xs">
                      <span className="text-blue-400">•</span><code className="text-slate-300">{c}</code>
                    </div>
                  ))}
                </div>
              </div>
              {chatClient && chatChannel && (
                <div className="h-52 border-t border-slate-800 shrink-0 overflow-hidden">
                  <ChatSection />
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <EditorPanel />
              {output && (
                <div className="border-t border-slate-800 bg-slate-950 p-3 max-h-36 overflow-auto shrink-0">
                  <pre className={`text-xs font-mono whitespace-pre-wrap ${output.success ? 'text-green-400' : 'text-red-400'}`}>
                    {output.text}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}