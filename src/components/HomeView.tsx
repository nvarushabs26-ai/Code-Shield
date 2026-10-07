import React from 'react';
import { 
  Key, 
  ShieldAlert, 
  EyeOff, 
  Gauge, 
  CheckCircle2, 
  History, 
  FileText, 
  UploadCloud, 
  ArrowRight, 
  Lock, 
  Terminal, 
  AlertTriangle,
  Zap,
  Check
} from 'lucide-react';
import heroImage from '../assets/images/codeshield_hero_1791380619928.jpg';

interface HomeViewProps {
  onStartScan: () => void;
  onGetStarted: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartScan, onGetStarted }) => {
  return (
    <div className="space-y-24 py-12 md:py-16">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Automated Static Code Vulnerability Audit
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] [text-wrap:balance]">
              Protect Your Code with <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">CodeShield</span>
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-cyan-300 tracking-tight">
              Intelligent Source Code Security &amp; Privacy Analyzer
            </p>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              CodeShield helps developers identify security vulnerabilities, exposed secrets, sensitive information and dangerous coding patterns before they become serious problems.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onStartScan}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl shadow-lg shadow-cyan-900/30 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <span>Start Free Scan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGetStarted}
                className="px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 rounded-xl transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Quick Proof Trust Line (Zero-pill discipline) */}
            <div className="pt-4 flex items-center gap-3 text-xs text-slate-400 border-t border-white/10">
              <span>Supports 10+ Source Languages</span>
              <span aria-hidden="true">&middot;</span>
              <span>10 Static Security Rules</span>
              <span aria-hidden="true">&middot;</span>
              <span>100-Point Algorithmic Scoring</span>
            </div>
          </div>

          {/* Hero Cyber Illustration Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-cyan-950/50 overflow-hidden group">
              {/* Header bar */}
              <div className="px-4 py-3 bg-[#0d1527] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  <span className="text-xs font-mono text-slate-400 ml-2">codeshield_scanner.py</span>
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  DEFENSIVE AUDIT
                </span>
              </div>

              {/* High-Fidelity Cyber Visual with Fallback */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                <img
                  src={heroImage}
                  alt="CodeShield Cybersecurity Analysis Engine"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    // Fallback container in case image loading fails
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div 
                  className="hidden w-full h-full bg-gradient-to-br from-[#0c1830] to-[#080d19] items-center justify-center p-6 text-center"
                >
                  <div className="space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">Active Defense Engine</h4>
                    <p className="text-xs text-slate-400">Real-time Static Pattern Recognition</p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                    <span className="text-slate-200 font-medium">SAST Engine Ready</span>
                  </div>
                  <span className="font-mono text-cyan-400 font-bold">100 / 100 Base Score</span>
                </div>
              </div>

              {/* Code Snippet Demonstration */}
              <div className="p-4 space-y-2 font-mono text-xs bg-[#090f1d]">
                <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-white/5">
                  <span>Detected Threat Simulation</span>
                  <span className="text-red-400 font-semibold">CRITICAL (-25)</span>
                </div>
                <div className="text-slate-400">
                  <span className="text-slate-600 select-none">12 | </span>
                  <span className="text-red-400">API_KEY = "sk-live-90428401928"</span>
                </div>
                <div className="text-[11px] text-cyan-300 bg-cyan-950/40 border border-cyan-900/40 rounded p-2 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Recommendation: Store in environment variables (os.environ['API_KEY'])</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Comprehensive Security &amp; Privacy Features
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Engineered to detect vulnerable syntax, unsafe database constructs, and sensitive leaks across your full codebase.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 rounded-xl p-6 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 mb-4">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Secret Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects hard-coded passwords, API tokens, cloud keys (AWS AKIA...), and RSA private key certificates.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 rounded-xl p-6 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-orange-950/40 border border-orange-800/40 flex items-center justify-center text-orange-400 mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Security Risk Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pinpoints dangerous eval() code evaluation, SQL string concatenation, and insecure framework debug flags.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 rounded-xl p-6 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mb-4">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Privacy Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Flags exposed email addresses, mobile numbers, authorization headers, and leaked PII tokens.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 rounded-xl p-6 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-4">
              <Gauge className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Security Score</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates an objective 0-100 rating with weighted deductions per Critical, High, Medium, and Low finding.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 rounded-xl p-6 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-blue-950/40 border border-blue-800/40 flex items-center justify-center text-blue-400 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Fix Recommendations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Actionable, line-specific guidance teaches developers safe modern idioms (bcrypt, parameterized queries).
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 rounded-xl p-6 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-purple-950/40 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-4">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Scan History</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintains complete MySQL audit logs across multiple projects and repositories to track security over time.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 rounded-xl p-6 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-sky-950/40 border border-sky-800/40 flex items-center justify-center text-sky-400 mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Security Reports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates executive audit reports formatted for printable PDF export and structured JSON download.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 rounded-xl p-6 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-4">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Source Code Upload</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag-and-drop or paste code across .py, .java, .js, .html, .css, .cpp, .c, .php, .sql, and .txt safely.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHY USE CODESHIELD? SECTION */}
      <section className="bg-[#080e1b] border-y border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
              Why Use CodeShield?
            </h2>
            <p className="text-slate-400 text-sm">
              Proactive static analysis protects developers and organizations before software reaches public repositories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 relative">
              <span className="text-2xl font-black text-cyan-500/30 block mb-2 font-mono">01</span>
              <h3 className="text-base font-bold text-white mb-2">1. Early Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Catch severe flaws during active development, eliminating expensive production hotfixes and incident response drills.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 relative">
              <span className="text-2xl font-black text-cyan-500/30 block mb-2 font-mono">02</span>
              <h3 className="text-base font-bold text-white mb-2">2. Better Code Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Foster defensive coding standards across university projects, dev teams, and production engineering workflows.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 relative">
              <span className="text-2xl font-black text-cyan-500/30 block mb-2 font-mono">03</span>
              <h3 className="text-base font-bold text-white mb-2">3. Sensitive Data Protection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prevent catastrophic leaks of customer PII, database passwords, and private cryptographic RSA key blocks.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 relative">
              <span className="text-2xl font-black text-cyan-500/30 block mb-2 font-mono">04</span>
              <h3 className="text-base font-bold text-white mb-2">4. Easy Risk Understanding</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Intuitive severity classification (Critical, High, Medium, Low) and clear plain-English remediation steps.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 relative">
              <span className="text-2xl font-black text-cyan-500/30 block mb-2 font-mono">05</span>
              <h3 className="text-base font-bold text-white mb-2">5. Developer Friendly</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero complex configuration. Upload a single file, paste a snippet, or test against prebuilt vulnerable samples instantly.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 relative">
              <span className="text-2xl font-black text-cyan-500/30 block mb-2 font-mono">06</span>
              <h3 className="text-base font-bold text-white mb-2">6. Fast Automated Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Line-by-line static inspection processes code files in milliseconds, giving immediate feedback right in your browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW CODESHIELD WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            How CodeShield Works
          </h2>
          <p className="text-slate-400 text-sm">
            Six straightforward steps from source upload to security verification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { step: '1', title: 'Create Account', desc: 'Register with password hashing & session authentication.' },
            { step: '2', title: 'Upload Code', desc: 'Select or drag your .py, .js, .java, .php, or .sql files.' },
            { step: '3', title: 'Scan Code', desc: 'Trigger automated line-by-line static pattern recognition.' },
            { step: '4', title: 'Detect Issues', desc: 'Isolate hardcoded secrets, SQL injection, and weak hashes.' },
            { step: '5', title: 'View Score', desc: 'Review your 0-100 score with visual circular status gauge.' },
            { step: '6', title: 'Fix Issues', desc: 'Apply recommendations and verify safe coding standards.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-white/10 rounded-xl p-5 text-center relative flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm flex items-center justify-center mx-auto mb-3 shadow-md shadow-cyan-900/40">
                  {item.step}
                </div>
                <h4 className="text-sm font-bold text-slate-100 mb-1">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border border-cyan-500/30 p-10 sm:p-14 text-center shadow-2xl overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Secure Your Code?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Start auditing source code for leaked credentials, SQL injection, and privacy violations in seconds.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={onStartScan}
                className="px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl shadow-lg shadow-cyan-900/40 transition-all transform active:scale-95"
              >
                Start Free Scan
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
