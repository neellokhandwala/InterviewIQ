import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Play, Copy, Check, AlertCircle, Clock, Code } from 'lucide-react';
import Editor from '@monaco-editor/react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const ProblemDetailPage = ({ problemId = 1 }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState(pythonTemplate);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedExample, setSelectedExample] = useState(0);
  const [isMobileEditorOpen, setIsMobileEditorOpen] = useState(false);
  const editorRef = useRef(null);

  // Sample problem data
  const problem = {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Array',
    description: 'Given an array of integers nums and an integer target, return the indices of the two numbers in the array such that they add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'The sum of 2 and 7 is 9. Therefore, index1 = 0, index2 = 1. We return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'The sum of 2 and 4 is 6. Therefore, index1 = 1, index2 = 2. We return [1, 2].'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
        explanation: 'The sum of 3 and 3 is 6. Therefore, index1 = 0, index2 = 1. We return [0, 1].'
      }
    ],
    constraints: [
      '2 ≤ nums.length ≤ 10^4',
      '-10^9 ≤ nums[i] ≤ 10^9',
      '-10^9 ≤ target ≤ 10^9',
      'Only one valid answer exists.'
    ],
    timeLimit: '1 second',
    memoryLimit: '256 MB'
  };

  const languages = [
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'javascript', name: 'JavaScript', icon: '📜' },
    { id: 'java', name: 'Java', icon: '☕' }
  ];

  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId);
    setCode(getTemplate(langId));
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOutput('Test case 1: ✓ Passed\nTest case 2: ✓ Passed\nTest case 3: ✓ Passed\n\nAll tests passed! 🎉');
      toast.success('Code executed successfully!');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      toast.error('Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Mobile Editor Toggle Button */}
        <div className="fixed bottom-6 right-6 lg:hidden z-50">
          {!isMobileEditorOpen && (
            <button
              onClick={() => setIsMobileEditorOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105"
            >
              <span>Code Editor</span>
            </button>
          )}
        </div>

        {/* Left Panel - Problem Details */}
        <div className={`w-full lg:w-[45%] overflow-y-auto border-r border-slate-800 bg-slate-950 ${isMobileEditorOpen ? 'hidden lg:block' : 'block'}`}>
          <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="space-y-4 animate-in fade-in slide-in-from-left duration-500">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-100">{problem.title}</h1>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-sm text-slate-400">{problem.category}</span>
                  </div>
                </div>
              </div>

              {/* Problem Selector Dropdown */}
              <div className="relative">
                <button className="w-full lg:w-auto flex items-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors group">
                  <span className="text-sm text-slate-300 font-medium">View Other Problems</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-transform group-hover:rotate-180" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 animate-in fade-in slide-in-from-left duration-500 delay-100">
              <h2 className="text-xl font-semibold text-slate-100">Description</h2>
              <p className="text-slate-300 leading-relaxed text-base">
                {problem.description}
              </p>
            </div>

            {/* Examples */}
            <div className="space-y-4 animate-in fade-in slide-in-from-left duration-500 delay-150">
              <h2 className="text-xl font-semibold text-slate-100">Examples</h2>
              <div className="space-y-3">
                {problem.examples.map((example, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedExample(idx)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                      selectedExample === idx
                        ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20'
                        : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-sm font-semibold text-slate-100 mb-2">Example {idx + 1}</div>
                    <div className="space-y-2">
                      <div className="font-mono text-xs text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-700">
                        <span className="text-blue-400">Input:</span> {example.input}
                      </div>
                      <div className="font-mono text-xs text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-700">
                        <span className="text-green-400">Output:</span> {example.output}
                      </div>
                      {example.explanation && (
                        <div className="text-xs text-slate-400 mt-2 italic">
                          {example.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div className="space-y-4 animate-in fade-in slide-in-from-left duration-500 delay-200">
              <h2 className="text-xl font-semibold text-slate-100">Constraints</h2>
              <ul className="space-y-2">
                {problem.constraints.map((constraint, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="text-blue-400 font-bold mt-1">•</span>
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info Footer */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{problem.timeLimit}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{problem.memoryLimit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className={`fixed inset-0 lg:relative lg:flex flex-col w-full lg:w-[55%] bg-slate-900 border-l border-slate-800 z-40 ${isMobileEditorOpen ? 'flex' : 'hidden'}`}>
          {/* Mobile Back Button */}
          <div className="lg:hidden flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950/50">
            <button
              onClick={() => setIsMobileEditorOpen(false)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm"
            >
              ← Back to Problem
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950/50">
            <span className="text-sm font-semibold text-slate-400">Language:</span>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                    selectedLanguage === lang.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{lang.icon}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage={selectedLanguage}
              language={selectedLanguage}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'Fira Code, monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 p-4 border-t border-slate-800 bg-slate-950/50">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-green-500/30"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Code
                </>
              )}
            </button>
            <button
              onClick={handleCopyCode}
              className="flex items-center justify-center px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Output */}
          <div className="border-t border-slate-800 bg-slate-950 p-4">
            <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Output</div>
            <div className={`p-4 rounded-lg text-sm font-mono ${
              output.includes('Error')
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : output.includes('passed')
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-slate-800/50 text-slate-300 border border-slate-700'
            }`}>
              {output || 'Click "Run Code" to see output here...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Code templates for different languages
const pythonTemplate = `def twoSum(nums: list[int], target: int) -> list[int]:
    """
    Find two numbers that add up to target.
    
    Args:
        nums: List of integers
        target: Target sum
    
    Returns:
        List containing indices of the two numbers
    """
    # Create a hash map to store seen numbers
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        # Check if complement exists in map
        if complement in num_map:
            return [num_map[complement], i]
        
        # Store current number and its index
        num_map[num] = i
    
    return []  # No solution found


# Example usage
if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    target = 9
    result = twoSum(nums, target)
    print(f"Output: {result}")
`;

const javascriptTemplate = `/**
 * Find two numbers that add up to target.
 * @param {number[]} nums - Array of integers
 * @param {number} target - Target sum
 * @return {number[]} - Indices of the two numbers
 */
function twoSum(nums, target) {
    // Create a hash map to store seen numbers
    const numMap = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const complement = target - num;
        
        // Check if complement exists in map
        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }
        
        // Store current number and its index
        numMap.set(num, i);
    }
    
    return [];  // No solution found
}

// Example usage
const nums = [2, 7, 11, 15];
const target = 9;
const result = twoSum(nums, target);
console.log(\`Output: [\${result}]\`);
`;

const javaTemplate = `class Solution {
    /**
     * Find two numbers that add up to target.
     * @param nums Array of integers
     * @param target Target sum
     * @return Indices of the two numbers
     */
    public int[] twoSum(int[] nums, int target) {
        // Create a hash map to store seen numbers
        Map<Integer, Integer> numMap = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int num = nums[i];
            int complement = target - num;
            
            // Check if complement exists in map
            if (numMap.containsKey(complement)) {
                return new int[] { 
                    numMap.get(complement), i 
                };
            }
            
            // Store current number and its index
            numMap.put(num, i);
        }
        
        return new int[0];  // No solution found
    }
    
    // Example usage
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = new Solution().twoSum(nums, target);
        System.out.println("Output: " + Arrays.toString(result));
    }
}
`;

function getTemplate(langId) {
  switch (langId) {
    case 'python':
      return pythonTemplate;
    case 'javascript':
      return javascriptTemplate;
    case 'java':
      return javaTemplate;
    default:
      return pythonTemplate;
  }
}

export default ProblemDetailPage;
