import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, RotateCcw, Copy, Code2, Cpu, FileText, Info, 
  Terminal, Check, BookOpen, ExternalLink, ArrowRight 
} from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.DEV ? 'http://localhost:8080/api/run' : '/api/run';

const EXAMPLES = {
  hello: `print "Hello from BLOOP!"
print "This is your first compiled script running in a web sandbox!"`,
  
  variables: `put 10 into x
put 20 into y
put x + y into z

print "x is:"
print x
print "y is:"
print y
print "z = x + y is:"
print z`,

  calculator: `put 15 into a
put 5 into b

put a + b into sum
put a - b into diff
put a * b into prod
put a / b into quot

print "Arithmetic operations on 15 and 5:"
print "Sum:"
print sum
print "Difference:"
print diff
print "Product:"
print prod
print "Quotient:"
print quot`,

  conditions: `put 85 into score

if score > 90 then:
    print "Grade A"

if score > 80 then:
    print "Grade B"

if score < 60 then:
    print "Grade F"`,

  loops: `print "Counting down..."

repeat 5 times:
    print "Tick!"

print "Liftoff!"`,

  nested_conditions: `put 25 into age
put 1 into isStudent

print "Evaluating user profile:"

if age < 30 then:
    print "Profile check: age is under 30"

if isStudent == 1 then:
    print "Profile check: user is a student"`
};

const DOCS_PAGES = {
  overview: {
    title: 'Language Overview',
    content: (
      <>
        <p className="docs-text">
          <strong>BLOOP</strong> is a custom educational interpreted programming language written in Java.
          It features a clean, English-like syntax designed to make programming concepts readable and intuitive.
        </p>
        <p className="docs-text">
          BLOOP compilation flows through a classic interpreter architecture: 
          <strong> Lexical Analysis (Tokenizer) ➔ Syntactic Analysis (Parser) ➔ Abstract Syntax Tree (AST) ➔ Execution Engine (Interpreter)</strong>.
        </p>
        <div className="docs-card">
          <h4 style={{ marginBottom: '8px' }}>Core Characteristics</h4>
          <ul>
            <li style={{ marginLeft: '20px', marginBottom: '4px' }}><strong>Dynamically Typed</strong>: Variables can store numbers or strings.</li>
            <li style={{ marginLeft: '20px', marginBottom: '4px' }}><strong>Keyword Oriented</strong>: Leverages explicit keywords like <code>put</code>, <code>into</code>, and <code>repeat</code>.</li>
            <li style={{ marginLeft: '20px' }}><strong>Indentation Sensitive</strong>: Control structures like <code>if</code> and <code>repeat</code> execute blocks of indented instructions terminated by empty lines.</li>
          </ul>
        </div>
      </>
    )
  },
  keywords: {
    title: 'Keywords & Identifiers',
    content: (
      <>
        <p className="docs-text">
          BLOOP uses a set of reserved words that command specific operations inside the interpreter.
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Usage</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>put</code></td>
              <td>Declares an assignment statement</td>
              <td><code>put 5 into x</code></td>
            </tr>
            <tr>
              <td><code>into</code></td>
              <td>Points to the destination variable</td>
              <td><code>put 10 into age</code></td>
            </tr>
            <tr>
              <td><code>print</code></td>
              <td>Prints output results to the console</td>
              <td><code>print "Hello"</code></td>
            </tr>
            <tr>
              <td><code>if</code></td>
              <td>Starts a conditional branch</td>
              <td><code>if x &gt; 5 then:</code></td>
            </tr>
            <tr>
              <td><code>then:</code></td>
              <td>Concludes an IF condition statement</td>
              <td><code>if y == 2 then:</code></td>
            </tr>
            <tr>
              <td><code>repeat</code></td>
              <td>Starts a fixed-count loop block</td>
              <td><code>repeat 5 times:</code></td>
            </tr>
            <tr>
              <td><code>times:</code></td>
              <td>Concludes a loop control statement</td>
              <td><code>repeat 10 times:</code></td>
            </tr>
          </tbody>
        </table>
      </>
    )
  },
  variables: {
    title: 'Variables',
    content: (
      <>
        <p className="docs-text">
          Variables in BLOOP represent memory slots that store either double-precision floats or text strings.
          They are declared and updated using the <code>put &lt;expr&gt; into &lt;identifier&gt;</code> syntax.
        </p>
        <div className="docs-card">
          <p className="docs-text"><strong>Example declarations:</strong></p>
          <pre style={{ fontFamily: 'var(--font-mono)', margin: '10px 0', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
{`put 25 into age
put "Alice" into name
put age + 5 into newAge`}
          </pre>
          <p className="docs-text">
            If you try to reference a variable that has not yet been declared in the execution environment,
            the interpreter will abort execution and raise a <code>Variable not defined: &lt;name&gt;</code> runtime error.
          </p>
        </div>
      </>
    )
  },
  control_flow: {
    title: 'Control Flow (IF & Loops)',
    content: (
      <>
        <p className="docs-text">
          BLOOP provides two structures for modifying execution flow: <code>if</code> statements and <code>repeat</code> loops.
        </p>
        
        <h4 style={{ marginTop: '16px', marginBottom: '8px' }}>Conditional Blocks (IF)</h4>
        <p className="docs-text">
          Conditionals check a comparison expression. The body consists of indented lines, and the block is terminated by a blank line or the end of the file.
        </p>
        <pre style={{ fontFamily: 'var(--font-mono)', margin: '10px 0', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
{`put 75 into mark
if mark > 50 then:
    print "You passed!"
    print "Congratulations!"
`}
        </pre>

        <h4 style={{ marginTop: '16px', marginBottom: '8px' }}>Repeat Blocks (Loops)</h4>
        <p className="docs-text">
          Loops run the body statements a specific number of times. Similar to IF statements, they use indentation for nesting and are terminated by a blank line.
        </p>
        <pre style={{ fontFamily: 'var(--font-mono)', margin: '10px 0', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
{`repeat 3 times:
    print "Tick-tock"
`}
        </pre>
      </>
    )
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('playground');
  const [code, setCode] = useState(EXAMPLES.hello);
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeDocSection, setActiveDocSection] = useState('overview');

  // Load a preset example into the editor
  const handleExampleChange = (e) => {
    const val = e.target.value;
    if (val && EXAMPLES[val]) {
      setCode(EXAMPLES[val]);
    }
  };

  // Run the code by hitting Spring Boot REST API
  const handleRunCode = async () => {
    setIsLoading(true);
    setErrors([]);
    setOutput('');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      setOutput(data.output || '');
      setErrors(data.errors || []);
    } catch (err) {
      setErrors([`Failed to reach compiler backend: ${err.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleEditorWillMount = (monaco) => {
    // Register BLOOP custom language tokenizer
    monaco.languages.register({ id: 'bloop' });
    monaco.languages.setMonarchTokensProvider('bloop', {
      keywords: ['put', 'into', 'print', 'if', 'then', 'repeat', 'times'],
      tokenizer: {
        root: [
          [/[a-zA-Z_]\w*/, {
            cases: {
              '@keywords': 'keyword',
              '@default': 'identifier'
            }
          }],
          [/\d+/, 'number'],
          [/"([^"\\]|\\.)*"/, 'string'],
          [/[{}()\[\]]/, '@brackets'],
          [/[+\-*\/==><]/, 'operator'],
          [/[ \t\r\n]+/, 'white']
        ]
      }
    });

    // Custom theme for editor to match Dashboard aesthetics
    monaco.editor.defineTheme('bloopTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'a78bfa', fontStyle: 'bold' },
        { token: 'identifier', foreground: 'e2e8f0' },
        { token: 'number', foreground: '22d3ee' },
        { token: 'string', foreground: '34d399' },
        { token: 'operator', foreground: 'f43f5e' }
      ],
      colors: {
        'editor.background': '#12131a',
        'editor.foreground': '#f3f4f6',
        'editor.lineHighlightBackground': '#1a1b24',
        'editorCursor.foreground': '#8b5cf6',
        'editorLineNumber.foreground': '#4b5563',
        'editorLineNumber.activeForeground': '#8b5cf6'
      }
    });
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">
            <Code2 size={22} className="text-white" />
          </div>
          <div>
            <div className="logo-text">BLOOP</div>
            <span className="version-tag">v1.0.0</span>
          </div>
        </div>

        <nav className="nav-menu">
          <div 
            className={`nav-item ${activeTab === 'playground' ? 'active' : ''}`}
            onClick={() => setActiveTab('playground')}
          >
            <Terminal size={18} />
            Playground
          </div>
          <div 
            className={`nav-item ${activeTab === 'docs' ? 'active' : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            <BookOpen size={18} />
            Documentation
          </div>
          <div 
            className={`nav-item ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <Cpu size={18} />
            Architecture
          </div>
          <div 
            className={`nav-item ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <Info size={18} />
            About Team
          </div>
        </nav>

        <div className="sidebar-footer">
          <p>© 2026 The Bloop Brigade</p>
          <p>Released under MIT License</p>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="main-content">
        
        {/* Playground Tab */}
        {activeTab === 'playground' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="header-container">
              <div>
                <h1 className="header-title">BLOOP <span>Playground</span></h1>
                <p className="header-desc">Write, run, and experiment with BLOOP code in real-time.</p>
              </div>
              <div>
                <select className="examples-select" onChange={handleExampleChange} defaultValue="">
                  <option value="" disabled>Select an Example...</option>
                  <option value="hello">Hello World</option>
                  <option value="variables">Variables & Math</option>
                  <option value="calculator">Basic Calculator</option>
                  <option value="conditions">If Conditions</option>
                  <option value="loops">Loops (Repeat)</option>
                  <option value="nested_conditions">Flat Checks (Conditions)</option>
                </select>
              </div>
            </div>

            <div className="workspace-grid">
              {/* Left Side: Editor */}
              <div className="glass-panel editor-card">
                <div className="editor-header">
                  <div className="editor-title">
                    <Code2 size={16} className="text-violet-400" />
                    main.bloop
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={handleCopyCode}>
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="editor-wrapper">
                  <Editor
                    height="100%"
                    defaultLanguage="bloop"
                    theme="bloopTheme"
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    beforeMount={handleEditorWillMount}
                    options={{
                      fontSize: 14,
                      fontFamily: "Fira Code",
                      minimap: { enabled: false },
                      automaticLayout: true,
                      cursorBlinking: "smooth",
                      lineHeight: 22
                    }}
                  />
                </div>
                <div className="editor-footer">
                  <button className="btn btn-primary" onClick={handleRunCode} disabled={isLoading}>
                    <Play size={16} />
                    Run Code
                  </button>
                  <button className="btn btn-secondary" onClick={() => setCode('')}>
                    <RotateCcw size={16} />
                    Clear Editor
                  </button>
                </div>
              </div>

              {/* Right Side: Output terminal */}
              <div className="glass-panel terminal-card">
                <div className="terminal-header">
                  <div className="terminal-title">
                    <Terminal size={16} />
                    Console Output
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => { setOutput(''); setErrors([]); }}>
                    Clear Output
                  </button>
                </div>
                <div className="terminal-body">
                  {isLoading && (
                    <div className="terminal-loading">
                      <div className="spinner"></div>
                      Executing code on sandbox server...
                    </div>
                  )}

                  {!isLoading && output === '' && errors.length === 0 && (
                    <div className="terminal-welcome">
                      {`$ Press 'Run Code' to execute script.
Stdout logs and syntax errors will render here.`}
                    </div>
                  )}

                  {!isLoading && output !== '' && (
                    <div className="terminal-line">{output}</div>
                  )}

                  {!isLoading && errors.length > 0 && (
                    <div className="terminal-error-body">
                      <div className="terminal-error-header">Runtime or Syntax Error:</div>
                      {errors.map((err, i) => (
                        <div key={i} className="terminal-line" style={{ marginTop: '4px' }}>{err}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <div className="animate-fade-in">
            <h1 className="header-title" style={{ marginBottom: '24px' }}>Language <span>Documentation</span></h1>
            <div className="glass-panel docs-layout" style={{ padding: '24px' }}>
              <aside className="docs-nav">
                <div className="docs-nav-title">Guides</div>
                <div 
                  className={`docs-nav-item ${activeDocSection === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveDocSection('overview')}
                >
                  Overview
                </div>
                <div 
                  className={`docs-nav-item ${activeDocSection === 'keywords' ? 'active' : ''}`}
                  onClick={() => setActiveDocSection('keywords')}
                >
                  Keywords
                </div>
                <div 
                  className={`docs-nav-item ${activeDocSection === 'variables' ? 'active' : ''}`}
                  onClick={() => setActiveDocSection('variables')}
                >
                  Variables
                </div>
                <div 
                  className={`docs-nav-item ${activeDocSection === 'control_flow' ? 'active' : ''}`}
                  onClick={() => setActiveDocSection('control_flow')}
                >
                  Control Flow
                </div>
              </aside>
              <div className="docs-content">
                <h2 className="docs-section-title">{DOCS_PAGES[activeDocSection].title}</h2>
                {DOCS_PAGES[activeDocSection].content}
              </div>
            </div>
          </div>
        )}

        {/* Architecture Tab */}
        {activeTab === 'architecture' && (
          <div className="animate-fade-in">
            <h1 className="header-title" style={{ marginBottom: '8px' }}>Interpreter <span>Pipeline Architecture</span></h1>
            <p className="header-desc" style={{ marginBottom: '24px' }}>
              Understand the compilation pipeline of the BLOOP execution container.
            </p>

            <div className="glass-panel" style={{ padding: '32px' }}>
              <h2>Compilation Steps</h2>
              <div className="arch-pipeline">
                <div className="arch-node active">
                  <div className="arch-node-title">Source Code</div>
                  <div className="arch-node-desc">Raw .bloop file string input</div>
                </div>
                <div className="arch-arrow"><ArrowRight size={24} /></div>
                <div className="arch-node active">
                  <div className="arch-node-title">Tokenizer</div>
                  <div className="arch-node-desc">Converts source text into Lexical Tokens</div>
                </div>
                <div className="arch-arrow"><ArrowRight size={24} /></div>
                <div className="arch-node active">
                  <div className="arch-node-title">Parser</div>
                  <div className="arch-node-desc">Constructs Abstract Syntax Tree (AST)</div>
                </div>
                <div className="arch-arrow"><ArrowRight size={24} /></div>
                <div className="arch-node active">
                  <div className="arch-node-title">Interpreter</div>
                  <div className="arch-node-desc">Executes tree nodes against Environment</div>
                </div>
              </div>

              <div style={{ marginTop: '32px' }}>
                <h3 style={{ marginBottom: '12px' }}>Architecture Explanation</h3>
                <p className="docs-text" style={{ marginBottom: '12px' }}>
                  <strong>1. Lexical Analysis (Tokenizer)</strong>: 
                  The Tokenizer scans through the characters of your BLOOP script, discarding extraneous spaces/colons and emitting sequential token structures containing token types (e.g. <code>PUT</code>, <code>NUMBER</code>, <code>IDENTIFIER</code>) along with their code line numbers.
                </p>
                <p className="docs-text" style={{ marginBottom: '12px' }}>
                  <strong>2. Parsing (Parser)</strong>: 
                  The Parser accepts the stream of tokens and groups them into hierarchical expressions and instructions based on the syntax grammar. If tokens form an illegal statement, a syntax error is raised.
                </p>
                <p className="docs-text" style={{ marginBottom: '12px' }}>
                  <strong>3. AST Factory</strong>: 
                  To maintain strict packaging encapsulation, an ASTFactory constructs the statement/expression classes (e.g. AssignInstruction, BinaryOpNode) internally.
                </p>
                <p className="docs-text">
                  <strong>4. Environment & Execution</strong>: 
                  The Interpreter loops through parsed AST instructions and calls <code>execute(Environment)</code>. The Environment tracks variable bindings and collects stdout logs, returning them to the HTTP response.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* About Team Tab */}
        {activeTab === 'about' && (
          <div className="animate-fade-in">
            <h1 className="header-title" style={{ marginBottom: '8px' }}>About <span>The Bloop Brigade</span></h1>
            <p className="header-desc" style={{ marginBottom: '24px' }}>
              The developers behind the BLOOP custom interpreter project.
            </p>

            <div className="glass-panel" style={{ padding: '32px' }}>
              <h2>Project Contributors</h2>
              <p className="docs-text" style={{ marginTop: '10px' }}>
                We built this project to study interpreter pipelines, lexical scanning algorithms, AST compilation designs, and team collaboration.
              </p>

              <div className="team-grid">
                <div className="team-card">
                  <div className="avatar">AR</div>
                  <div className="team-name">Afzl Raza</div>
                  <div className="team-role">Tokenizer Architect</div>
                  <p className="docs-text" style={{ fontSize: '0.8rem', marginTop: '8px' }}>
                    Engineered Lexical Analysis scanner, keyword regex mapping, and token emission.
                  </p>
                </div>
                <div className="team-card">
                  <div className="avatar">RK</div>
                  <div className="team-name">Rani Kumari</div>
                  <div className="team-role">Parser Engineer</div>
                  <p className="docs-text" style={{ fontSize: '0.8rem', marginTop: '8px' }}>
                    Designed grammatical syntax logic, statement resolvers, and AST compilation.
                  </p>
                </div>
                <div className="team-card">
                  <div className="avatar">GR</div>
                  <div className="team-name">Gaurav Rathore</div>
                  <div className="team-role">Execution Engineer</div>
                  <p className="docs-text" style={{ fontSize: '0.8rem', marginTop: '8px' }}>
                    Developed AST Node implementations for Expressions, Instructions, and variable Stores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
