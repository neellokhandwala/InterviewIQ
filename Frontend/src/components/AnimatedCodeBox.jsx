import { useState, useEffect } from 'react';

const codeLines = [
  { tokens: [{ text: 'function ', color: '#84CC16' }, { text: 'twoSum', color: '#F59E0B' }, { text: '(nums, target) {', color: '#F5F0E8' }] },
  { tokens: [{ text: '  const ', color: '#84CC16' }, { text: 'map', color: '#0EA5E9' }, { text: ' = ', color: '#F5F0E8' }, { text: 'new ', color: '#84CC16' }, { text: 'Map();', color: '#0EA5E9' }] },
  { tokens: [{ text: '', color: '' }] },
  { tokens: [{ text: '  for ', color: '#84CC16' }, { text: '(let ', color: '#F5F0E8' }, { text: 'i ', color: '#D97706' }, { text: '= ', color: '#F5F0E8' }, { text: '0', color: '#65A30D' }, { text: '; i < nums.length; i++) {', color: '#F5F0E8' }] },
  { tokens: [{ text: '    const ', color: '#84CC16' }, { text: 'comp', color: '#0EA5E9' }, { text: ' = target - nums[i];', color: '#F5F0E8' }] },
  { tokens: [{ text: '    if ', color: '#84CC16' }, { text: '(map.', color: '#F5F0E8' }, { text: 'has', color: '#F59E0B' }, { text: '(comp)) {', color: '#F5F0E8' }] },
  { tokens: [{ text: '      return ', color: '#84CC16' }, { text: '[map.', color: '#F5F0E8' }, { text: 'get', color: '#F59E0B' }, { text: '(comp), i];', color: '#F5F0E8' }] },
  { tokens: [{ text: '    }', color: '#F5F0E8' }] },
  { tokens: [{ text: '    map.', color: '#F5F0E8' }, { text: 'set', color: '#F59E0B' }, { text: '(nums[i], i);', color: '#F5F0E8' }] },
  { tokens: [{ text: '  }', color: '#F5F0E8' }] },
  { tokens: [{ text: '}', color: '#F5F0E8' }] },
  { tokens: [{ text: '', color: '' }] },
  { tokens: [{ text: '// ✓ Output: ', color: '#6B5E52' }, { text: '[0, 1]', color: '#65A30D' }] },
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
      <div className="absolute -inset-2 rounded-2xl blur-xl" style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.1), rgba(245,158,11,0.05), rgba(217,119,6,0.1))' }} />

      {/* Main box */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-colors duration-200" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-accent)', borderWidth: '1px', boxShadow: `0 20px 25px -5px var(--accent-glow)` }}>

        {/* ── TITLE BAR ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b transition-colors duration-200" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#DC2626' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#65A30D' }} />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg border transition-colors duration-200" style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border)' }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
            <span className="text-xs font-mono transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>twoSum.js</span>
          </div>
          <div className="flex items-center gap-1">
            {users.map(u => (
              <div key={u.name} className="w-5 h-5 rounded-full ring-1 flex items-center justify-center text-[9px] font-bold text-white transition-colors duration-200" style={{ backgroundColor: u.color, borderColor: u.ring }}>
                {u.name[0]}
              </div>
            ))}
          </div>
        </div>

        {/* ── CODE AREA ── */}
        <div className="px-4 py-4 min-h-[400px] font-mono text-[13px] leading-6 overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
          {displayedLines.map((line, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-start"
              style={{ animation: 'slideIn 0.2s ease-out forwards', opacity: 0 }}
            >
              <span className="text-xs pt-0.5 w-4 text-right shrink-0 select-none" style={{ color: 'var(--text-muted)' }}>
                {idx + 1}
              </span>
              <span className="flex flex-wrap">
                {line.tokens.map((token, ti) => (
                  <span key={ti} style={{ color: token.color, whiteSpace: 'pre' }}>{token.text}</span>
                ))}
              </span>
            </div>
          ))}

          {/* blinking cursor */}
          {!done && (
            <div className="flex gap-4 items-center mt-0.5">
              <span className="w-4" />
              <span className="w-0.5 h-4 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
            </div>
          )}
        </div>

        {/* ── FOOTER BAR ── */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t transition-colors duration-200" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {users.map(u => (
                <div key={u.name} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: u.dot }} />
                  <span className="text-xs transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>{u.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
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
