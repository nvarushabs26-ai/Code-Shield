/**
 * CodeShield – Type Definitions
 */

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Project {
  id: number;
  user_id: number;
  project_name: string;
  description: string;
  created_at: string;
  scan_count?: number;
  avg_score?: number;
}

export interface Issue {
  id: number;
  scan_id: number;
  issue_type: string;
  severity: Severity;
  line_number: number;
  code_snippet: string;
  description: string;
  recommendation: string;
  created_at?: string;
}

export interface Scan {
  id: number;
  project_id: number;
  project_name?: string;
  file_name: string;
  file_size_bytes: number;
  language: string;
  security_score: number;
  status: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical Risk';
  total_issues: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  scan_date: string;
  issues?: Issue[];
}

export interface RuleDefinition {
  id: string;
  type: string;
  severity: Severity;
  pattern: RegExp;
  description: string;
  recommendation: string;
}
