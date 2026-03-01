// Judge0 CE - free code execution API, no auth required
const JUDGE0_API = "https://ce.judge0.com";

// Judge0 CE language IDs
const LANGUAGE_CONFIG = {
  javascript: { id: 63,  name: "JavaScript (Node.js 12.14.0)" },
  python:     { id: 71,  name: "Python (3.8.1)" },
  java:       { id: 62,  name: "Java (OpenJDK 13.0.1)" },
};

/**
 * @param {string} language - programming language
 * @param {string} code - source code to execute
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const langConfig = LANGUAGE_CONFIG[language];
    if (!langConfig) {
      return { success: false, error: `Unsupported language: ${language}` };
    }

    // Step 1: Submit the code
    const submitResponse = await fetch(`${JUDGE0_API}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        language_id: langConfig.id,
        source_code: code,
        stdin: "",
      }),
    });

    if (!submitResponse.ok) {
      // Fallback to Piston if Judge0 also fails
      return await executeWithPiston(language, code);
    }

    const result = await submitResponse.json();

    // Status IDs: 3 = Accepted, 6 = Compilation Error, 11 = Runtime Error, etc.
    const stdout = result.stdout || "";
    const stderr = result.stderr || "";
    const compileOutput = result.compile_output || "";
    const statusId = result.status?.id;

    if (statusId === 3) {
      // Accepted / success
      return {
        success: true,
        output: stdout || "No output",
      };
    } else if (statusId === 6) {
      // Compilation Error
      return {
        success: false,
        output: stdout,
        error: compileOutput || "Compilation Error",
      };
    } else {
      // Runtime Error, TLE, etc.
      return {
        success: false,
        output: stdout,
        error: stderr || compileOutput || result.status?.description || "Execution Error",
      };
    }

  } catch (error) {
    // If Judge0 fails entirely, try Piston as fallback
    return await executeWithPiston(language, code);
  }
}

// Piston as fallback (emkc.org)
async function executeWithPiston(language, code) {
  try {
    const LANGUAGE_VERSIONS = {
      javascript: { language: "javascript", version: "18.15.0" },
      python:     { language: "python",     version: "3.10.0" },
      java:       { language: "java",        version: "15.0.2" },
    };

    const config = LANGUAGE_VERSIONS[language];
    if (!config) return { success: false, error: `Unsupported language: ${language}` };

    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: config.language,
        version: config.version,
        files: [{ name: `main.${getFileExtension(language)}`, content: code }],
      }),
    });

    if (!response.ok) {
      return { success: false, error: `Both execution APIs failed. Try again later.` };
    }

    const data = await response.json();
    const output = data.run.output || "";
    const stderr = data.run.stderr || "";

    if (stderr) return { success: false, output, error: stderr };
    return { success: true, output: output || "No output" };

  } catch (err) {
    return { success: false, error: `Execution failed: ${err.message}` };
  }
}

function getFileExtension(language) {
  return { javascript: "js", python: "py", java: "java" }[language] || "txt";
}