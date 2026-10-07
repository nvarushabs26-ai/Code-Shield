"""
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

# Upload configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max limit

# Allowed extensions
ALLOWED_EXTENSIONS = {'.py', '.java', '.js', '.html', '.css', '.cpp', '.c', '.php', '.sql', '.txt'}
BLOCKED_EXTENSIONS = {'.exe', '.bat', '.sh', '.bin', '.cmd', '.msi', '.dll', '.com', '.vbs', '.ps1'}

def allowed_file(filename: str) -> bool:
    _, ext = os.path.splitext(filename.lower())
    if ext in BLOCKED_EXTENSIONS:
        return False
    return ext in ALLOWED_EXTENSIONS

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# ----------------- Public Routes ----------------- #

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
        
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        
        # Validation
        if not name or not email or not password:
            flash('All fields are required.', 'danger')
            return render_template('register.html')
            
        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return render_template('register.html')
            
        if len(password) < 6:
            flash('Password must be at least 6 characters long.', 'danger')
            return render_template('register.html')
            
        existing_user = db.find_user_by_email(email)
        if existing_user:
            flash('An account with this email already exists.', 'danger')
            return render_template('register.html')
            
        user = db.create_user(name, email, password)
        session['user_id'] = user['id']
        session['user_name'] = user['name']
        session['user_email'] = user['email']
        
        # Create default project for new user
        db.create_project(user['id'], 'Default Project', 'Default workspace for code security scans.')
        
        flash('Account created successfully! Welcome to CodeShield.', 'success')
        return redirect(url_for('dashboard'))
        
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
        
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        
        user = db.verify_user(email, password)
        if user:
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            session['user_email'] = user['email']
            flash('Welcome back, ' + user['name'] + '!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password.', 'danger')
            
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out securely.', 'info')
    return redirect(url_for('index'))

# ----------------- Authenticated Routes ----------------- #

@app.route('/dashboard')
@login_required
def dashboard():
    user_id = session['user_id']
    projects = db.get_user_projects(user_id)
    history = db.get_user_history(user_id)
    
    total_scans = len(history)
    total_issues = sum(s['total_issues'] for s in history)
    avg_score = round(sum(s['security_score'] for s in history) / total_scans) if total_scans > 0 else 100
    
    return render_template('dashboard.html',
                           projects=projects,
                           history=history[:5],
                           total_scans=total_scans,
                           total_issues=total_issues,
                           avg_score=avg_score)

@app.route('/projects')
@login_required
def projects():
    user_id = session['user_id']
    user_projects = db.get_user_projects(user_id)
    return render_template('projects.html', projects=user_projects)

@app.route('/project/create', methods=['POST'])
@login_required
def project_create():
    user_id = session['user_id']
    project_name = request.form.get('project_name', '').strip()
    description = request.form.get('description', '').strip()
    
    if not project_name:
        flash('Project name is required.', 'danger')
        return redirect(url_for('projects'))
        
    db.create_project(user_id, project_name, description)
    flash(f'Project "{project_name}" created successfully.', 'success')
    return redirect(url_for('projects'))

@app.route('/upload')
@login_required
def upload():
    user_id = session['user_id']
    user_projects = db.get_user_projects(user_id)
    if not user_projects:
        db.create_project(user_id, 'Primary Project', 'Workspace for source code scans.')
        user_projects = db.get_user_projects(user_id)
    return render_template('upload.html', projects=user_projects)

@app.route('/scan', methods=['POST'])
@login_required
def scan():
    user_id = session['user_id']
    project_id = request.form.get('project_id')
    code_text = request.form.get('code_text', '')
    uploaded_file = request.files.get('file')
    
    if not project_id:
        flash('Please select or create a project first.', 'danger')
        return redirect(url_for('upload'))
        
    project = db.get_project_by_id(int(project_id), user_id)
    if not project:
        flash('Invalid project selected.', 'danger')
        return redirect(url_for('upload'))
        
    content = ""
    filename = "manual_snippet.py"
    file_size = 0
    
    if uploaded_file and uploaded_file.filename:
        filename = secure_filename(uploaded_file.filename)
        if not allowed_file(filename):
            flash('Disallowed file format! Upload only source code files (.py, .java, .js, .html, .css, .cpp, .c, .php, .sql, .txt). Dangerous executables are strictly rejected.', 'danger')
            return redirect(url_for('upload'))
            
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        uploaded_file.save(save_path)
        file_size = os.path.getsize(save_path)
        
        try:
            with open(save_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception as e:
            flash(f'Error reading uploaded file: {str(e)}', 'danger')
            return redirect(url_for('upload'))
    elif code_text.strip():
        content = code_text
        filename = request.form.get('custom_filename', 'pasted_code.py').strip()
        file_size = len(content.encode('utf-8'))
    else:
        flash('Please either upload a file or paste source code to scan.', 'warning')
        return redirect(url_for('upload'))
        
    # Language detection
    _, ext = os.path.splitext(filename.lower())
    lang_map = {
        '.py': 'Python',
        '.js': 'JavaScript',
        '.java': 'Java',
        '.php': 'PHP',
        '.c': 'C',
        '.cpp': 'C++',
        '.sql': 'SQL',
        '.html': 'HTML',
        '.css': 'CSS',
        '.txt': 'Plain Text'
    }
    language = lang_map.get(ext, 'Source Code')
    
    # Run security scan
    scan_result = scanner.scan_content(content, filename=filename)
    
    # Save to database
    scan_id = db.save_scan(int(project_id), filename, scan_result, file_size=file_size, language=language)
    
    flash(f'Scan completed! Found {scan_result["total_issues"]} potential security findings.', 'info')
    return redirect(url_for('results', scan_id=scan_id))

@app.route('/results/<int:scan_id>')
@login_required
def results(scan_id: int):
    user_id = session['user_id']
    scan, issues = db.get_scan_details(scan_id, user_id)
    if not scan:
        flash('Scan result not found or access denied.', 'danger')
        return redirect(url_for('dashboard'))
    return render_template('results.html', scan=scan, issues=issues)

@app.route('/history')
@login_required
def history():
    user_id = session['user_id']
    scans = db.get_user_history(user_id)
    return render_template('history.html', scans=scans)

@app.route('/report/<int:scan_id>')
@login_required
def report(scan_id: int):
    user_id = session['user_id']
    scan, issues = db.get_scan_details(scan_id, user_id)
    if not scan:
        flash('Security report not found or access denied.', 'danger')
        return redirect(url_for('dashboard'))
    return render_template('report.html', scan=scan, issues=issues)

if __name__ == '__main__':
    # Initialize database on startup
    try:
        db.init_db()
        print("Connected to MySQL and initialized tables.")
    except Exception as e:
        print(f"Notice: Database initialization notice: {e}")
    app.run(host='0.0.0.0', port=5000, debug=False)
