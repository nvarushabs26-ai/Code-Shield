import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Filter, 
  Search, 
  Code2, 
  ArrowRight,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { Scan, Issue, Severity } from '../types';

interface ResultsViewProps {
  scan: Scan;
  issues: Issue[];
  onScanAnother: () => void;
  onViewReport: (scanId: number) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  scan,
  issues,
  onScanAnother,
  onViewReport
}) => {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | Severity>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIssues = issues.filter((issue) => {
    const matchesSev = severityFilter === 'ALL' || issue.severity === severityFilter;
    const matchesSearch = 
      issue.issue_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.recommendation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.code_snippet.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSev && matchesSearch;
  });

  // SVG circular arc calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scan.security_score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981'; // emerald
    if (score >= 75) return '#06b6d4'; // cyan
    if (score >= 50) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded-full px-3 py-1 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Security Scan Complete</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Security Audit Findings: <span className="font-mono text-cyan-300">{scan.file_name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-3">
            <span>Project: <strong className="text-slate-200">{scan.project_name}</strong></span>
            <span aria-hidden="true">&middot;</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(scan.scan_date).toLocaleDateString(undefined, { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onScanAnother}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Scan Another File</span>
          </button>

          <button
            onClick={() => onViewReport(scan.id)}
            className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl shadow-lg shadow-cyan-900/40 flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>View Security Report</span>
          </button>
        </div>
      </div>

      {/* Score Overview and Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Circular Progress Gauge Card */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-xl">
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke={getScoreColor(scan.security_score)}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums leading-none">
                {scan.security_score}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold mt-1">/ 100</span>
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider block">
              Security Rating Posture
            </span>
            <h3 className="text-xl font-extrabold text-white">
              {scan.status}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Base score started at 100. Deductions calculated: Critical (-25), High (-15), Medium (-8), Low (-3).
            </p>
            <div className="pt-2">
              <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${
                scan.security_score >= 90 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                scan.security_score >= 75 ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                scan.security_score >= 50 ? 'bg-yellow-950 text-yellow-400 border border-yellow-800' :
                'bg-red-950 text-red-400 border border-red-800'
              }`}>
                {scan.security_score >= 90 ? '90-100: Excellent' :
                 scan.security_score >= 75 ? '75-89: Good' :
                 scan.security_score >= 50 ? '50-74: Needs Improvement' :
                 'Below 50: Critical Risk'}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Issue Summary Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Critical */}
          <div className="bg-slate-900/80 border border-red-900/40 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider block">Critical</span>
              <span className="text-3xl font-extrabold text-red-400 font-mono tabular-nums mt-1 block">
                {scan.critical_count}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 pt-2 border-t border-white/5">
              -25 pts deduction each
            </span>
          </div>

          {/* High */}
          <div className="bg-slate-900/80 border border-orange-900/40 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider block">High</span>
              <span className="text-3xl font-extrabold text-orange-400 font-mono tabular-nums mt-1 block">
                {scan.high_count}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 pt-2 border-t border-white/5">
              -15 pts deduction each
            </span>
          </div>

          {/* Medium */}
          <div className="bg-slate-900/80 border border-yellow-900/40 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider block">Medium</span>
              <span className="text-3xl font-extrabold text-yellow-400 font-mono tabular-nums mt-1 block">
                {scan.medium_count}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 pt-2 border-t border-white/5">
              -8 pts deduction each
            </span>
          </div>

          {/* Low */}
          <div className="bg-slate-900/80 border border-blue-900/40 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">Low</span>
              <span className="text-3xl font-extrabold text-blue-400 font-mono tabular-nums mt-1 block">
                {scan.low_count}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 pt-2 border-t border-white/5">
              -3 pts deduction each
            </span>
          </div>
        </div>
      </div>

      {/* Issues Table Section */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6">
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Detailed Vulnerability Findings ({issues.length})
            </h2>
            <p className="text-xs text-slate-400">Line-by-line static inspection findings and remediation advice</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search issue or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs text-white bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 w-44"
              />
            </div>

            {/* Severity Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-white/5 text-xs">
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    severityFilter === sev
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredIssues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4 font-semibold">Issue Type</th>
                  <th className="py-3 px-4 font-semibold">Severity</th>
                  <th className="py-3 px-4 font-semibold">Line</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-800/40 transition-colors align-top">
                    {/* Issue Type + Snippet */}
                    <td className="py-3.5 px-4 max-w-[260px]">
                      <span className="font-bold text-white block mb-1">{issue.issue_type}</span>
                      {issue.code_snippet && (
                        <div className="p-2 bg-slate-950 rounded font-mono text-[11px] text-red-300 border-l-2 border-red-500 overflow-x-auto">
                          <code>{issue.code_snippet}</code>
                        </div>
                      )}
                    </td>

                    {/* Severity Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          issue.severity === 'CRITICAL'
                            ? 'bg-red-950 text-red-400 border border-red-800/50'
                            : issue.severity === 'HIGH'
                            ? 'bg-orange-950 text-orange-400 border border-orange-800/50'
                            : issue.severity === 'MEDIUM'
                            ? 'bg-yellow-950 text-yellow-400 border border-yellow-800/50'
                            : 'bg-blue-950 text-blue-400 border border-blue-800/50'
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </td>

                    {/* Line Number */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[11px] text-cyan-300">
                        Line {issue.line_number}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 text-slate-300 leading-relaxed max-w-[280px]">
                      {issue.description}
                    </td>

                    {/* Recommendation */}
                    <td className="py-3.5 px-4 max-w-[320px]">
                      <div className="p-2.5 bg-cyan-950/30 border border-cyan-800/30 rounded-lg text-[11px] text-cyan-200 leading-relaxed">
                        <strong className="block text-cyan-400 mb-0.5">Fix Recommendation:</strong>
                        {issue.recommendation}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Issues Matching Filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {issues.length === 0 
                ? 'Great job! The analyzed source code is free of detected static security vulnerabilities.'
                : 'No vulnerabilities found matching the selected severity level or search term.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
