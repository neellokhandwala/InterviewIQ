import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import {
  Play, Copy, Check, AlertCircle, Clock,
  ChevronRight, BookOpen, TestTube, Terminal,
  CheckCircle, XCircle, Users, Phone, Home,
  LogOut, Loader2, MessageSquare, X,
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
  Chat, Channel, Window,
  MessageList, MessageInput, ChannelHeader,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

import { PROBLEMS_DATA } from '../data/problemsData';
import { executeCode } from '../lib/piston';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

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

// ─── VideoCallUI ──────────────────────────────────────────────────
function VideoCallUI({ onLeave, chatClient, chatChannel }) {
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState  = useCallCallingState();
  const count         = useParticipantCount();
  const [chatOpen, setChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <p className="text-slate-400 text-sm">Joining call...</p>
        </div>
      </div>
    );
  }

  if (callingState === CallingState.LEFT) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900">
        <p className="text-slate-400 text-sm">You have left the call.</p>
      </div>
    );
  }

  return (
    <StreamTheme>
      <div className="h-full flex gap-3 bg-slate-900 p-3">
        {/* Video column */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* top bar */}
          <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-slate-300">Live</span>
              <span className="text-xs text-slate-500">• {count} participant{count !== 1 ? 's' : ''}</span>
            </div>
            {chatClient && chatChannel && (
              <button
                onClick={() => setChatOpen(o => !o)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  chatOpen
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Chat
              </button>
            )}
          </div>

          {/* speaker layout */}
          <div className="flex-1 bg-slate-950 rounded-xl overflow-hidden">
            <SpeakerLayout participantsBarPosition="bottom" />
          </div>

          {/* controls */}
          <div className="flex justify-center bg-slate-800/80 py-2 rounded-xl border border-slate-700/50">
            <CallControls onLeave={onLeave} />
          </div>
        </div>

        {/* Chat slide-in */}
        {chatClient && chatChannel && (
          <div className={`flex flex-col rounded-xl overflow-hidden border border-slate-700/50 bg-slate-950 transition-all duration-300 ${
            chatOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 pointer-events-none'
          }`}>
            {chatOpen && (
              <>
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 shrink-0">
                  <span className="text-xs font-semibold text-slate-300">Session Chat</span>
                  <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-slate-200 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <Chat client={chatClient} theme="str-chat__theme-dark">
                    <Channel channel={chatChannel}>
                      <Window>
                        <MessageList />
                        <MessageInput />
                      </Window>
                    </Channel>
                  </Chat>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </StreamTheme>
  );
}

// ─── Main page ────────────────────────────────────────────────────
export default function SessionPage() {
  const { sessionId } = useParams();
  const navigate      = useNavigate();
  const { user }      = useUser();

  // Refs for cleanup
  const vcRef        = useRef(null);
  const callRef      = useRef(null);
  const ccRef        = useRef(null);
  const cleanedUpRef = useRef(false); // guard against double-cleanup
  const rafRef       = useRef(null);  // cancel pending RAF on re-cleanup

  // Stream state
  const [videoClient,  setVideoClient]  = useState(null);
  const [call,         setCall]         = useState(null);
  const [chatClient,   setChatClient]   = useState(null);
  const [chatChannel,  setChatChannel]  = useState(null);

  // Editor — fully controlled, so code is always current when Run is clicked
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code,             setCode]             = useState('');
  const [output,           setOutput]           = useState(null);
  const [isRunning,        setIsRunning]         = useState(false);
  const [copied,           setCopied]           = useState(false);
  const [activeTab,        setActiveTab]         = useState('description');

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

  // ── Sync code when problem or language changes ───────────────
  // Controlled editor: just set state — Monaco re-renders cleanly
  useEffect(() => {
    const saved   = localStorage.getItem(`code_${problem.id}_${selectedLanguage}`);
    const initial = saved || problem.starterCode?.[selectedLanguage] || '';
    setCode(initial);
    setOutput(null);
  }, [problem.id, selectedLanguage]);

  // ── Stream init ──────────────────────────────────────────────
  useEffect(() => {
    if (!tokenData || !sessionData || !user) return;

    const { token, videoToken, userId } = tokenData;
    const callId   = sessionData.callId;
    const userName = user.fullName || user.username || userId;

    const vc = StreamVideoClient.getOrCreateInstance({
      apiKey: STREAM_API_KEY,
      user:   { id: userId, name: userName },
      token:  videoToken || token,
    });
    const c = vc.call('default', callId);
    c.join({ create: true }).catch(err => console.error('[stream] join failed:', err));

    cleanedUpRef.current = false; // reset for this mount
    vcRef.current        = vc;
    callRef.current      = c;
    setVideoClient(vc);
    setCall(c);

    const cc = StreamChat.getInstance(STREAM_API_KEY);
    ccRef.current = cc;

    (async () => {
      try {
        if (cc.userID) await cc.disconnectUser();
        await cc.connectUser({ id: userId, name: userName }, token);
        const ch = cc.channel('messaging', callId);
        await ch.watch();
        setChatClient(cc);
        setChatChannel(ch);
      } catch (err) {
        console.error('[stream] chat error:', err);
      }
    })();

    return () => {
      // Guard: StrictMode mounts/unmounts twice; user may have already left
      if (cleanedUpRef.current) return;
      cleanedUpRef.current = true;

      // Cancel any pending RAF from a previous cleanup cycle
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      // Leave video synchronously — stops SDK participant events immediately
      callRef.current?.leave().catch(() => {/* already left — ignore */});
      vcRef.current?.disconnectUser().catch(console.error);
      callRef.current = null;
      vcRef.current   = null;

      // Null React state so Stream chat components unmount before disconnect
      setChatChannel(null);
      setChatClient(null);
      setCall(null);
      setVideoClient(null);

      // Disconnect chat one frame later so <Channel> unmounts cleanly first
      rafRef.current = requestAnimationFrame(() => {
        ccRef.current?.disconnectUser().catch(console.error);
        ccRef.current  = null;
        rafRef.current = null;
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

  // code state is always current (controlled editor) — no ref needed
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    try {
      let codeToRun = code;
      if (selectedLanguage !== 'java' && problem.testRunner?.[selectedLanguage]) {
        codeToRun = code + '\n' + problem.testRunner[selectedLanguage];
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
    navigator.clipboard.writeText(code);
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
          <span className="text-xs text-slate-300 font-medium truncate max-w-48">{problem.title}</span>
          <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Main panels */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">

          {/* ── LEFT: Problem + Code Editor + Output ── */}
          <Panel defaultSize={55} minSize={38}>
            <PanelGroup direction="vertical">

              {/* Problem description */}
              <Panel defaultSize={45} minSize={20}>
                <div className="h-full flex flex-col border-r border-slate-800 bg-slate-950 overflow-hidden">
                  {/* tabs */}
                  <div className="flex border-b border-slate-800 px-3 shrink-0">
                    {tabs.map(({ id: tabId, label, icon: Icon }) => (
                      <button key={tabId} onClick={() => setActiveTab(tabId)}
                        className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                          activeTab === tabId ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}>
                        <Icon className="w-3.5 h-3.5" />{label}
                      </button>
                    ))}
                  </div>
                  {/* content */}
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
              </Panel>

              <PanelResizeHandle className="h-1.5 bg-slate-800 hover:bg-blue-500/40 transition-colors cursor-row-resize" />

              {/* Code editor */}
              <Panel defaultSize={40} minSize={20}>
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
                    {/* 
                      Controlled editor (value + onChange sets state).
                      key resets Monaco when language changes.
                      Code state is always current when handleRunCode reads it.
                    */}
                    <Editor
                      key={`${problem.id}_${selectedLanguage}`}
                      height="100%"
                      language={languages.find(l => l.id === selectedLanguage)?.monacoLang}
                      value={code}
                      onChange={val => {
                        const v = val || '';
                        setCode(v);
                        localStorage.setItem(`code_${problem.id}_${selectedLanguage}`, v);
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
              </Panel>

              <PanelResizeHandle className="h-1.5 bg-slate-800 hover:bg-blue-500/40 transition-colors cursor-row-resize" />

              {/* Output */}
              <Panel defaultSize={15} minSize={10}>
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
                          ? <><CheckCircle className="w-3 h-3" />Passed</>
                          : <><XCircle    className="w-3 h-3" />Failed</>}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                    {output === null
                      ? <p className="text-slate-600 text-sm">Click "Run Code" to see output here...</p>
                      : <pre className={`text-sm font-mono whitespace-pre-wrap leading-relaxed ${output.success ? 'text-green-400' : 'text-red-400'}`}>
                          {output.text}
                        </pre>
                    }
                  </div>
                </div>
              </Panel>

            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-slate-800 hover:bg-blue-500/40 transition-colors cursor-col-resize" />

          {/* ── RIGHT: Video + Chat ── */}
          <Panel defaultSize={45} minSize={30}>
            <div className="h-full bg-slate-900">
              {videoClient && call
                ? <StreamVideo client={videoClient}>
                    <StreamCall call={call}>
                      <VideoCallUI
                        onLeave={handleLeaveCall}
                        chatClient={chatClient}
                        chatChannel={chatChannel}
                      />
                    </StreamCall>
                  </StreamVideo>
                : <div className="h-full flex flex-col items-center justify-center bg-slate-900 gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500/40 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-xs text-slate-500">Connecting to call...</p>
                  </div>
              }
            </div>
          </Panel>

        </PanelGroup>
      </div>
    </div>
  );
}