import React, { useState, useEffect } from 'react';
import { User, Project, Scan, Issue } from './types';
import { storage } from './services/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { DashboardView } from './components/DashboardView';
import { ProjectsView } from './components/ProjectsView';
import { UploadScanView } from './components/UploadScanView';
import { ResultsView } from './components/ResultsView';
import { HistoryView } from './components/HistoryView';
import { ReportView } from './components/ReportView';
import { AuthModal } from './components/AuthModal';
import { BcaProjectViewer } from './components/BcaProjectViewer';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [projects, setProjects] = useState<Project[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [currentScanId, setCurrentScanId] = useState<number | null>(null);
  const [targetProjectId, setTargetProjectId] = useState<number | undefined>(undefined);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [bcaModalOpen, setBcaModalOpen] = useState(false);

  // Initialize storage and seed data
  useEffect(() => {
    storage.init();
    const user = storage.getCurrentUser();
    setCurrentUser(user);
    refreshData(user?.id);
  }, []);

  const refreshData = (userId?: number) => {
    const p = storage.getProjects(userId);
    const s = storage.getScans();
    setProjects(p);
    setScans(s);
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    refreshData(user.id);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    setActiveTab('home');
  };

  const handleStartScan = (projectId?: number) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    setTargetProjectId(projectId);
    setActiveTab('upload');
  };

  const handleCreateProject = (name: string, description: string) => {
    if (!currentUser) return;
    storage.createProject(currentUser.id, name, description);
    refreshData(currentUser.id);
  };

  const handleScanComplete = (
    projectId: number,
    fileName: string,
    fileSize: number,
    language: string,
    scanResult: any
  ) => {
    const { scanId } = storage.saveScan(
      projectId,
      fileName,
      fileSize,
      language,
      scanResult
    );
    refreshData(currentUser?.id);
    setCurrentScanId(scanId);
    setActiveTab('results');
  };

  const handleViewResults = (scanId: number) => {
    setCurrentScanId(scanId);
    setActiveTab('results');
  };

  const handleViewReport = (scanId: number) => {
    setCurrentScanId(scanId);
    setActiveTab('report');
  };

  // Get active scan and issues
  const activeScanDetails = currentScanId
    ? storage.getScanById(currentScanId)
    : scans.length > 0
    ? storage.getScanById(scans[0].id)
    : { scan: null, issues: [] };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenBcaModal={() => setBcaModalOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            onStartScan={() => handleStartScan()}
            onGetStarted={() => {
              if (currentUser) {
                setActiveTab('dashboard');
              } else {
                handleOpenAuth('register');
              }
            }}
          />
        )}

        {activeTab === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            projects={projects}
            scans={scans}
            onStartNewScan={handleStartScan}
            onNavigate={(tab) => setActiveTab(tab)}
            onViewScanResult={handleViewResults}
            onViewScanReport={handleViewReport}
            onOpenBcaModal={() => setBcaModalOpen(true)}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            onCreateProject={handleCreateProject}
            onScanProject={(pId) => handleStartScan(pId)}
          />
        )}

        {activeTab === 'upload' && (
          <UploadScanView
            projects={projects}
            selectedProjectId={targetProjectId}
            onScanComplete={handleScanComplete}
          />
        )}

        {activeTab === 'results' && activeScanDetails.scan && (
          <ResultsView
            scan={activeScanDetails.scan}
            issues={activeScanDetails.issues}
            onScanAnother={() => setActiveTab('upload')}
            onViewReport={handleViewReport}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            scans={scans}
            onViewResults={handleViewResults}
            onViewReport={handleViewReport}
            onStartNewScan={() => handleStartScan()}
          />
        )}

        {activeTab === 'report' && activeScanDetails.scan && (
          <ReportView
            scan={activeScanDetails.scan}
            issues={activeScanDetails.issues}
            onBackToResults={handleViewResults}
          />
        )}
      </main>

      <Footer
        onOpenBcaModal={() => setBcaModalOpen(true)}
        setActiveTab={setActiveTab}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* BCA Project Code & Architecture Inspector */}
      <BcaProjectViewer
        isOpen={bcaModalOpen}
        onClose={() => setBcaModalOpen(false)}
      />
    </div>
  );
}
