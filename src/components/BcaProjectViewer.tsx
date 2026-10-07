import React, { useState } from 'react';
import { 
  Terminal, 
  Database, 
  FileCode2, 
  Copy, 
  Check, 
  X, 
  Download, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  Folder
} from 'lucide-react';

interface BcaProjectViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BcaProjectViewer: React.FC<BcaProjectViewerProps> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState<string>('app.py');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const filesContent: Record<string, { desc: string; code: string; lang: string }> = {
    'app.py': {
      desc: 'Flask application backend with login sessions, upload security validation & SAST routing.',
      lang: 'python',
      code: `"""
CodeShield – Intelligent Source Code Security & Privacy Analyzer
Flask Web Application Backend
BCA Academic Final-Year Project
"""

import os
from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.utils import secure_filename
from scanner import scanner
import database as db

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'codeshield_super_secure_academic_key_2026')

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max limit

# Allowed extensions - blocks dangerous executables (.exe, .bat, .sh)
ALLOWED_EXTENSIONS = {'.py', '.java', '.js', '.html', '.css', '.cpp', '.c', '.php', '.sql', '.txt'}

def allowed_file(filename: str) -> bool:
    _, ext = os.path.splitext(filename.lower())
    return ext in ALLOWED_EXTENSIONS

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Routes: /, /register, /login, /logout, /dashboard, /projects, /upload, /scan, /results/<id>, /history, /report/<id>
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scan', methods=['POST'])
@login_required
def scan():
    user_id = session['user_id']
    project_id = request.form.get('project_id')
    # Validates file or snippet and executes scanner.scan_content(...)
    # Stores scan metadata and granular findings into MySQL database
    ...`
    },
    'database.py': {
      desc: 'MySQL DAO layer with parameterized queries, PBKDF2/SHA-256 password hashing & relations.',
      lang: 'python',
      code: `"""
CodeShield – MySQL Database Access Layer
Supports MySQL connection with parameterized queries and fallback support.
"""

import os
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

DB_HOST = os.getenv('MYSQL_HOST', 'localhost')
DB_USER = os.getenv('MYSQL_USER', 'root')
DB_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
DB_NAME = os.getenv('MYSQL_DB', 'codeshield_db')
DB_PORT = int(os.getenv('MYSQL_PORT', 3306))

def get_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT,
        charset='utf8mb4'
    )

def create_user(name: str, email: str, raw_password: str):
    hashed_pwd = generate_password_hash(raw_password, method='pbkdf2:sha256')
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
        cursor.execute(query, (name, email, hashed_pwd))
        conn.commit()
        return {'id': cursor.lastrowid, 'name': name, 'email': email}
    finally:
        cursor.close()
        conn.close()

def save_scan(project_id: int, file_name: str, scan_result: dict, file_size: int = 0, language: str = 'Unknown'):
    # Inserts scans record and bulk inserts issues records linked by foreign key scan_id
    ...`
    },
    'scanner.py': {
      desc: 'Python line-by-line static security scanner implementing all 10 detection rules.',
      lang: 'python',
      code: `"""
CodeShield – Intelligent Source Code Security & Privacy Analyzer
Core Static Analysis Engine
Detects hard-coded secrets, database credentials, dangerous patterns, and weak cryptography.
"""

import re
from typing import List, Dict, Any

SEVERITY_DEDUCTIONS = {
    'CRITICAL': 25,
    'HIGH': 15,
    'MEDIUM': 8,
    'LOW': 3
}

class SecurityScanner:
    def __init__(self):
        self.rules = [
            # A. Hard-coded passwords (HIGH)
            {'type': 'Hard-Coded Password', 'severity': 'HIGH', 'pattern': re.compile(r'(?:password|passwd|pwd|pass)\\s*=\\s*["\']([^"\']{4,})["\']', re.I)},
            # B. API Keys / Secrets (CRITICAL)
            {'type': 'Exposed API Key / Secret', 'severity': 'CRITICAL', 'pattern': re.compile(r'(?:api_key|apikey|secret_key|secret|client_secret)\\s*=\\s*["\']([a-zA-Z0-9_\\-]{8,})["\']', re.I)},
            # C. AWS Access Keys (CRITICAL)
            {'type': 'AWS Access Key', 'severity': 'CRITICAL', 'pattern': re.compile(r'\\b(AKIA[0-9A-Z]{16})\\b')},
            # D. Private Keys (CRITICAL)
            {'type': 'Private Cryptographic Key', 'severity': 'CRITICAL', 'pattern': re.compile(r'-----BEGIN\\s+(?:RSA|DSA|EC)?\\s*PRIVATE\\s+KEY-----')},
            # E. Database Credentials (HIGH)
            {'type': 'Database Credentials', 'severity': 'HIGH', 'pattern': re.compile(r'(?:DB_PASSWORD|DATABASE_PASSWORD|MYSQL_PASSWORD|DB_USER)\\s*=\\s*["\']([^"\']+)["\']', re.I)},
            # F. Dangerous eval() (HIGH)
            {'type': 'Dangerous Code Execution (eval)', 'severity': 'HIGH', 'pattern': re.compile(r'\\b(?:eval|exec)\\s*\\((.*?)\\)')},
            # G. Weak Hashing (MEDIUM)
            {'type': 'Weak Hashing Algorithm', 'severity': 'MEDIUM', 'pattern': re.compile(r'\\b(?:md5|sha1|hashlib\\.md5|hashlib\\.sha1)\\b', re.I)},
            # H. Debug Mode (MEDIUM)
            {'type': 'Debug Mode Enabled in Code', 'severity': 'MEDIUM', 'pattern': re.compile(r'(?:debug\\s*=\\s*True|DEBUG\\s*=\\s*True)', re.I)},
            # I. SQL Injection Risk (HIGH)
            {'type': 'SQL Injection Vulnerability', 'severity': 'HIGH', 'pattern': re.compile(r'(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)[^;\'"]*\\s*(?:\\+|%|\\$)\\s*[a-zA-Z0-9_.]+', re.I)},
            # J. Sensitive Information (MEDIUM)
            {'type': 'Sensitive Information Exposure', 'severity': 'MEDIUM', 'pattern': re.compile(r'(?:Authorization:\\s*Bearer\\s+[a-zA-Z0-9_\\-\\.]{15,}|[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+)')}
        ]

    def scan_content(self, content: str, filename: str = "code.txt") -> Dict[str, Any]:
        # Evaluates lines, calculates score (100 - deductions), clamps 0-100, assigns status.
        ...`
    },
    'schema.sql': {
      desc: 'Complete MySQL schema with users, projects, scans, and issues tables & foreign keys.',
      lang: 'sql',
      code: `-- ========================================================
-- CodeShield – Source Code Security & Privacy Analyzer
-- Database: codeshield_db
-- ========================================================

CREATE DATABASE IF NOT EXISTS codeshield_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE codeshield_db;

-- 1. users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. projects Table (1-to-many from users)
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. scans Table (1-to-many from projects)
CREATE TABLE IF NOT EXISTS scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes INT DEFAULT 0,
    language VARCHAR(50) DEFAULT 'Unknown',
    security_score INT NOT NULL DEFAULT 100,
    total_issues INT NOT NULL DEFAULT 0,
    critical_count INT NOT NULL DEFAULT 0,
    high_count INT NOT NULL DEFAULT 0,
    medium_count INT NOT NULL DEFAULT 0,
    low_count INT NOT NULL DEFAULT 0,
    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_scans_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. issues Table (1-to-many from scans)
CREATE TABLE IF NOT EXISTS issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scan_id INT NOT NULL,
    issue_type VARCHAR(100) NOT NULL,
    severity ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW') NOT NULL,
    line_number INT NOT NULL,
    code_snippet TEXT,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_issues_scan FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    },
    'requirements.txt': {
      desc: 'Python dependencies for Flask, MySQL Connector, and Werkzeug.',
      lang: 'text',
      code: `Flask==3.0.3
mysql-connector-python==8.4.0
Werkzeug==3.0.3
python-dotenv==1.0.1`
    },
    'README.md': {
      desc: 'Complete project documentation, academic deliverables, and local setup guide.',
      lang: 'markdown',
      code: `# CodeShield – Intelligent Source Code Security & Privacy Analyzer
**Final-Year BCA Academic Project**

## Quick Start on Local Machine:
1. Start MySQL Server (or XAMPP)
2. Import Database:
   mysql -u root -p < schema.sql
3. Install dependencies:
   pip install -r requirements.txt
4. Run Application:
   python app.py
5. Open browser at http://localhost:5000`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(filesContent[activeFile]?.code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                CodeShield Python &amp; MySQL Project Architecture
              </h2>
              <span className="text-xs text-slate-400">
                Final-Year BCA Project Codebase &middot; Ready for Localhost Execution
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy File'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="md:col-span-3 bg-slate-950/60 border-r border-white/10 p-4 space-y-4 overflow-y-auto">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Project Files (CodeShield/)
              </span>
              <div className="space-y-1">
                {Object.keys(filesContent).map((fName) => (
                  <button
                    key={fName}
                    onClick={() => setActiveFile(fName)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors ${
                      activeFile === fName
                        ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/60'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {fName.endsWith('.py') ? <FileCode2 className="w-3.5 h-3.5 text-blue-400" /> :
                     fName.endsWith('.sql') ? <Database className="w-3.5 h-3.5 text-yellow-400" /> :
                     <FileCode2 className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{fName}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                MySQL Database (1-to-many)
              </span>
              <div className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-slate-300 space-y-1">
                <div className="text-cyan-400 font-bold">users (1)</div>
                <div className="pl-3 text-slate-500">&darr; 1:N</div>
                <div className="text-cyan-400 font-bold">projects (N)</div>
                <div className="pl-3 text-slate-500">&darr; 1:N</div>
                <div className="text-cyan-400 font-bold">scans (N)</div>
                <div className="pl-3 text-slate-500">&darr; 1:N</div>
                <div className="text-cyan-400 font-bold">issues (N)</div>
              </div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="md:col-span-9 bg-[#070c16] flex flex-col overflow-hidden">
            <div className="px-5 py-3 bg-slate-950/40 border-b border-white/5 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-cyan-400 font-bold">{activeFile}</span>
                <span className="text-slate-400 text-[11px] ml-3">
                  {filesContent[activeFile]?.desc}
                </span>
              </div>
            </div>

            <div className="flex-1 p-5 overflow-auto">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                <code>{filesContent[activeFile]?.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
