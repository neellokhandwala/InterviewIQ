import { useState, useEffect } from 'react';
import './AnimatedCodeBox.css';

const codeLines = [
  { text: 'function mergeSortedArrays(arr1, arr2) {', type: 'keyword' },
  { text: '  const result = [];', type: 'content' },
  { text: '  let i = 0, j = 0;', type: 'content' },
  { text: '  ', type: 'content' },
  { text: '  while (i < arr1.length && j < arr2.length) {', type: 'keyword' },
  { text: '    if (arr1[i] <= arr2[j]) {', type: 'keyword' },
  { text: '      result.push(arr1[i++]);', type: 'content' },
  { text: '    } else {', type: 'keyword' },
  { text: '      result.push(arr2[j++]);', type: 'content' },
  { text: '    }', type: 'keyword' },
  { text: '  }', type: 'keyword' },
  { text: '  ', type: 'content' },
  { text: '  return result.concat(arr1.slice(i), arr2.slice(j));', type: 'content' },
  { text: '}', type: 'keyword' },
];

export default function AnimatedCodeBox() {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    if (!isAnimating || currentLineIndex >= codeLines.length) {
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedLines([...displayedLines, codeLines[currentLineIndex]]);
      setCurrentLineIndex(currentLineIndex + 1);
    }, 100); // Delay between lines

    return () => clearTimeout(timer);
  }, [isAnimating, currentLineIndex, displayedLines]);

  return (
    <div className="animated-code-container">
      <div className="code-box">
        {/* Editor Header */}
        <div className="editor-header">
          <div className="traffic-lights">
            <div className="light red"></div>
            <div className="light yellow"></div>
            <div className="light green"></div>
          </div>
          <span className="filename">solution.js</span>
        </div>

        {/* Code Content */}
        <div className="code-content">
          {displayedLines.map((line, idx) => (
            <div key={idx} className="code-line">
              <span className="line-number">{idx + 1}</span>
              <span className="line-text">
                {line.text.split('').map((char, charIdx) => (
                  <span
                    key={charIdx}
                    className="char"
                    style={{
                      animationDelay: `${(charIdx * 20) / 1000}s`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </div>
          ))}
          {isAnimating && currentLineIndex < codeLines.length && (
            <div className="cursor-line">
              <span className="cursor">|</span>
            </div>
          )}
        </div>

        {/* Collaboration Indicator */}
        <div className="collaboration-footer">
          <div className="collaborators">
            <div className="avatar blue"></div>
            <div className="avatar purple"></div>
          </div>
          <span className="collab-text">2 collaborating now</span>
        </div>
      </div>
    </div>
  );
}
