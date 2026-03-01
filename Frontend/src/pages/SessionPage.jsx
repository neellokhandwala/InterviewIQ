import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import {
  Play, Copy, Check, AlertCircle, Clock,
  ChevronLeft, ChevronRight, BookOpen, TestTube,
  Terminal, CheckCircle, XCircle, Code2, List,
  Send, Users, Mic, MicOff, Video, VideoOff,
  Phone, Settings, MoreVertical, X, Home
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { PROBLEMS_DATA } from '../data/problemsData';
import { executeCode } from '../lib/piston';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: '📜', monacoLang: 'javascript' },
  { id: 'python', name: 'Python', icon: '🐍', monacoLang: 'python' },
  { id: 'java', name: 'Java', icon: '☕', monacoLang: 'java' },
];

const getDifficultyColor = (d) => ({
  Easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Hard: 'bg-red-500/20 text-red-400 border-red-500/30',
}[d] ?? 'bg-slate-500/20 text-slate-400 border-slate-500/30');

const allProblems = Object.values(PROBLEMS_DATA);
const normalize = (str) =>
  str.trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, '').toLowerCase();

export default function SessionPage() {
  const { problemId, sessionId } = useParams();
  const navigate = useNavigate();

  const problem = PROBLEMS_DATA[Number(problemId)] || PROBLEMS_DATA[1];
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(() =>
    localStorage.getItem(`code_${problem.id}_javascript`) ||
    PROBLEMS_DATA[problem.id]?.starterCode?.javascript
  );
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isMobileEditorOpen, setIsMobileEditorOpen] = useState(false);

  // Session state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, name: 'Burak Orkmez', message: 'Hey, ready to solve this problem?', timestamp: 'Just now' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Burak Orkmez', status: 'host', isOnline: true, avatar: '👨‍💼' },
    { id: 2, name: 'You', status: 'participant', isOnline: true, avatar: '👤' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem(`code_${problem.id}_${selectedLanguage}`);
    setCode(saved || PROBLEMS_DATA[problem.id]?.starterCode?.[selectedLanguage]);
    setOutput(null);
  }, [selectedLanguage, problem.id]);

  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId);
  };

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
        const passed = expected
          ? normalize(result.output) === normalize(expected)
          : true;

        if (passed) {
          confetti({ particleCount: 100, spread: 220, origin: { x: 0.5, y: 0.6 } });
          toast.success('All tests passed! 🎉');
          setOutput({
            success: true,
            text: `${result.output.trim()}\n\n✓ All tests passed!`,
          });
        } else {
          toast.error('Wrong answer. Check your output!');
          setOutput({
            success: false,
            text: `Your Output:\n${result.output.trim()}\n\nExpected:\n${expected}`,
          });
        }
      } else {
        toast.error('Execution error!');
        setOutput({
          success: false,
          text: result.error || result.output || 'Something went wrong.',
        });
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

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      name: 'You',
      message: newMessage,
      timestamp: 'Just now',
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const tabs = [
    { id: 'description', label: 'Description', icon: BookOpen },
    { id: 'examples', label: 'Examples', icon: TestTube },
    { id: 'constraints', label: 'Constraints', icon: AlertCircle },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 h-screen flex flex-col overflow-hidden">
      <Navbar />

      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        {!isMobileEditorOpen ? (
          <button
            onClick={() => setIsMobileEditorOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/30 hover:scale-105 transition-all"
          >
            <Code2 className="w-4 h-4" /> Open Editor
          </button>
        ) : (
          <button
            onClick={() => setIsMobileEditorOpen(false)}
            className="flex items-center gap-2 px-5 py-3 bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700 hover:scale-105 transition-all"
          >
            <BookOpen className="w-4 h-4" /> View Problem
          </button>
        )}
      </div>

      <div className="flex-1 pt-16 overflow-hidden">
        {/* DESKTOP VIEW */}
        <div className="hidden lg:block h-full">
          <PanelGroup direction="horizontal">
            {/* LEFT PANEL - Problem Details */}
            <Panel defaultSize={32} minSize={25} maxSize={45}>
              <div className="h-full flex flex-col border-r border-slate-800 bg-slate-950 overflow-hidden">
                <div className="px-5 pt-4 pb-3 border-b border-slate-800 space-y-2 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <Home className="w-3 h-3" /> Dashboard
                      </button>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-slate-300">#{problem.id} {problem.title}</span>
                    </div>
                  </div>

                  <h1 className="text-xl font-bold text-slate-100">{problem.title}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
                      {problem.category}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-slate-500 ml-auto">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {problem.timeLimit}
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {problem.memoryLimit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 px-3 shrink-0 overflow-x-auto">
                  {tabs.map(({ id: tabId, label, icon: Icon }) => (
                    <button
                      key={tabId}
                      onClick={() => setActiveTab(tabId)}
                      className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                        activeTab === tabId
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Scrollable Tab Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {activeTab === 'description' && (
                    <p className="text-slate-300 leading-relaxed text-sm">{problem.description}</p>
                  )}
                  {activeTab === 'examples' && (
                    <div className="space-y-3">
                      {problem.examples.map((ex, i) => (
                        <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden hover:border-blue-500/30 transition-colors">
                          <div className="px-4 py-2 bg-slate-800/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Example {i + 1}
                          </div>
                          <div className="p-4 space-y-2 font-mono text-xs">
                            <div className="flex gap-2">
                              <span className="text-blue-400 font-bold w-16 shrink-0">Input:</span>
                              <span className="text-slate-300">{ex.input}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-green-400 font-bold w-16 shrink-0">Output:</span>
                              <span className="text-slate-300">{ex.output}</span>
                            </div>
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
                        <li key={i} className="flex items-start gap-3 bg-slate-900/40 border border-slate-800 rounded-lg px-4 py-3 hover:border-blue-500/30 transition-colors">
                          <span className="text-blue-400 font-bold mt-0.5">•</span>
                          <code className="font-mono text-xs text-slate-300">{c}</code>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="w-1.5 bg-slate-800 hover:bg-blue-500/50 transition-colors cursor-col-resize" />

            {/* MIDDLE PANEL - Code Editor & Video */}
            <Panel defaultSize={38} minSize={30}>
              <PanelGroup direction="vertical">
                {/* Video Call Area */}
                <Panel defaultSize={35} minSize={25}>
                  <div className="h-full flex flex-col bg-slate-900 border-b border-slate-800">
                    {/* Video Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm font-semibold text-slate-300">Live Session</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className={`p-2 rounded-lg transition-all ${
                            isMuted
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setIsVideoOff(!isVideoOff)}
                          className={`p-2 rounded-lg transition-all ${
                            isVideoOff
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        </button>
                        <button className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-red-600 hover:text-white transition-all">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Video Display Area */}
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl" />
                      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl" />

                      <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl animate-pulse shadow-lg shadow-blue-500/30">
                            👨‍💼
                          </div>
                          <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-slate-200">Burak Orkmez</p>
                          <p className="text-xs text-slate-500">Host</p>
                        </div>
                      </div>

                      {/* Mini video (Your feed) */}
                      <div className="absolute bottom-4 right-4 w-24 h-24 bg-slate-800 rounded-lg border-2 border-slate-700 hover:border-blue-500/50 transition-all flex items-center justify-center cursor-pointer group">
                        <div className="text-3xl group-hover:scale-110 transition-transform">👤</div>
                      </div>
                    </div>

                    {/* Participants info */}
                    <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      <span>{participants.length} participants</span>
                    </div>
                  </div>
                </Panel>

                <PanelResizeHandle className="h-1.5 bg-slate-800 hover:bg-blue-500/50 transition-colors cursor-row-resize" />

                {/* Code Editor */}
                <Panel defaultSize={65} minSize={30}>
                  <div className="h-full flex flex-col bg-slate-900">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 shrink-0">
                      <div className="flex gap-1.5">
                        {languages.map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => handleLanguageChange(lang.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              selectedLanguage === lang.id
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <span>{lang.icon}</span>
                            {lang.name}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-all text-xs"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-400" />
                              <span className="text-green-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleRunCode}
                          disabled={isRunning}
                          className="relative group flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-green-500/30 text-xs overflow-hidden"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          {isRunning ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Running...
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              Run Code
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <Editor
                        height="100%"
                        language={languages.find((l) => l.id === selectedLanguage)?.monacoLang}
                        value={code}
                        onChange={(val) => {
                          const newCode = val || '';
                          setCode(newCode);
                          localStorage.setItem(`code_${problem.id}_${selectedLanguage}`, newCode);
                        }}
                        theme="vs-dark"
                        options={{
                          fontSize: 14,
                          fontFamily: 'Fira Code, JetBrains Mono, monospace',
                          fontLigatures: true,
                          lineNumbers: 'on',
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          padding: { top: 12 },
                          renderLineHighlight: 'gutter',
                          smoothScrolling: true,
                        }}
                      />
                    </div>
                  </div>
                </Panel>
              </PanelGroup>
            </Panel>

            <PanelResizeHandle className="w-1.5 bg-slate-800 hover:bg-blue-500/50 transition-colors cursor-col-resize" />

            {/* RIGHT PANEL - Chat & Output */}
            <Panel defaultSize={30} minSize={20}>
              <PanelGroup direction="vertical">
                {/* Output Panel */}
                <Panel defaultSize={50} minSize={20}>
                  <div className="h-full flex flex-col bg-slate-950">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 shrink-0">
                      <Terminal className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Output</span>
                      {output && (
                        <span
                          className={`ml-auto flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${
                            output.success
                              ? 'bg-green-500/10 text-green-400 border-green-500/30'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                          }`}
                        >
                          {output.success ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              All Passed
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Failed
                            </>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                      {output === null ? (
                        <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-600">
                          <Terminal className="w-7 h-7" />
                          <p className="text-sm">Click "Run Code" to see output</p>
                        </div>
                      ) : (
                        <pre
                          className={`text-sm font-mono whitespace-pre-wrap leading-relaxed ${
                            output.success ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {output.text}
                        </pre>
                      )}
                    </div>
                  </div>
                </Panel>

                <PanelResizeHandle className="h-1.5 bg-slate-800 hover:bg-blue-500/50 transition-colors cursor-row-resize" />

                {/* Chat Panel */}
                <Panel defaultSize={50} minSize={20}>
                  <div className="h-full flex flex-col bg-slate-950 border-l border-slate-800">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Users className="w-4 h-4 text-blue-400" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />
                        </div>
                        <span className="text-sm font-semibold text-slate-300">Session Chat</span>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {messages.map((msg) => (
                        <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="group">
                            <div className="flex gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0">
                                {msg.name === 'Burak Orkmez' ? '👨‍💼' : '👤'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xs font-semibold text-slate-300">{msg.name}</span>
                                  <span className="text-xs text-slate-600">{msg.timestamp}</span>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed break-words">{msg.message}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="px-4 py-3 border-t border-slate-800 shrink-0 bg-slate-950">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                        <button
                          onClick={handleSendMessage}
                          className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/30"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>

        {/* MOBILE VIEW */}
        <div className="lg:hidden h-full">
          {!isMobileEditorOpen ? (
            <div className="h-full overflow-y-auto bg-slate-950">
              {/* Video Area Mobile */}
              <div className="bg-slate-900 border-b border-slate-800 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold">Live Session</span>
                  </div>
                  <div className="flex gap-2">
                    <button className={`p-2 rounded-lg ${isMuted ? 'bg-red-500/20' : 'bg-slate-800'}`}>
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <button className={`p-2 rounded-lg ${isVideoOff ? 'bg-red-500/20' : 'bg-slate-800'}`}>
                      {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="w-full aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                      👨‍💼
                    </div>
                    <p className="text-sm">Burak Orkmez</p>
                  </div>
                </div>
              </div>

              {/* Problem Info Mobile */}
              <div className="px-5 pt-4 pb-3 border-b border-slate-800 space-y-2">
                <h1 className="text-lg font-bold">{problem.title}</h1>
                <div className="flex gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
                    {problem.category}
                  </span>
                </div>
              </div>

              {/* Tabs Mobile */}
              <div className="flex border-b border-slate-800 px-3 overflow-x-auto">
                {tabs.map(({ id: tabId, label, icon: Icon }) => (
                  <button
                    key={tabId}
                    onClick={() => setActiveTab(tabId)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tabId
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Content Mobile */}
              <div className="p-5 pb-24 space-y-4">
                {activeTab === 'description' && (
                  <p className="text-slate-300 leading-relaxed text-sm">{problem.description}</p>
                )}
                {activeTab === 'examples' &&
                  problem.examples.map((ex, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                      <div className="px-4 py-2 bg-slate-800/60 text-xs font-semibold text-slate-400 uppercase">
                        Example {i + 1}
                      </div>
                      <div className="p-4 font-mono text-xs space-y-2">
                        <div>
                          <span className="text-blue-400 font-bold">Input:</span> <span className="text-slate-300">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-green-400 font-bold">Output:</span> <span className="text-slate-300">{ex.output}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                {activeTab === 'constraints' &&
                  problem.constraints.map((c, i) => (
                    <div key={i} className="flex gap-2 bg-slate-900/40 border border-slate-800 rounded-lg px-4 py-3 text-xs">
                      <span className="text-blue-400">•</span>
                      <code className="text-slate-300">{c}</code>
                    </div>
                  ))}
              </div>

              {/* Chat Mobile */}
              <div className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 max-h-64 flex flex-col">
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-2">
                      <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-xs flex-shrink-0">
                        {msg.name === 'Burak Orkmez' ? '👨‍💼' : '👤'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-semibold text-slate-300">{msg.name}</span>
                          <span className="text-xs text-slate-600">{msg.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-400 break-words">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-3 py-2 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Message..."
                    className="flex-1 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
                  />
                  <button onClick={handleSendMessage} className="p-1.5 bg-blue-600 text-white rounded">
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col bg-slate-900">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 shrink-0">
                <div className="flex gap-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedLanguage === lang.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {lang.icon} {lang.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg text-xs disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Running
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      Run
                    </>
                  )}
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <Editor
                  height="100%"
                  language={languages.find((l) => l.id === selectedLanguage)?.monacoLang}
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
              {output && (
                <div className="border-t border-slate-800 bg-slate-950 p-3 max-h-40 overflow-auto">
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
