import React, { useState } from 'react';
import { History as HistoryIcon, Search, Scan, FileText, ArrowRight, Calendar, Filter } from 'lucide-react';
import { Scan as ScanType } from '../types';

interface HistoryViewProps {
  scans: ScanType[];
  onViewResults: (scanId: number) => void;
  onViewReport: (scanId: number) => void;
  onStartNewScan: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  scans,
  onViewResults,
  onViewReport,
  onStartNewScan
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredScans = scans.filter((scan) => {
    return (
      (scan.project_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.language.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
            Audit Trails
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Security Scan History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Complete database of executed static source code vulnerability assessments.
          </p>
        </div>

        <button
          onClick={onStartNewScan}
          className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl shadow-md shadow-cyan-900/30 flex items-center gap-2 transition-all"
        >
          <Scan className="w-4 h-4" />
          <span>New Code Scan</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-white/10 rounded-xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by project or filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs text-white bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-white font-mono">{filteredScans.length}</strong> of{' '}
          <strong className="text-white font-mono">{scans.length}</strong> total scans
        </div>
      </div>

      {/* Scans Table */}
      <div className="bg-slate-900/80 border border-white/10 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Project Name</th>
                <th className="py-3.5 px-4 font-semibold">File Name</th>
                <th className="py-3.5 px-4 font-semibold">Security Score</th>
                <th className="py-3.5 px-4 font-semibold">Issues Found</th>
                <th className="py-3.5 px-4 font-semibold">Scan Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">View Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-white">
                    {scan.project_name || 'General Workspace'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-300 font-medium">{scan.file_name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">
                        {scan.language}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
                        scan.security_score >= 90
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                          : scan.security_score >= 75
                          ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/50'
                          : scan.security_score >= 50
                          ? 'bg-yellow-950/80 text-yellow-400 border border-yellow-800/50'
                          : 'bg-red-950/80 text-red-400 border border-red-800/50'
                      }`}
                    >
                      {scan.security_score} / 100
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-200 block font-mono">
                        {scan.total_issues} findings
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Crit: {scan.critical_count} &middot; High: {scan.high_count} &middot; Med: {scan.medium_count}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {new Date(scan.scan_date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => onViewResults(scan.id)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
                    >
                      View Results
                    </button>
                    <button
                      onClick={() => onViewReport(scan.id)}
                      className="px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-800/50 rounded-lg transition-colors"
                    >
                      Executive Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
