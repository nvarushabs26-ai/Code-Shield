import React from 'react';
import { Shield, User, LogOut, Code2, PlusCircle, History, FolderKanban, Terminal } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  currentUser: UserType | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenBcaModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onOpenBcaModal
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0b1120]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block leading-none">CodeShield</span>
            <span className="text-[10px] text-cyan-400/80 font-medium tracking-wider uppercase block mt-0.5">Source Code SAST</span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`hover:text-cyan-400 transition-colors ${activeTab === 'home' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Home
          </button>
          <a
            href="#features"
            onClick={(e) => {
              if (activeTab !== 'home') {
                e.preventDefault();
                setActiveTab('home');
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-cyan-400 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              if (activeTab !== 'home') {
                e.preventDefault();
                setActiveTab('home');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-cyan-400 transition-colors"
          >
            How It Works
          </a>

          {currentUser && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 ${activeTab === 'dashboard' ? 'text-cyan-400 font-semibold' : ''}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 ${activeTab === 'projects' ? 'text-cyan-400 font-semibold' : ''}`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 ${activeTab === 'upload' ? 'text-cyan-400 font-semibold' : ''}`}
              >
                Scan Code
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 ${activeTab === 'history' ? 'text-cyan-400 font-semibold' : ''}`}
              >
                History
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Actions & Account */}
        <div className="flex items-center gap-3">
          {/* BCA Architecture & Files Inspector button */}
          <button
            onClick={onOpenBcaModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded-lg hover:bg-cyan-900/50 hover:border-cyan-700 transition-colors"
            title="Inspect Flask & MySQL Source Files"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Python &amp; MySQL Project</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-white/10 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="block font-semibold text-slate-100 truncate max-w-[110px]">{currentUser.name}</span>
                  <span className="block text-[10px] text-slate-400">Authenticated</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-300 bg-red-950/30 border border-red-900/40 rounded-lg hover:bg-red-900/40 transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg shadow-sm shadow-cyan-900/30 transition-all"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
