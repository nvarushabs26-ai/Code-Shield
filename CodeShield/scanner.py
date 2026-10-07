"""
CodeShield – Intelligent Source Code Security & Privacy Analyzer
Core Static Analysis Engine
Detects hard-coded secrets, database credentials, dangerous patterns, and weak cryptography.
"""

import re
from typing import List, Dict, Any, Tuple

# Severity score deductions as specified
SEVERITY_DEDUCTIONS = {
    'CRITICAL': 25,
    'HIGH': 15,
    'MEDIUM': 8,
    'LOW': 3
}

class SecurityScanner:
    """
    Automated line-by-line static source code security analyzer.
    """
    
    def __init__(self):
        # Regular expressions for security and privacy detection
        self.rules = [
            # A. Hard-coded passwords
            {
                'id': 'SEC-001',
                'type': 'Hard-Coded Password',
                'severity': 'HIGH',
                'pattern': re.compile(
                    r'(?:password|passwd|pwd|pass)\s*=\s*["\']([^"\']{4,})["\']',
                    re.IGNORECASE
                ),
                'description': 'Hard-coded password detected in source code.',
                'recommendation': 'Do not hard-code passwords. Use environment variables or a secure secrets manager.'
            },
            
            # B. API Keys / Secrets
            {
                'id': 'SEC-002',
                'type': 'Exposed API Key / Secret',
                'severity': 'CRITICAL',
                'pattern': re.compile(
                    r'(?:api_key|apikey|secret_key|secret|client_secret|auth_token)\s*=\s*["\']([a-zA-Z0-9_\-]{8,})["\']',
                    re.IGNORECASE
                ),
                'description': 'Hard-coded API key or secret token detected.',
                'recommendation': 'Remove secrets from source code and store them securely using environment variables.'
            },
            
            # C. AWS Access Keys (AKIA...)
            {
                'id': 'SEC-003',
                'type': 'AWS Access Key',
                'severity': 'CRITICAL',
                'pattern': re.compile(r'\b(AKIA[0-9A-Z]{16})\b'),
                'description': 'Plaintext AWS Access Key ID detected.',
                'recommendation': 'Never expose cloud credentials in source code. Rotate this key and use IAM roles.'
            },
            
            # D. Private Keys
            {
                'id': 'SEC-004',
                'type': 'Private Cryptographic Key',
                'severity': 'CRITICAL',
                'pattern': re.compile(r'-----BEGIN\s+(?:RSA|DSA|EC|OPENSSH|PGP)?\s*PRIVATE\s+KEY-----'),
                'description': 'Unencrypted private cryptographic key block exposed in source file.',
                'recommendation': 'Remove private keys from source code immediately. Use a secret manager or hardware security module.'
            },
            
            # E. Database Credentials
            {
                'id': 'SEC-005',
                'type': 'Database Credentials',
                'severity': 'HIGH',
                'pattern': re.compile(
                    r'(?:DB_PASSWORD|DATABASE_PASSWORD|MYSQL_PASSWORD|DB_USER|DATABASE_URL)\s*=\s*["\']([^"\']+)["\']',
                    re.IGNORECASE
                ),
                'description': 'Database credentials or connection string with credentials exposed in code.',
                'recommendation': 'Store database credentials securely using environment variables.'
            },
            
            # F. Dangerous eval()
            {
                'id': 'SEC-006',
                'type': 'Dangerous Code Execution (eval)',
                'severity': 'HIGH',
                'pattern': re.compile(r'\b(?:eval|exec)\s*\((.*?)\)'),
                'description': 'Dynamic evaluation of code (eval/exec) can execute untrusted arbitrary input.',
                'recommendation': 'Avoid eval() because it may execute untrusted input. Use safe parsing alternatives (e.g. ast.literal_eval, JSON.parse).'
            },
            
            # G. Weak Hashing
            {
                'id': 'SEC-007',
                'type': 'Weak Hashing Algorithm',
                'severity': 'MEDIUM',
                'pattern': re.compile(
                    r'\b(?:md5|sha1|hashlib\.md5|hashlib\.sha1|MessageDigest\.getInstance\s*\(\s*["\'](MD5|SHA-?1)["\'])\b',
                    re.IGNORECASE
                ),
                'description': 'Deprecate weak hash algorithm (MD5/SHA1) vulnerable to collision attacks.',
                'recommendation': 'Use modern password hashing algorithms such as bcrypt, scrypt, or Argon2.'
            },
            
            # H. Debug Mode Enabled
            {
                'id': 'SEC-008',
                'type': 'Debug Mode Enabled in Code',
                'severity': 'MEDIUM',
                'pattern': re.compile(
                    r'(?:debug\s*=\s*True|DEBUG\s*=\s*True|app\.run\([^)]*debug\s*=\s*True)',
                    re.IGNORECASE
                ),
                'description': 'Debug mode is explicitly enabled, which exposes interactive debuggers and stack traces in production.',
                'recommendation': 'Disable debug mode in production. Read debug flag from an environment variable.'
            },
            
            # I. SQL Injection Risk
            {
                'id': 'SEC-009',
                'type': 'SQL Injection Vulnerability',
                'severity': 'HIGH',
                'pattern': re.compile(
                    r'(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)[^;\'"]*\s*(?:\+|%|\.format|\$|\$\{)\s*[a-zA-Z0-9_.]+',
                    re.IGNORECASE
                ),
                'description': 'Dynamic string concatenation or formatting inside SQL query string detected.',
                'recommendation': 'Use parameterized SQL queries instead of string concatenation.'
            },
            
            # J. Sensitive Information (Emails, Bearer tokens, Authorization headers)
            {
                'id': 'SEC-010',
                'type': 'Sensitive Information Exposure',
                'severity': 'MEDIUM',
                'pattern': re.compile(
                    r'(?:Authorization:\s*Bearer\s+[a-zA-Z0-9_\-\.]{15,}|[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+|(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})'
                ),
                'description': 'Possible exposed sensitive information (email, phone number, or bearer token).',
                'recommendation': 'Sanitize personally identifiable information (PII) and credentials from production code and test artifacts.'
            }
        ]

    def scan_content(self, content: str, filename: str = "code.txt") -> Dict[str, Any]:
        """
        Scans source code string line by line.
        Returns detailed issue list, score, and breakdown.
        """
        lines = content.splitlines()
        issues: List[Dict[str, Any]] = []
        
        for idx, line in enumerate(lines, start=1):
            line_stripped = line.strip()
            # Ignore empty lines and pure comments in common languages
            if not line_stripped or line_stripped.startswith(('#', '//', '/*', '*', '--')):
                continue
                
            for rule in self.rules:
                match = rule['pattern'].search(line)
                if match:
                    issues.append({
                        'issue_type': rule['type'],
                        'severity': rule['severity'],
                        'line_number': idx,
                        'code_snippet': line.strip()[:140],
                        'description': rule['description'],
                        'recommendation': rule['recommendation']
                    })
        
        # Calculate Security Score
        score = 100
        critical_count = 0
        high_count = 0
        medium_count = 0
        low_count = 0
        
        for issue in issues:
            sev = issue['severity']
            if sev == 'CRITICAL':
                critical_count += 1
                score -= SEVERITY_DEDUCTIONS['CRITICAL']
            elif sev == 'HIGH':
                high_count += 1
                score -= SEVERITY_DEDUCTIONS['HIGH']
            elif sev == 'MEDIUM':
                medium_count += 1
                score -= SEVERITY_DEDUCTIONS['MEDIUM']
            elif sev == 'LOW':
                low_count += 1
                score -= SEVERITY_DEDUCTIONS['LOW']
                
        # Clamp score between 0 and 100
        score = max(0, min(100, score))
        
        # Status rating
        if score >= 90:
            status = 'Excellent'
        elif score >= 75:
            status = 'Good'
        elif score >= 50:
            status = 'Needs Improvement'
        else:
            status = 'Critical Risk'
            
        return {
            'file_name': filename,
            'security_score': score,
            'status': status,
            'total_issues': len(issues),
            'critical_count': critical_count,
            'high_count': high_count,
            'medium_count': medium_count,
            'low_count': low_count,
            'issues': issues
        }

# Global singleton scanner instance
scanner = SecurityScanner()
