-- ========================================================
-- CodeShield – Source Code Security & Privacy Analyzer
-- Database Schema for MySQL
-- Database: codeshield_db
-- ========================================================

CREATE DATABASE IF NOT EXISTS codeshield_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE codeshield_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Scans Table
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

-- 4. Issues Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial Seed Data for Demo & Testing
INSERT INTO users (name, email, password) VALUES 
('Alex Morgan', 'developer@codeshield.io', 'pbkdf2:sha256:260000$codeshieldhash$9b59c71a3bf9')
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO projects (user_id, project_name, description) VALUES
(1, 'Payment Gateway API', 'Core microservice handling payment webhooks and tokenized billing.'),
(1, 'Customer Auth Service', 'OAuth2 and session authentication provider service.')
ON DUPLICATE KEY UPDATE project_name=project_name;
