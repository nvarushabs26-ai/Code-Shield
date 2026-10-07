import React from 'react';
import { 
  Shield, 
  Printer, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Layers,
  FileCheck2
} from 'lucide-react';
import { Scan, Issue } from '../types';

interface ReportViewProps {
  scan: Scan;
  issues: Issue[];
  onBackToResults: (scanId: number) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  scan,
  issues,
  onBackToResults
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      title: 'CodeShield Security & Privacy Audit Report',
      projectName: scan.project_name,
      fileName: scan.file_name,
      language: scan.language,
      securityScore: scan.security_score,
      status: scan.status,
      scanDate: scan.scan_date,
      summary: {
        totalIssues: scan.total_issues,
        critical: scan.critical_count,
        high: scan.high_count,
        medium: scan.medium_count,
        low: scan.low_count
      },
      detailedFindings: issues.map(i => ({
        type: i.issue_type,
        severity: i.severity,
        lineNumber: i.line_number,
        snippet: i.code_snippet,
        description: i.description,
        recommendation: i.recommendation
      })),
      conclusion: 'CodeShield provides a preliminary automated security analysis. The report should be used as a development aid and does not replace a professional security audit.'
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codeshield_report_${scan.file_name}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Action Toolbar (Hidden during print) */}
      <div className="flex items-center justify-between gap-4 print:hidden pb-4 border-b border-white/10">
        <button
          onClick={() => onBackToResults(scan.id)}
          className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scan Results</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl shadow-md shadow-cyan-900/30 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Report (JSON)</span>
          </button>
        </div>
      </div>

      {/* Official White Paper Document */}
      <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-14 shadow-2xl space-y-8 font-sans print:p-0 print:shadow-none print:rounded-none">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight leading-tight">
                CodeShield Security Report
              </h1>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                Static Source Code Vulnerability &amp; Privacy Assessment
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600">
            <span className="block font-semibold text-slate-900">Official Audit Document</span>
            <span>Date: {new Date(scan.scan_date).toLocaleDateString(undefined, { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
          <div>
            <span className="text-slate-600 uppercase text-[10px] font-bold block">Project Name</span>
            <strong className="text-slate-900 text-sm block mt-0.5 truncate">{scan.project_name}</strong>
          </div>
          <div>
            <span className="text-slate-600 uppercase text-[10px] font-bold block">Target File</span>
            <code className="text-blue-700 font-mono text-xs block mt-0.5 truncate">{scan.file_name}</code>
          </div>
          <div>
            <span className="text-slate-600 uppercase text-[10px] font-bold block">Language / Size</span>
            <span className="text-slate-900 font-medium block mt-0.5">{scan.language} ({scan.file_size_bytes} bytes)</span>
          </div>
          <div>
            <span className="text-slate-600 uppercase text-[10px] font-bold block">Security Score</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <strong className="text-blue-600 text-base font-mono font-black">{scan.security_score}</strong>
              <span className="text-slate-600 text-xs">/ 100</span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-950 uppercase tracking-wide border-b border-slate-200 pb-1">
            Executive Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            The CodeShield automated static application security testing engine completed an automated audit of 
            <strong className="text-slate-900"> {scan.file_name} </strong> within the 
            <strong className="text-slate-900"> {scan.project_name} </strong> repository. 
            An aggregate security posture score of <strong className="text-blue-700">{scan.security_score}/100</strong> was determined based on weighted vulnerability severity ratings.
            A total of <strong className="text-slate-950 font-bold">{scan.total_issues} security finding(s)</strong> were identified across the audited codebase.
          </p>

          {/* Issue Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <span className="text-2xl font-black text-red-600 font-mono block">{scan.critical_count}</span>
              <span className="text-[11px] font-bold text-red-800 uppercase tracking-wide">Critical</span>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
              <span className="text-2xl font-black text-orange-600 font-mono block">{scan.high_count}</span>
              <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wide">High</span>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <span className="text-2xl font-black text-yellow-700 font-mono block">{scan.medium_count}</span>
              <span className="text-[11px] font-bold text-yellow-900 uppercase tracking-wide">Medium</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <span className="text-2xl font-black text-blue-600 font-mono block">{scan.low_count}</span>
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">Low</span>
            </div>
          </div>
        </div>

        {/* Detailed Findings */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-950 uppercase tracking-wide border-b border-slate-200 pb-1">
            Detailed Findings &amp; Technical Evidence
          </h2>

          {issues.length > 0 ? (
            <div className="space-y-4">
              {issues.map((issue, index) => (
                <div key={issue.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-600">#{index + 1}</span>
                      <strong className="text-sm font-bold text-slate-900">{issue.issue_type}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[11px] font-mono rounded">
                        Line {issue.line_number}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        issue.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        issue.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        issue.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-900' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {issue.severity}
                      </span>
                    </div>
                  </div>

                  {issue.code_snippet && (
                    <div className="p-2.5 bg-slate-900 text-red-300 font-mono text-xs rounded border border-slate-800 overflow-x-auto">
                      <code>{issue.code_snippet}</code>
                    </div>
                  )}

                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Description:</strong> {issue.description}
                  </p>

                  <div className="p-2.5 bg-blue-50/70 border-l-4 border-blue-600 text-xs text-blue-950 rounded-r">
                    <strong className="block text-blue-800 font-semibold mb-0.5">Recommendation:</strong>
                    <span>{issue.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 text-xs">
              <FileCheck2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <strong>No Security Vulnerabilities Detected</strong>
              <p className="mt-1">The audited source code meets all defined CodeShield security rules.</p>
            </div>
          )}
        </div>

        {/* Conclusion Section (Strict requirement from Section 13) */}
        <div className="pt-6 border-t-2 border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-950 uppercase tracking-wide">
            Conclusion
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-slate-100 p-4 rounded-lg border border-slate-200">
            "CodeShield provides a preliminary automated security analysis. The report should be used as a development aid and does not replace a professional security audit."
          </p>

          <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <div className="border-b border-slate-300 pb-1 mb-1">
                <span className="font-semibold text-slate-800">Lead Developer / Student Auditor</span>
              </div>
              <span>CodeShield Automated Static Testing Tool</span>
            </div>
            <div>
              <div className="border-b border-slate-300 pb-1 mb-1">
                <span className="font-semibold text-slate-800">Academic Project Review Committee</span>
              </div>
              <span>Bachelor of Computer Applications (BCA) Project</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
