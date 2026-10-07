/**
 * CodeShield – Persistent Storage Layer
 * Manages users, sessions, projects, scans, and issues with realistic mock DB seed
 */

import { User, Project, Scan, Issue } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'codeshield_current_user',
  USERS: 'codeshield_users',
  PROJECTS: 'codeshield_projects',
  SCANS: 'codeshield_scans',
  ISSUES: 'codeshield_issues'
};

// Initial Seed Data
const DEFAULT_USERS: User[] = [
  {
    id: 1,
    name: 'Alex Morgan',
    email: 'developer@codeshield.io',
    created_at: '2026-09-15T10:00:00Z'
  }
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    user_id: 1,
    project_name: 'Payment Gateway API',
    description: 'Core microservice processing external card transactions, webhooks, and merchant settlements.',
    created_at: '2026-09-15T10:30:00Z'
  },
  {
    id: 2,
    user_id: 1,
    project_name: 'Customer Auth Service',
    description: 'Centralized OAuth2 and session token manager with password hashing verification.',
    created_at: '2026-09-20T14:15:00Z'
  },
  {
    id: 3,
    user_id: 1,
    project_name: 'Analytics ETL Worker',
    description: 'Automated data transformation pipelines querying reporting databases.',
    created_at: '2026-10-01T08:45:00Z'
  }
];

const DEFAULT_SCANS: Scan[] = [
  {
    id: 1,
    project_id: 1,
    project_name: 'Payment Gateway API',
    file_name: 'payment_processor.py',
    file_size_bytes: 4820,
    language: 'Python',
    security_score: 52,
    status: 'Needs Improvement',
    total_issues: 3,
    critical_count: 1,
    high_count: 1,
    medium_count: 1,
    low_count: 0,
    scan_date: '2026-10-06T14:22:00Z'
  },
  {
    id: 2,
    project_id: 2,
    project_name: 'Customer Auth Service',
    file_name: 'token_manager.js',
    file_size_bytes: 3150,
    language: 'JavaScript',
    security_score: 85,
    status: 'Good',
    total_issues: 1,
    critical_count: 0,
    high_count: 1,
    medium_count: 0,
    low_count: 0,
    scan_date: '2026-10-05T09:12:00Z'
  },
  {
    id: 3,
    project_id: 1,
    project_name: 'Payment Gateway API',
    file_name: 'secure_webhook.py',
    file_size_bytes: 2600,
    language: 'Python',
    security_score: 100,
    status: 'Excellent',
    total_issues: 0,
    critical_count: 0,
    high_count: 0,
    medium_count: 0,
    low_count: 0,
    scan_date: '2026-10-04T16:40:00Z'
  }
];

const DEFAULT_ISSUES: Issue[] = [
  {
    id: 1,
    scan_id: 1,
    issue_type: 'AWS Access Key',
    severity: 'CRITICAL',
    line_number: 14,
    code_snippet: 'AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE"',
    description: 'Plaintext AWS Access Key ID detected in payment_processor.py.',
    recommendation: 'Never expose cloud credentials in source code. Rotate this key and use IAM roles.'
  },
  {
    id: 2,
    scan_id: 1,
    issue_type: 'Hard-Coded Password',
    severity: 'HIGH',
    line_number: 22,
    code_snippet: 'password = "prod_gateway_secret_2026"',
    description: 'Hard-coded password detected in source code.',
    recommendation: 'Do not hard-code passwords. Use environment variables or a secure secrets manager.'
  },
  {
    id: 3,
    scan_id: 1,
    issue_type: 'Debug Mode Enabled in Code',
    severity: 'MEDIUM',
    line_number: 48,
    code_snippet: 'app.run(host="0.0.0.0", debug=True)',
    description: 'Debug mode is explicitly enabled, which exposes interactive debuggers and stack traces in production.',
    recommendation: 'Disable debug mode in production. Read debug flag from an environment variable.'
  },
  {
    id: 4,
    scan_id: 2,
    issue_type: 'Database Credentials',
    severity: 'HIGH',
    line_number: 9,
    code_snippet: 'const DB_PASSWORD = "auth_db_secure_pass";',
    description: 'Database credentials or connection string with credentials exposed in code.',
    recommendation: 'Store database credentials securely using environment variables.'
  }
];

export const storage = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SCANS)) {
      localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(DEFAULT_SCANS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ISSUES)) {
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(DEFAULT_ISSUES));
    }
    // Set default session if none exists
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    }
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : DEFAULT_USERS;
  },

  registerUser(name: string, email: string): User {
    const users = this.getUsers();
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);

    // Create a default project for the newly registered user
    this.createProject(newUser.id, 'My First Codebase', 'Default project workspace for source code vulnerability scans.');

    return newUser;
  },

  _getRawProjects(): Project[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return raw ? JSON.parse(raw) : DEFAULT_PROJECTS;
  },

  _getRawScans(): Scan[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SCANS);
    return raw ? JSON.parse(raw) : DEFAULT_SCANS;
  },

  getProjects(userId?: number): Project[] {
    const projects = this._getRawProjects();
    const scans = this._getRawScans();

    const enriched = projects.map(p => {
      const pScans = scans.filter(s => s.project_id === p.id);
      const avg = pScans.length > 0
        ? Math.round(pScans.reduce((acc, s) => acc + s.security_score, 0) / pScans.length)
        : 100;
      return {
        ...p,
        scan_count: pScans.length,
        avg_score: avg
      };
    });

    if (userId) {
      return enriched.filter(p => p.user_id === userId);
    }
    return enriched;
  },

  createProject(userId: number, projectName: string, description: string): Project {
    const projects = this._getRawProjects();
    const newProject: Project = {
      id: Date.now(),
      user_id: userId,
      project_name: projectName,
      description: description || 'Source code security analysis workspace.',
      created_at: new Date().toISOString(),
      scan_count: 0,
      avg_score: 100
    };
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return newProject;
  },

  getScans(projectId?: number): Scan[] {
    const scans = this._getRawScans();
    const projects = this._getRawProjects();

    const withProjectNames = scans.map(s => {
      const p = projects.find(proj => proj.id === s.project_id);
      return {
        ...s,
        project_name: p ? p.project_name : 'General Workspace'
      };
    });

    if (projectId) {
      return withProjectNames.filter(s => s.project_id === projectId);
    }
    return withProjectNames;
  },

  getScanById(scanId: number): { scan: Scan | null; issues: Issue[] } {
    const scans = this.getScans();
    const scan = scans.find(s => s.id === scanId) || null;
    const allIssues = this.getIssues();
    const issues = allIssues.filter(i => i.scan_id === scanId);
    return { scan, issues };
  },

  saveScan(
    projectId: number,
    fileName: string,
    fileSize: number,
    language: string,
    result: {
      securityScore: number;
      status: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical Risk';
      totalIssues: number;
      criticalCount: number;
      highCount: number;
      mediumCount: number;
      lowCount: number;
      issues: Omit<Issue, 'id' | 'scan_id'>[];
    }
  ): { scanId: number } {
    const scans = this._getRawScans();
    const allIssues = this.getIssues();
    const newScanId = Date.now();

    const projects = this._getRawProjects();
    const project = projects.find(p => p.id === projectId);

    const newScan: Scan = {
      id: newScanId,
      project_id: projectId,
      project_name: project ? project.project_name : 'General Workspace',
      file_name: fileName,
      file_size_bytes: fileSize,
      language: language,
      security_score: result.securityScore,
      status: result.status,
      total_issues: result.totalIssues,
      critical_count: result.criticalCount,
      high_count: result.highCount,
      medium_count: result.mediumCount,
      low_count: result.lowCount,
      scan_date: new Date().toISOString()
    };

    scans.unshift(newScan);
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));

    const newIssues: Issue[] = result.issues.map((item, idx) => ({
      id: Date.now() + idx,
      scan_id: newScanId,
      issue_type: item.issue_type,
      severity: item.severity,
      line_number: item.line_number,
      code_snippet: item.code_snippet,
      description: item.description,
      recommendation: item.recommendation,
      created_at: new Date().toISOString()
    }));

    const updatedIssues = [...allIssues, ...newIssues];
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(updatedIssues));

    return { scanId: newScanId };
  },

  getIssues(): Issue[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ISSUES);
    return raw ? JSON.parse(raw) : DEFAULT_ISSUES;
  }
};
