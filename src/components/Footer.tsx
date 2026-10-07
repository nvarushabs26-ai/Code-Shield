import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onOpenBcaModal: () => void;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBcaModal, setActiveTab }) => {
  return (
    <footer className="border-t border-white/10 bg-[#080d19] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">CodeShield</span>
            </div>
            <p className="text-sm text-cyan-400 font-medium mb-2">
              Intelligent Source Code Security &amp; Privacy Analyzer
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mb-4">
              A high-precision static application security testing platform detecting hardcoded credentials, cloud secrets, SQL injection risks, and dangerous execution patterns before deployment.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-md text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>BCA Academic Final-Year Project</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Capabilities</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('upload')} className="hover:text-cyan-400 transition-colors">Secret Detection</button></li>
              <li><button onClick={() => setActiveTab('upload')} className="hover:text-cyan-400 transition-colors">AWS Credential Scanning</button></li>
              <li><button onClick={() => setActiveTab('upload')} className="hover:text-cyan-400 transition-colors">SQL Injection Analysis</button></li>
              <li><button onClick={() => setActiveTab('upload')} className="hover:text-cyan-400 transition-colors">Dangerous eval() Flags</button></li>
              <li><button onClick={() => setActiveTab('upload')} className="hover:text-cyan-400 transition-colors">Cryptographic Hash Audit</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Academic Deliverables</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenBcaModal} className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
                  <span>Python Flask Backend (app.py)</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenBcaModal} className="hover:text-cyan-400 transition-colors">
                  MySQL Schema (codeshield_db)
                </button>
              </li>
              <li>
                <button onClick={onOpenBcaModal} className="hover:text-cyan-400 transition-colors">
                  Static Rule Engine (scanner.py)
                </button>
              </li>
              <li>
                <button onClick={onOpenBcaModal} className="hover:text-cyan-400 transition-colors">
                  Jinja2 HTML5 Views
                </button>
              </li>
              <li>
                <button onClick={onOpenBcaModal} className="hover:text-cyan-400 transition-colors">
                  System Architecture &amp; ER Diagram
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; 2026 CodeShield. BCA Academic Project. Developed for Software Security &amp; Defensive Coding.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">Strictly Non-Executable Text Static Analysis</span>
            <span>&bull;</span>
            <span className="text-slate-400">Zero Code Execution Hazard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
