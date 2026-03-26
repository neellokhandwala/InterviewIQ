import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import {
  Play, Copy, Check, AlertCircle, Clock,
  ChevronLeft, ChevronRight, BookOpen, TestTube,
  Terminal, CheckCircle, XCircle, Code2, List
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { PROBLEMS_DATA } from '../data/problemsData';
import { executeCode } from '../lib/piston';   // ← real Piston executor
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: '📜', monacoLang: 'javascript' },
  { id: 'python',     name: 'Python',     icon: '🐍', monacoLang: 'python' },
  { id: 'java',       name: 'Java',       icon: '☕', monacoLang: 'java' },
];

const getDifficultyColor = (d) => {
  const styles = {
    Easy: { backgroundColor: 'rgba(101, 163, 13, 0.12)', color: '#65A30D', borderColor: 'rgba(101, 163, 13, 0.25)' },
    Medium: { backgroundColor: 'rgba(217, 119, 6, 0.12)', color: '#D97706', borderColor: 'rgba(217, 119, 6, 0.25)' },
    Hard: { backgroundColor: 'rgba(220, 38, 38, 0.12)', color: '#DC2626', borderColor: 'rgba(220, 38, 38, 0.25)' },
  };
  return styles[d] || { backgroundColor: 'rgba(107, 94, 82, 0.12)', color: '#6B5E52', borderColor: 'rgba(107, 94, 82, 0.25)' };
};

const allProblems = Object.values(PROBLEMS_DATA);

// Normalize output for comparison
const normalize = (str) =>
  str.trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, '').toLowerCase();

export default function ProblemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const problem = PROBLEMS_DATA[Number(id)] || PROBLEMS_DATA[1];

  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const getSavedCode = (problemId, lang) => {
    return localStorage.getItem(`code_${problemId}_${lang}`) 
      || PROBLEMS_DATA[problemId]?.starterCode[lang];
  };
  const [code, setCode] = useState(() => getSavedCode(problem.id, 'javascript'));
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showProblemList, setShowProblemList] = useState(false);
  const [isMobileEditorOpen, setIsMobileEditorOpen] = useState(false);

  useEffect(() => {
    setCode(getSavedCode(Number(id), selectedLanguage));
    setOutput(null);
  }, [id, selectedLanguage]);

  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId);
    setCode(problem.starterCode[langId]);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      // For JS and Python: append test runner to user's code
      // For Java: user's starter already has main with test cases
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

  const currentIndex = allProblems.findIndex((p) => p.id === problem.id);
  const prevProblem = allProblems[currentIndex - 1];
  const nextProblem = allProblems[currentIndex + 1];

  const tabs = [
    { id: 'description', label: 'Description', icon: BookOpen },
    { id: 'examples',    label: 'Examples',    icon: TestTube },
    { id: 'constraints', label: 'Constraints', icon: AlertCircle },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 h-screen flex flex-col overflow-hidden">
      <Navbar />

      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        {!isMobileEditorOpen ? (
          <button onClick={() => setIsMobileEditorOpen(true)}
            className="flex items-center gap-2 px-5 py-3 text-black font-semibold rounded-xl hover:scale-105 transition-all"
            style={{ background: 'var(--gradient-gold)', boxShadow: '0 4px 20px var(--accent-glow)' }}>
            <Code2 className="w-4 h-4" /> Open Editor
          </button>
        ) : (
          <button onClick={() => setIsMobileEditorOpen(false)}
            className="flex items-center gap-2 px-5 py-3 font-semibold rounded-xl border transition-all"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            <BookOpen className="w-4 h-4" /> View Problem
          </button>
        )}
      </div>

      <div className="flex-1 pt-16 overflow-hidden">

        {/* ── DESKTOP: resizable panels ── */}
        <div className="hidden lg:block h-full">
          <PanelGroup direction="horizontal">

            {/* LEFT PANEL */}
            <Panel defaultSize={42} minSize={28} maxSize={60}>
              <div className="h-full flex flex-col transition-colors duration-200" style={{ backgroundColor: 'var(--bg-base)', borderRight: `1px solid var(--border)` }}>

                <div className="px-5 pt-4 pb-3 space-y-2 shrink-0 relative transition-colors duration-200" style={{ borderBottom: `1px solid var(--border)` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>
                      <span onClick={() => navigate('/problems')}
                        className="cursor-pointer transition-colors duration-200" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Problems</span>
                      <ChevronRight className="w-3 h-3" />
                      <span style={{ color: 'var(--text-secondary)' }}>#{problem.id} {problem.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => prevProblem && navigate(`/problems/${prevProblem.id}`)}
                        disabled={!prevProblem}
                        className="p-1.5 rounded-lg disabled:opacity-30 transition-all"
                        style={{ backgroundColor: 'transparent', color: 'var(--text-muted)' }}>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => setShowProblemList(!showProblemList)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{ backgroundColor: 'transparent', color: 'var(--text-muted)' }}>
                        <List className="w-4 h-4" />
                      </button>
                      <button onClick={() => nextProblem && navigate(`/problems/${nextProblem.id}`)}
                        disabled={!nextProblem}
                        className="p-1.5 rounded-lg disabled:opacity-30 transition-all"
                        style={{ backgroundColor: 'transparent', color: 'var(--text-muted)' }}>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Problem list dropdown */}
                  {showProblemList && (
                    <div className="absolute left-0 top-full mt-1 w-72 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto transition-colors duration-200" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', borderWidth: '1px' }}>
                      {allProblems.map((p) => (
                        <button key={p.id}
                          onClick={() => { navigate(`/problems/${p.id}`); setShowProblemList(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors text-sm"
                          style={{ backgroundColor: p.id === problem.id ? 'var(--bg-elevated)' : 'transparent', color: 'var(--text-primary)' }}>
                          <span style={{ color: 'var(--text-muted)' }} className="w-5 text-xs">#{p.id}</span>
                          <span className="flex-1">{p.title}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full border transition-colors duration-200" style={{ ...getDifficultyColor(p.difficulty), borderWidth: '1px', borderStyle: 'solid' }}>{p.difficulty}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <h1 className="text-xl font-bold transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>{problem.title}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full border text-xs font-semibold transition-colors duration-200" style={{ ...getDifficultyColor(problem.difficulty), borderWidth: '1px', borderStyle: 'solid' }}>
                      {problem.difficulty}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full border text-xs transition-colors duration-200" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                      {problem.category}
                    </span>
                    <div className="flex items-center gap-3 text-xs ml-auto transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{problem.timeLimit}</span>
                      <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" />{problem.memoryLimit}</span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex px-3 shrink-0 transition-colors duration-200" style={{ borderBottom: `1px solid var(--border)` }}>
                  {tabs.map(({ id: tabId, label, icon: Icon }) => (
                    <button key={tabId} onClick={() => setActiveTab(tabId)}
                      className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all duration-200"
                      style={{
                        borderBottomColor: activeTab === tabId ? 'var(--accent)' : 'transparent',
                        color: activeTab === tabId ? 'var(--accent)' : 'var(--text-secondary)'
                      }}>
                      <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                  ))}
                </div>

                {/* Scrollable tab content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
                  {activeTab === 'description' && (
                    <p className="leading-relaxed text-sm">{problem.description}</p>
                  )}
                  {activeTab === 'examples' && (
                    <div className="space-y-3">
                      {problem.examples.map((ex, i) => (
                        <div key={i} className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200" style={{ backgroundColor: 'var(--bg-muted)', borderBottom: `1px solid var(--border)`, color: 'var(--text-muted)' }}>
                            Example {i + 1}</div>
                          <div className="p-4 space-y-2 font-mono text-xs">
                            <div className="flex gap-2">
                              <span className="font-bold w-16 shrink-0 transition-colors duration-200" style={{ color: 'var(--accent)' }}>Input:</span>
                              <span className="transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>{ex.input}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="font-bold w-16 shrink-0 transition-colors duration-200" style={{ color: 'var(--success)' }}>Output:</span>
                              <span className="transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>{ex.output}</span>
                            </div>
                            {ex.explanation && (
                              <div className="flex gap-2 pt-2 transition-colors duration-200" style={{ borderTop: `1px solid var(--border)` }}>
                                <span className="font-bold w-16 shrink-0 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>Explain:</span>
                                <span className="transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>{ex.explanation}</span>
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
                        <li key={i} className="flex items-start gap-3 rounded-lg px-4 py-3 border transition-colors duration-200" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                          <span className="font-bold mt-0.5 transition-colors duration-200" style={{ color: 'var(--accent)' }}>•</span>
                          <code className="font-mono text-xs transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>{c}</code>
                        </li>
                      ))}
                    </ul>
                  )}
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

            <PanelResizeHandle className="w-1.5 transition-colors cursor-col-resize" style={{ backgroundColor: 'var(--border)' }} onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--border)'} />

            {/* RIGHT PANEL */}
            <Panel defaultSize={58} minSize={35}>
              <PanelGroup direction="vertical">

                {/* Code Editor */}
                <Panel defaultSize={65} minSize={30}>
                  <div className="h-full flex flex-col transition-colors duration-200" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <div className="flex items-center justify-between px-4 py-2.5 shrink-0 transition-colors duration-200" style={{ backgroundColor: 'var(--bg-elevated)', borderBottom: `1px solid var(--border)` }}>
                      <div className="flex gap-1.5">
                        {languages.map((lang) => (
                          <button key={lang.id} onClick={() => handleLanguageChange(lang.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                            style={{
                              backgroundColor: selectedLanguage === lang.id ? 'var(--accent)' : 'var(--bg-muted)',
                              color: selectedLanguage === lang.id ? '#000' : 'var(--text-secondary)',
                              boxShadow: selectedLanguage === lang.id ? `0 4px 12px var(--accent-glow)` : 'none'
                            }}>
                            <span>{lang.icon}</span>{lang.name}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={handleCopy}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs border"
                          style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                          {copied
                            ? <><Check className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} /><span style={{ color: 'var(--success)' }}>Copied!</span></>
                            : <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>}
                        </button>
                        <button onClick={handleRunCode} disabled={isRunning}
                          className="relative group flex items-center gap-2 px-4 py-1.5 font-semibold rounded-lg transition-all text-xs overflow-hidden"
                          style={{
                            background: isRunning ? 'var(--bg-muted)' : 'var(--gradient-gold)',
                            color: isRunning ? 'var(--text-muted)' : '#000',
                            cursor: isRunning ? 'not-allowed' : 'pointer',
                            opacity: isRunning ? '0.6' : '1',
                            boxShadow: isRunning ? 'none' : `0 4px 12px var(--accent-glow)`
                          }}>
                          {!isRunning && <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />}
                          {isRunning
                            ? <><div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />Running...</>
                            : <><Play className="w-3.5 h-3.5" />Run Code</>}
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

                <PanelResizeHandle className="h-1.5 transition-colors cursor-row-resize" style={{ backgroundColor: 'var(--border)' }} onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--border)'} />

                {/* Output */}
                <Panel defaultSize={35} minSize={15}>
                  <div className="h-full flex flex-col transition-colors duration-200" style={{ backgroundColor: 'var(--bg-base)' }}>
                    <div className="flex items-center gap-2 px-4 py-2.5 shrink-0 transition-colors duration-200" style={{ borderBottom: `1px solid var(--border)`, color: 'var(--text-muted)' }}>
                      <Terminal className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Output</span>
                      {output && (
                        <span className="ml-auto flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium transition-colors duration-200" style={{
                          backgroundColor: output.success ? 'rgba(101, 163, 13, 0.12)' : 'rgba(220, 38, 38, 0.12)',
                          color: output.success ? '#65A30D' : '#DC2626',
                          borderColor: output.success ? 'rgba(101, 163, 13, 0.25)' : 'rgba(220, 38, 38, 0.25)'
                        }}>
                          {output.success
                            ? <><CheckCircle className="w-3 h-3" />All Passed</>
                            : <><XCircle className="w-3 h-3" />Failed</>}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                      {output === null ? (
                        <div className="h-full flex flex-col items-center justify-center gap-2 transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>
                          <Terminal className="w-7 h-7" />
                          <p className="text-sm">Click "Run Code" to see output</p>
                        </div>
                      ) : (
                        <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed transition-colors duration-200" style={{ color: output.success ? 'var(--success)' : 'var(--danger)' }}>
                          {output.text}
                        </pre>
                      )}
                    </div>
                  </div>
                </Panel>

              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>

        {/* ── MOBILE ── */}
        <div className="lg:hidden h-full">
          {!isMobileEditorOpen ? (
            <div className="h-full overflow-y-auto transition-colors duration-200" style={{ backgroundColor: 'var(--bg-base)' }}>
              <div className="px-5 pt-4 pb-3 space-y-2 transition-colors duration-200" style={{ borderBottom: `1px solid var(--border)` }}>
                <span onClick={() => navigate('/problems')} className="text-xs cursor-pointer transition-colors duration-200" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>← Back to Problems</span>
                <h1 className="text-xl font-bold">{problem.title}</h1>
                <div className="flex gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">{problem.category}</span>
                </div>
              </div>
              <div className="flex border-b border-slate-800 px-3">
                {tabs.map(({ id: tabId, label, icon: Icon }) => (
                  <button key={tabId} onClick={() => setActiveTab(tabId)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all ${activeTab === tabId ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}>
                    <Icon className="w-3.5 h-3.5" />{label}
                  </button>
                ))}
              </div>
              <div className="p-5 pb-24 space-y-4">
                {activeTab === 'description' && <p className="text-slate-300 leading-relaxed text-sm">{problem.description}</p>}
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
          ) : (
            <div className="h-full flex flex-col bg-slate-900">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 shrink-0">
                <div className="flex gap-1">
                  {languages.map((lang) => (
                    <button key={lang.id} onClick={() => handleLanguageChange(lang.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedLanguage === lang.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {lang.icon} {lang.name}
                    </button>
                  ))}
                </div>
                <button onClick={handleRunCode} disabled={isRunning}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg text-xs disabled:opacity-50">
                  {isRunning ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Running</> : <><Play className="w-3 h-3" />Run</>}
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <Editor height="100%"
                  language={languages.find((l) => l.id === selectedLanguage)?.monacoLang}
                  value={code} onChange={(val) => setCode(val || '')} theme="vs-dark"
                  options={{ fontSize: 13, minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false, automaticLayout: true }} />
              </div>
              {output && (
                <div className="border-t border-slate-800 bg-slate-950 p-3 max-h-40 overflow-auto">
                  <pre className={`text-xs font-mono whitespace-pre-wrap ${output.success ? 'text-green-400' : 'text-red-400'}`}>{output.text}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
