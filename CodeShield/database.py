"""
CodeShield – MySQL Database Access Layer
Supports MySQL connection with parameterized queries and fallback support.
"""

import os
import mysql.connector
from mysql.connector import errorcode
from werkzeug.security import generate_password_hash, check_password_hash

# Database Configuration from environment variables
DB_HOST = os.getenv('MYSQL_HOST', 'localhost')
DB_USER = os.getenv('MYSQL_USER', 'root')
DB_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
DB_NAME = os.getenv('MYSQL_DB', 'codeshield_db')
DB_PORT = int(os.getenv('MYSQL_PORT', 3306))

def get_connection():
    """
    Establishes connection to MySQL database.
    """
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT,
            charset='utf8mb4'
        )
        return conn
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_BAD_DB_ERROR:
            # Try to connect without DB and create it
            temp_conn = mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD,
                port=DB_PORT
            )
            cursor = temp_conn.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4;")
            temp_conn.commit()
            cursor.close()
            temp_conn.close()
            # Retry connection with the database
            return mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME,
                port=DB_PORT
            )
        raise err

def init_db():
    """
    Initializes tables if they do not exist.
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(191) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """)

    # 2. projects table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        project_name VARCHAR(150) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """)

    # 3. scans table
    cursor.execute("""
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
    """)

    # 4. issues table
    cursor.execute("""
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
    """)

    conn.commit()
    cursor.close()
    conn.close()

# ----------------- User Queries ----------------- #

def create_user(name: str, email: str, raw_password: str):
    """
    Hashes password and inserts user with parameterized query.
    """
    hashed_pwd = generate_password_hash(raw_password, method='pbkdf2:sha256')
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
        cursor.execute(query, (name, email, hashed_pwd))
        conn.commit()
        user_id = cursor.lastrowid
        return {'id': user_id, 'name': name, 'email': email}
    finally:
        cursor.close()
        conn.close()

def find_user_by_email(email: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT * FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

def verify_user(email: str, raw_password: str):
    user = find_user_by_email(email)
    if not user:
        return None
    if check_password_hash(user['password'], raw_password):
        return {'id': user['id'], 'name': user['name'], 'email': user['email']}
    return None

# ----------------- Project Queries ----------------- #

def create_project(user_id: int, project_name: str, description: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "INSERT INTO projects (user_id, project_name, description) VALUES (%s, %s, %s)"
        cursor.execute(query, (user_id, project_name, description))
        conn.commit()
        return cursor.lastrowid
    finally:
        cursor.close()
        conn.close()

def get_user_projects(user_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
        SELECT p.*, COUNT(s.id) AS scan_count, AVG(s.security_score) AS avg_score
        FROM projects p
        LEFT JOIN scans s ON p.id = s.project_id
        WHERE p.user_id = %s
        GROUP BY p.id
        ORDER BY p.created_at DESC
        """
        cursor.execute(query, (user_id,))
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

def get_project_by_id(project_id: int, user_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT * FROM projects WHERE id = %s AND user_id = %s"
        cursor.execute(query, (project_id, user_id))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

# ----------------- Scan & Issues Queries ----------------- #

def save_scan(project_id: int, file_name: str, scan_result: dict, file_size: int = 0, language: str = 'Unknown'):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query_scan = """
        INSERT INTO scans (project_id, file_name, file_size_bytes, language, security_score, 
                           total_issues, critical_count, high_count, medium_count, low_count)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query_scan, (
            project_id,
            file_name,
            file_size,
            language,
            scan_result['security_score'],
            scan_result['total_issues'],
            scan_result['critical_count'],
            scan_result['high_count'],
            scan_result['medium_count'],
            scan_result['low_count']
        ))
        scan_id = cursor.lastrowid

        # Insert issues
        query_issue = """
        INSERT INTO issues (scan_id, issue_type, severity, line_number, code_snippet, description, recommendation)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        for issue in scan_result['issues']:
            cursor.execute(query_issue, (
                scan_id,
                issue['issue_type'],
                issue['severity'],
                issue['line_number'],
                issue.get('code_snippet', ''),
                issue['description'],
                issue['recommendation']
            ))

        conn.commit()
        return scan_id
    finally:
        cursor.close()
        conn.close()

def get_scan_details(scan_id: int, user_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # Verify ownership through project join
        query = """
        SELECT s.*, p.project_name, p.user_id
        FROM scans s
        JOIN projects p ON s.project_id = p.id
        WHERE s.id = %s AND p.user_id = %s
        """
        cursor.execute(query, (scan_id, user_id))
        scan = cursor.fetchone()
        if not scan:
            return None, []

        query_issues = "SELECT * FROM issues WHERE scan_id = %s ORDER BY FIELD(severity, 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'), line_number ASC"
        cursor.execute(query_issues, (scan_id,))
        issues = cursor.fetchall()
        return scan, issues
    finally:
        cursor.close()
        conn.close()

def get_user_history(user_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
        SELECT s.*, p.project_name
        FROM scans s
        JOIN projects p ON s.project_id = p.id
        WHERE p.user_id = %s
        ORDER BY s.scan_date DESC
        """
        cursor.execute(query, (user_id,))
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
