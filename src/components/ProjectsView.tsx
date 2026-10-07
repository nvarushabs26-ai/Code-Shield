import React, { useState } from 'react';
import { FolderKanban, PlusCircle, Scan, Calendar, X } from 'lucide-react';
import { Project } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  onCreateProject: (name: string, description: string) => void;
  onScanProject: (projectId: number) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onCreateProject,
  onScanProject
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    onCreateProject(name.trim(), desc.trim());
    setName('');
    setDesc('');
    setError('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
            Workspaces
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Project Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Group your repositories, services, and audit scopes into dedicated projects.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl shadow-md shadow-cyan-900/30 flex items-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 rounded-xl p-6 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight truncate max-w-[180px]">
                    {p.project_name}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {p.scan_count || 0} scans
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {p.description || 'No description provided.'}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(p.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div>
                  Avg Score: <strong className="text-white font-mono">{p.avg_score || 100}/100</strong>
                </div>
              </div>

              <button
                onClick={() => onScanProject(p.id)}
                className="w-full py-2 text-xs font-semibold text-cyan-300 hover:text-white bg-slate-800 hover:bg-cyan-950 border border-white/5 hover:border-cyan-700/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Scan className="w-3.5 h-3.5 text-cyan-400" />
                <span>Run New Scan</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <FolderKanban className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-white">Create New Project</h2>
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-red-950/60 border border-red-800/60 rounded-lg text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Project Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Identity & Access Service"
                  className="w-full px-3 py-2 text-xs text-white bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  placeholder="Brief summary of code purpose and security scope..."
                  className="w-full px-3 py-2 text-xs text-white bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg shadow-sm"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
