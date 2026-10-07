import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileCode, 
  ShieldCheck, 
  AlertOctagon, 
  Play, 
  CheckCircle2, 
  Sparkles,
  Lock,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { Project } from '../types';
import { 
  ALLOWED_EXTENSIONS, 
  BLOCKED_EXTENSIONS, 
  isAllowedExtension, 
  detectLanguage, 
  analyzeSourceCode,
  SECURITY_RULES 
} from '../services/scannerEngine';

interface UploadScanViewProps {
  projects: Project[];
  selectedProjectId?: number;
  onScanComplete: (
    projectId: number,
    fileName: string,
    fileSize: number,
    language: string,
    scanResult: any
  ) => void;
}

export const UploadScanView: React.FC<UploadScanViewProps> = ({
  projects,
  selectedProjectId,
  onScanComplete
}) => {
  const [projectId, setProjectId] = useState<number>(
    selectedProjectId || (projects[0]?.id || 1)
  );
  const [fileName, setFileName] = useState('server_api.py');
  const [codeContent, setCodeContent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{
    name: string;
    size: number;
    type: string;
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Security check: Reject dangerous executables
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (BLOCKED_EXTENSIONS.includes(ext)) {
      setErrorMessage(
        `Security Alert: Dangerous executable or script file detected (${ext})! For safety, CodeShield strictly analyzes non-executable source code only.`
      );
      return;
    }

    if (!isAllowedExtension(file.name)) {
      setErrorMessage(
        `Disallowed file type. Supported extensions: ${ALLOWED_EXTENSIONS.join(', ')}`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileName(file.name);
      setCodeContent(text);
      setUploadedFileInfo({
        name: file.name,
        size: file.size,
        type: detectLanguage(file.name)
      });
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read file content.');
    };
    reader.readAsText(file);
  };

  const handleLoadSample = (sampleType: 'python' | 'javascript' | 'php' | 'clean') => {
    setErrorMessage('');
    if (sampleType === 'python') {
      setFileName('payment_backend.py');
      setCodeContent(`import os
import hashlib

# SEC-001: Hard-coded database password
password = "supersecretpassword123"
DB_PASSWORD = "production_mysql_password"

# SEC-002 & SEC-003: Exposed API Key & AWS Cloud Credentials
API_KEY = "sk-live-938210491823901823"
AWS_KEY = "AKIAIOSFODNN7EXAMPLE"

# SEC-007: Insecure weak hashing
password_hash = hashlib.md5(password.encode()).hexdigest()

# SEC-006: Dangerous eval() execution
user_expression = "1 + 1"
result = eval(user_expression)

# SEC-008: Debug mode left enabled in production
app.run(host='0.0.0.0', debug=True)

# SEC-009: SQL Injection risk via string concatenation
def get_user_profile(user_id):
    query = "SELECT * FROM users WHERE id=" + user_id
    return db.execute(query)

# SEC-010: Exposed developer email
admin_contact = "lead_dev@internal.corp"`);
      setUploadedFileInfo({
        name: 'payment_backend.py',
        size: 780,
        type: 'Python'
      });
    } else if (sampleType === 'javascript') {
      setFileName('auth_service.js');
      setCodeContent(`// Microservice JWT & Client Authentication Service
const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
const client_secret = "secret_tok_9918204128912";
const admin_email = "security-lead@company.com";

function processCommand(rawInput) {
  // SEC-006: Dangerous dynamic eval
  return eval("2 + " + rawInput);
}

const dbConfig = {
  DB_USER: "admin_user",
  DB_PASSWORD: "secret_db_pass_2026"
};

const authHeader = "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";`);
      setUploadedFileInfo({
        name: 'auth_service.js',
        size: 420,
        type: 'JavaScript'
      });
    } else if (sampleType === 'php') {
      setFileName('user_lookup.php');
      setCodeContent(`<?php
// SEC-005: Database password in plaintext
$MYSQL_PASSWORD = "production_root_password";

// SEC-009: SQL Injection Vulnerability
$user_id = $_GET['id'];
$query = "SELECT * FROM accounts WHERE id=" . $user_id;

// SEC-007: Deprecated MD5 password hashing
$token = md5($_POST['user_key']);

// SEC-010: Bearer token header
$auth = "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
?>`);
      setUploadedFileInfo({
        name: 'user_lookup.php',
        size: 380,
        type: 'PHP'
      });
    } else if (sampleType === 'clean') {
      setFileName('secure_microservice.py');
      setCodeContent(`import os
import bcrypt

# Secure: Credentials read exclusively from environment variables
api_key = os.environ.get("SERVICE_API_KEY")
db_password = os.environ.get("DATABASE_PASSWORD")

# Secure: Modern high-work-factor bcrypt hashing
hashed_password = bcrypt.hashpw(b"user_supplied_pw", bcrypt.gensalt(12))

# Secure: Parameterized SQL query execution prevents SQL injection
def get_user_secure(db_conn, user_id):
    query = "SELECT id, username, email FROM users WHERE id = %s"
    return db_conn.execute(query, (user_id,))`);
      setUploadedFileInfo({
        name: 'secure_microservice.py',
        size: 510,
        type: 'Python'
      });
    }
  };

  const handleRunScan = () => {
    if (!codeContent.trim()) {
      setErrorMessage('Please upload a source code file or paste code snippet to scan.');
      return;
    }

    setIsScanning(true);
    setErrorMessage('');

    setTimeout(() => {
      const language = detectLanguage(fileName);
      const scanResult = analyzeSourceCode(codeContent, fileName);
      const size = uploadedFileInfo?.size || new Blob([codeContent]).size;

      onScanComplete(
        projectId,
        fileName,
        size,
        language,
        scanResult
      );
      setIsScanning(false);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
            Static Application Security Testing
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Source Code Security Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Upload files or paste code snippets for automated line-by-line inspection and scoring.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-950/70 border border-red-800/80 rounded-xl text-xs text-red-200 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Scan Error</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload / Editor */}
        <div className="lg:col-span-8 space-y-6">
          {/* Project Target */}
          <div className="bg-slate-900/80 border border-white/10 rounded-xl p-5">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Destination Project Workspace
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs text-white bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_name} ({p.scan_count || 0} previous scans)
                </option>
              ))}
            </select>
          </div>

          {/* Drag and Drop Zone */}
          <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
            <label className="block text-xs font-semibold text-slate-300 mb-3">
              Upload Source Code File
            </label>

            <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/70 rounded-xl p-8 text-center bg-cyan-950/10 hover:bg-cyan-950/20 transition-all cursor-pointer relative group">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".py,.java,.js,.html,.css,.cpp,.c,.php,.sql,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-3 pointer-events-none">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Drag &amp; Drop Source Code Here</h4>
                  <p className="text-xs text-slate-400 mt-1">or browse from your local file system</p>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                  {ALLOWED_EXTENSIONS.map((ext) => (
                    <span
                      key={ext}
                      className="px-2 py-0.5 text-[10px] font-mono text-cyan-300 bg-slate-800/80 border border-white/5 rounded"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {uploadedFileInfo && (
              <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-lg flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono font-medium">{uploadedFileInfo.name}</span>
                  <span className="text-[10px] text-emerald-400/80">({uploadedFileInfo.size} bytes)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-900/60 font-semibold text-[10px]">
                  {uploadedFileInfo.type}
                </span>
              </div>
            )}
          </div>

          {/* Quick Preload Test Scenarios */}
          <div className="bg-slate-900/80 border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant Test Samples (One-Click Load):</span>
              </span>
              <span className="text-[10px] text-slate-400">Pre-loaded scenarios for evaluation</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleLoadSample('python')}
                className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-cyan-300 border border-white/5 rounded-lg text-left transition-colors"
              >
                <span className="block font-bold text-red-400">Vulnerable Python</span>
                <span className="text-[10px] text-slate-400">API Key, eval, SQLi</span>
              </button>

              <button
                type="button"
                onClick={() => handleLoadSample('javascript')}
                className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-cyan-300 border border-white/5 rounded-lg text-left transition-colors"
              >
                <span className="block font-bold text-orange-400">Leaked AWS JS</span>
                <span className="text-[10px] text-slate-400">AKIA key &amp; DB pass</span>
              </button>

              <button
                type="button"
                onClick={() => handleLoadSample('php')}
                className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-cyan-300 border border-white/5 rounded-lg text-left transition-colors"
              >
                <span className="block font-bold text-yellow-400">Vulnerable PHP</span>
                <span className="text-[10px] text-slate-400">SQL concat &amp; MD5</span>
              </button>

              <button
                type="button"
                onClick={() => handleLoadSample('clean')}
                className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-emerald-300 border border-white/5 rounded-lg text-left transition-colors"
              >
                <span className="block font-bold text-emerald-400">Clean Secure Code</span>
                <span className="text-[10px] text-slate-400">100/100 benchmark</span>
              </button>
            </div>
          </div>

          {/* Interactive Code Editor */}
          <div className="bg-slate-900/80 border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Source Code Editor / Raw Snippet
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">File Name:</span>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="px-2 py-1 text-xs font-mono text-cyan-300 bg-slate-800 border border-white/10 rounded focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <textarea
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              rows={14}
              placeholder="// Paste source code here, or click one of the sample scenario buttons above to load..."
              className="w-full p-4 font-mono text-xs text-slate-200 bg-[#090e18] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 leading-relaxed resize-y"
            />

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleRunScan}
                disabled={isScanning}
                className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 rounded-xl shadow-lg shadow-cyan-900/40 flex items-center gap-2 transition-all transform active:scale-95"
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Executing Static Analysis...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run Security Scan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Rules Checklist */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Active SAST Rule Sets</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every uploaded file is checked line-by-line across 10 security categories:
              </p>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {SECURITY_RULES.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 bg-slate-950/80 border border-white/5 rounded-lg text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{rule.type}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        rule.severity === 'CRITICAL'
                          ? 'bg-red-950 text-red-400 border border-red-800/40'
                          : rule.severity === 'HIGH'
                          ? 'bg-orange-950 text-orange-400 border border-orange-800/40'
                          : rule.severity === 'MEDIUM'
                          ? 'bg-yellow-950 text-yellow-400 border border-yellow-800/40'
                          : 'bg-blue-950 text-blue-400 border border-blue-800/40'
                      }`}
                    >
                      {rule.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{rule.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Files are strictly inspected in memory as plain text. No code execution occurs.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
