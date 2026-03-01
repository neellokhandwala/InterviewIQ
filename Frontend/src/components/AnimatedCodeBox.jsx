import { useState, useEffect } from 'react';

const codeLines = [
  { tokens: [{ text: 'function ', color: 'text-violet-400' }, { text: 'twoSum', color: 'text-yellow-300' }, { text: '(nums, target) {', color: 'text-slate-300' }] },
  { tokens: [{ text: '  const ', color: 'text-violet-400' }, { text: 'map', color: 'text-blue-300' }, { text: ' = ', color: 'text-slate-300' }, { text: 'new ', color: 'text-violet-400' }, { text: 'Map();', color: 'text-blue-300' }] },
  { tokens: [{ text: '', color: '' }] },
  { tokens: [{ text: '  for ', color: 'text-violet-400' }, { text: '(let ', color: 'text-slate-300' }, { text: 'i ', color: 'text-orange-300' }, { text: '= ', color: 'text-slate-300' }, { text: '0', color: 'text-green-400' }, { text: '; i < nums.length; i++) {', color: 'text-slate-300' }] },
  { tokens: [{ text: '    const ', color: 'text-violet-400' }, { text: 'comp', color: 'text-blue-300' }, { text: ' = target - nums[i];', color: 'text-slate-300' }] },
  { tokens: [{ text: '    if ', color: 'text-violet-400' }, { text: '(map.', color: 'text-slate-300' }, { text: 'has', color: 'text-yellow-300' }, { text: '(comp)) {', color: 'text-slate-300' }] },
  { tokens: [{ text: '      return ', color: 'text-violet-400' }, { text: '[map.', color: 'text-slate-300' }, { text: 'get', color: 'text-yellow-300' }, { text: '(comp), i];', color: 'text-slate-300' }] },
  { tokens: [{ text: '    }', color: 'text-slate-300' }] },
  { tokens: [{ text: '    map.', color: 'text-slate-300' }, { text: 'set', color: 'text-yellow-300' }, { text: '(nums[i], i);', color: 'text-slate-300' }] },
  { tokens: [{ text: '  }', color: 'text-slate-300' }] },
  { tokens: [{ text: '}', color: 'text-slate-300' }] },
  { tokens: [{ text: '', color: '' }] },
  { tokens: [{ text: '// ✓ Output: ', color: 'text-slate-500' }, { text: '[0, 1]', color: 'text-green-400' }] },
];

const users = [
  { name: 'Neel', color: 'bg-blue-500',   ring: 'ring-blue-400',   dot: 'bg-blue-400'   },
  { name: 'Alex', color: 'bg-violet-500', ring: 'ring-violet-400', dot: 'bg-violet-400' },
];

export default function AnimatedCodeBox() {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine]       = useState(0);
  const [done, setDone]                     = useState(false);

  useEffect(() => {
    if (currentLine >= codeLines.length) { setDone(true); return; }
    const t = setTimeout(() => {
      setDisplayedLines(prev => [...prev, codeLines[currentLine]]);
      setCurrentLine(c => c + 1);
    }, 120);
    return () => clearTimeout(t);
  }, [currentLine]);

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">

      {/* Glow behind box */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-blue-500/10 rounded-2xl blur-xl" />

      {/* Main box */}
      <div className="relative bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">

        {/* ── TITLE BAR ── */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/60 rounded-lg border border-slate-700/40">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-xs text-slate-400 font-mono">twoSum.js</span>
          </div>
          <div className="flex items-center gap-1">
            {users.map(u => (
              <div key={u.name} className={`w-5 h-5 rounded-full ${u.color} ring-1 ${u.ring} flex items-center justify-center text-[9px] font-bold text-white`}>
                {u.name[0]}
              </div>
            ))}
          </div>
        </div>

        {/* ── CODE AREA ── */}
        <div className="px-4 py-4 min-h-[400px] font-mono text-[13px] leading-6 overflow-hidden">
          {displayedLines.map((line, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-start"
              style={{ animation: 'slideIn 0.2s ease-out forwards', opacity: 0 }}
            >
              <span className="text-slate-600 text-xs pt-0.5 w-4 text-right shrink-0 select-none">
                {idx + 1}
              </span>
              <span className="flex flex-wrap">
                {line.tokens.map((token, ti) => (
                  <span key={ti} className={`${token.color} whitespace-pre`}>{token.text}</span>
                ))}
              </span>
            </div>
          ))}

          {/* blinking cursor */}
          {!done && (
            <div className="flex gap-4 items-center mt-0.5">
              <span className="w-4" />
              <span className="w-0.5 h-4 bg-blue-400 animate-pulse rounded-full" />
            </div>
          )}
        </div>

        {/* ── FOOTER BAR ── */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/60 border-t border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {users.map(u => (
                <div key={u.name} className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${u.dot} animate-pulse`} />
                  <span className="text-xs text-slate-400">{u.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Live session
          </div>
        </div>
      </div>

      {/* keyframe injected inline */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-8px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}