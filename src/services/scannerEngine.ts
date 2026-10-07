/**
 * CodeShield – Static Security & Privacy Analysis Engine
 * Line-by-line static code analyzer matching Python scanner.py logic
 */

import { Severity, RuleDefinition, Issue } from '../types';

export const SEVERITY_DEDUCTIONS: Record<Severity, number> = {
  CRITICAL: 25,
  HIGH: 15,
  MEDIUM: 8,
  LOW: 3
};

export const SECURITY_RULES: RuleDefinition[] = [
  // A. Hard-coded passwords
  {
    id: 'SEC-001',
    type: 'Hard-Coded Password',
    severity: 'HIGH',
    pattern: /(?:password|passwd|pwd|pass)\s*=\s*["']([^"']{4,})["']/i,
    description: 'Hard-coded password detected in source code.',
    recommendation: 'Do not hard-code passwords. Use environment variables or a secure secrets manager.'
  },
  // B. API Keys / Secrets
  {
    id: 'SEC-002',
    type: 'Exposed API Key / Secret',
    severity: 'CRITICAL',
    pattern: /(?:api_key|apikey|secret_key|secret|client_secret|auth_token)\s*=\s*["']([a-zA-Z0-9_\-]{8,})["']/i,
    description: 'Hard-coded API key or secret token detected.',
    recommendation: 'Remove secrets from source code and store them securely using environment variables.'
  },
  // C. AWS Access Keys
  {
    id: 'SEC-003',
    type: 'AWS Access Key',
    severity: 'CRITICAL',
    pattern: /\b(AKIA[0-9A-Z]{16})\b/,
    description: 'Plaintext AWS Access Key ID detected.',
    recommendation: 'Never expose cloud credentials in source code. Rotate this key and use IAM roles.'
  },
  // D. Private Keys
  {
    id: 'SEC-004',
    type: 'Private Cryptographic Key',
    severity: 'CRITICAL',
    pattern: /-----BEGIN\s+(?:RSA|DSA|EC|OPENSSH|PGP)?\s*PRIVATE\s+KEY-----/,
    description: 'Unencrypted private cryptographic key block exposed in source file.',
    recommendation: 'Remove private keys from source code immediately. Use a secret manager or hardware security module.'
  },
  // E. Database Credentials
  {
    id: 'SEC-005',
    type: 'Database Credentials',
    severity: 'HIGH',
    pattern: /(?:DB_PASSWORD|DATABASE_PASSWORD|MYSQL_PASSWORD|DB_USER|DATABASE_URL)\s*=\s*["']([^"']+)["']/i,
    description: 'Database credentials or connection string with credentials exposed in code.',
    recommendation: 'Store database credentials securely using environment variables.'
  },
  // F. Dangerous eval()
  {
    id: 'SEC-006',
    type: 'Dangerous Code Execution (eval)',
    severity: 'HIGH',
    pattern: /\b(?:eval|exec)\s*\((.*?)\)/,
    description: 'Dynamic evaluation of code (eval/exec) can execute untrusted arbitrary input.',
    recommendation: 'Avoid eval() because it may execute untrusted input. Use safe parsing alternatives (e.g. ast.literal_eval, JSON.parse).'
  },
  // G. Weak Hashing
  {
    id: 'SEC-007',
    type: 'Weak Hashing Algorithm',
    severity: 'MEDIUM',
    pattern: /\b(?:md5|sha1|hashlib\.md5|hashlib\.sha1|MessageDigest\.getInstance\s*\(\s*["'](MD5|SHA-?1)["'])\b/i,
    description: 'Weak cryptographic hash algorithm (MD5/SHA1) vulnerable to collision attacks.',
    recommendation: 'Use modern password hashing algorithms such as bcrypt, scrypt, or Argon2.'
  },
  // H. Debug Mode Enabled
  {
    id: 'SEC-008',
    type: 'Debug Mode Enabled in Code',
    severity: 'MEDIUM',
    pattern: /(?:debug\s*=\s*True|DEBUG\s*=\s*True|app\.run\([^)]*debug\s*=\s*True)/i,
    description: 'Debug mode is explicitly enabled, which exposes interactive debuggers and stack traces in production.',
    recommendation: 'Disable debug mode in production. Read debug flag from an environment variable.'
  },
  // I. SQL Injection Risk
  {
    id: 'SEC-009',
    type: 'SQL Injection Vulnerability',
    severity: 'HIGH',
    pattern: /(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)[^;'"\n]*\s*(?:\+|%|\.format|\$|\$\{)\s*[a-zA-Z0-9_.]+/i,
    description: 'Dynamic string concatenation or formatting inside SQL query string detected.',
    recommendation: 'Use parameterized SQL queries instead of string concatenation.'
  },
  // J. Sensitive Information (Emails, tokens, phone numbers)
  {
    id: 'SEC-010',
    type: 'Sensitive Information Exposure',
    severity: 'MEDIUM',
    pattern: /(?:Authorization:\s*Bearer\s+[a-zA-Z0-9_\-\.]{15,}|[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+|(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/,
    description: 'Possible exposed sensitive information (email, phone number, or bearer token).',
    recommendation: 'Sanitize personally identifiable information (PII) and credentials from production code and test artifacts.'
  }
];

export interface ScanResult {
  fileName: string;
  securityScore: number;
  status: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical Risk';
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  issues: Omit<Issue, 'id' | 'scan_id'>[];
}

export function analyzeSourceCode(content: string, fileName: string): ScanResult {
  const lines = content.split(/\r?\n/);
  const detectedIssues: Omit<Issue, 'id' | 'scan_id'>[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    // Skip empty lines and full line comments
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('--')) {
      return;
    }

    const lineNumber = index + 1;

    for (const rule of SECURITY_RULES) {
      if (rule.pattern.test(line)) {
        detectedIssues.push({
          issue_type: rule.type,
          severity: rule.severity,
          line_number: lineNumber,
          code_snippet: line.trim().slice(0, 140),
          description: rule.description,
          recommendation: rule.recommendation
        });
      }
    }
  });

  // Calculate score starting at 100
  let score = 100;
  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  for (const issue of detectedIssues) {
    if (issue.severity === 'CRITICAL') {
      criticalCount++;
      score -= SEVERITY_DEDUCTIONS.CRITICAL;
    } else if (issue.severity === 'HIGH') {
      highCount++;
      score -= SEVERITY_DEDUCTIONS.HIGH;
    } else if (issue.severity === 'MEDIUM') {
      mediumCount++;
      score -= SEVERITY_DEDUCTIONS.MEDIUM;
    } else if (issue.severity === 'LOW') {
      lowCount++;
      score -= SEVERITY_DEDUCTIONS.LOW;
    }
  }

  score = Math.max(0, Math.min(100, score));

  let status: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical Risk' = 'Excellent';
  if (score >= 90) {
    status = 'Excellent';
  } else if (score >= 75) {
    status = 'Good';
  } else if (score >= 50) {
    status = 'Needs Improvement';
  } else {
    status = 'Critical Risk';
  }

  return {
    fileName,
    securityScore: score,
    status,
    totalIssues: detectedIssues.length,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    issues: detectedIssues
  };
}

export function detectLanguage(fileName: string): string {
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  const map: Record<string, string> = {
    '.py': 'Python',
    '.java': 'Java',
    '.js': 'JavaScript',
    '.html': 'HTML',
    '.css': 'CSS',
    '.cpp': 'C++',
    '.c': 'C',
    '.php': 'PHP',
    '.sql': 'SQL',
    '.txt': 'Plain Text'
  };
  return map[ext] || 'Source Code';
}

export const ALLOWED_EXTENSIONS = ['.py', '.java', '.js', '.html', '.css', '.cpp', '.c', '.php', '.sql', '.txt'];
export const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.sh', '.bin', '.cmd', '.msi', '.dll', '.com', '.vbs', '.ps1'];

export function isAllowedExtension(fileName: string): boolean {
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  if (BLOCKED_EXTENSIONS.includes(ext)) return false;
  return ALLOWED_EXTENSIONS.includes(ext);
}
