import React from 'react';
import { 
  FolderKanban, 
  Scan as ScanIcon, 
  AlertTriangle, 
  ShieldCheck, 
  PlusCircle, 
  UploadCloud, 
  History, 
  FileText, 
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Terminal
} from 'lucide-react';
import { User, Project, Scan } from '../types';

interface DashboardViewProps {
  currentUser: User;
  projects: Project[];
  scans: Scan[];
  onStartNewScan: (projectId?: number) => void;
  onNavigate: (tab: string) => void;
  onViewScanResult: (scanId: number) => void;
  onViewScanReport: (scanId: number) => void;
  onOpenBcaModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  projects,
  scans,
  onStartNewScan,
  onNavigate,
  onViewScanResult,
  onViewScanReport,
  onOpenBcaModal
}) => {
  const totalScans = scans.length;
  const totalIssues = scans.reduce((sum, s) => sum + s.total_issues, 0);
  const avgScore = totalScans > 0 
    ? Math.round(scans.reduce((sum, s) => sum + s.security_score, 0) / totalScans) 
    : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
            Security Operations Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time security posture, active repositories, and static analysis health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onStartNewScan()}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl shadow-md shadow-cyan-900/30 flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start New Security Scan</span>
          </button>
        </div>
      </div>

      {/* 4 Dashboard Cards: Projects, Security Scans, Issues Detected, Security Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Projects */}
        <div className="bg-slate-900/80 border border-white/10 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400 shrink-0">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 block">Projects</span>
            <span className="text-2xl font-bold text-white tabular-nums">{projects.length}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Active workspaces</span>
          </div>
        </div>

        {/* Card 2: Security Scans */}
        <div className="bg-slate-900/80 border border-white/10 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shrink-0">
            <ScanIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 block">Security Scans</span>
            <span className="text-2xl font-bold text-white tabular-nums">{totalScans}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Audits executed</span>
          </div>
        </div>

        {/* Card 3: Issues Detected */}
        <div className="bg-slate-900/80 border border-white/10 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 block">Issues Detected</span>
            <span className="text-2xl font-bold text-white tabular-nums">{totalIssues}</span>
            <span className="text-[11px] text-red-400 block mt-0.5">Static vulnerabilities</span>
          </div>
        </div>

        {/* Card 4: Security Score */}
        <div className="bg-slate-900/80 border border-white/10 rounded-xl p-5 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
            avgScore >= 90 ? 'bg-emerald-950/60 border-emerald-800/40 text-emerald-400' :
            avgScore >= 75 ? 'bg-cyan-950/60 border-cyan-800/40 text-cyan-400' :
            avgScore >= 50 ? 'bg-yellow-950/60 border-yellow-800/40 text-yellow-400' :
            'bg-red-950/60 border-red-800/40 text-red-400'
          }`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 block">Security Score</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white tabular-nums">{avgScore}</span>
              <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {avgScore >= 90 ? 'Excellent' : avgScore >= 75 ? 'Good' : avgScore >= 50 ? 'Needs Improvement' : 'Critical Risk'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
          Quick Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('upload')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Source Code</span>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            <span>Scan History</span>
          </button>

          <button
            onClick={() => {
              if (scans.length > 0) {
                onViewScanReport(scans[0].id);
              } else {
                onNavigate('upload');
              }
            }}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Security Reports</span>
          </button>

          <button
            onClick={onOpenBcaModal}
            className="px-3.5 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>BCA Project Files</span>
          </button>
        </div>
      </div>

      {/* CodeShield Protection Section */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-cyan-950/40 border border-cyan-500/20 rounded-xl p-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white tracking-tight">CodeShield Protection</h3>
            <p className="text-xs sm:text-sm text-cyan-200 font-medium">
              CodeShield helps identify common security risks before they become serious problems.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl pt-1">
              Automated line-by-line inspection analyzes source code against 10 static patterns including hardcoded database passwords, exposed API credentials, AWS secret keys, dangerous dynamic eval(), weak hashing algorithms (MD5/SHA1), and SQL injection string concatenation risks.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Your Projects</h2>
            <p className="text-xs text-slate-400">Target repositories and microservices</p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Manage All Projects</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-slate-900/80 border border-white/10 hover:border-cyan-500/30 rounded-xl p-5 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-white truncate">{project.project_name}</h3>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    {project.scan_count || 0} scans
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {project.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Avg Score: <strong className="text-white font-mono">{project.avg_score || 100}/100</strong>
                </span>
                <button
                  onClick={() => onStartNewScan(project.id)}
                  className="px-2.5 py-1 text-xs font-medium text-cyan-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                >
                  Scan Code &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Security Scans Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Security Scans</h2>
            <p className="text-xs text-slate-400">Latest automated file assessments</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Full History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-slate-900/80 border border-white/10 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Project</th>
                  <th className="py-3 px-4 font-semibold">File Name</th>
                  <th className="py-3 px-4 font-semibold">Security Score</th>
                  <th className="py-3 px-4 font-semibold">Issues Detected</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {scans.slice(0, 5).map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">{scan.project_name}</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-300">{scan.file_name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        scan.security_score >= 90 ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/40' :
                        scan.security_score >= 75 ? 'bg-cyan-950/70 text-cyan-400 border border-cyan-800/40' :
                        scan.security_score >= 50 ? 'bg-yellow-950/70 text-yellow-400 border border-yellow-800/40' :
                        'bg-red-950/70 text-red-400 border border-red-800/40'
                      }`}>
                        {scan.security_score} / 100
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 font-mono">{scan.total_issues} findings</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(scan.scan_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => onViewScanResult(scan.id)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded transition-colors"
                      >
                        Results
                      </button>
                      <button
                        onClick={() => onViewScanReport(scan.id)}
                        className="px-2.5 py-1 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 rounded border border-cyan-800/40 transition-colors"
                      >
                        Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
