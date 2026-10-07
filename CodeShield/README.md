# CodeShield – Intelligent Source Code Security & Privacy Analyzer
**Final-Year BCA Academic Project**

CodeShield is a full-stack cybersecurity application designed for software developers, DevSecOps practitioners, and academic institutions. It performs static application security testing (SAST) on source code to detect hard-coded secrets, database credentials, dangerous execution primitives, weak hashing algorithms, debug mode flags, and SQL injection risks before code is deployed.

---

## 🛡️ Project Highlights
- **Architecture**: Python Flask MVC Web Architecture
- **Database**: MySQL (`codeshield_db`) with relational integrity and foreign keys
- **Security**: PBKDF2/SHA-256 password hashing, server-side session authentication, strict extension whitelisting
- **Static Analysis Engine**: 10 automated security & privacy detection rules
- **Scoring Algorithm**: 100-point baseline with weighted deductions per severity level

---

## 📁 Repository Structure
```
CodeShield/
├── app.py                 # Flask web application controller and routes
├── database.py            # MySQL database connection and parameterized DAO queries
├── scanner.py             # Security rule engine with line-by-line static analysis
├── schema.sql             # Relational MySQL DDL script with foreign keys
├── requirements.txt       # Python package dependencies
├── README.md              # Project documentation and setup guide
├── uploads/               # Secure temporary storage for analyzed source files
├── templates/             # Jinja2 HTML5 view templates
│   ├── base.html          # Common master layout with navigation & footer
│   ├── index.html         # Landing page
│   ├── register.html      # User registration with validation
│   ├── login.html         # User authentication
│   ├── dashboard.html     # Security operations dashboard
│   ├── projects.html      # Project workspace manager
│   ├── upload.html        # Source code upload & manual snippet scanner
│   ├── results.html       # Scan findings and severity breakdown
│   ├── history.html       # Historical scan log
│   └── report.html        # Executive security report with print formatting
└── static/
    ├── css/style.css      # Cybersecurity theme styling
    └── js/script.js       # Client-side interactions and filtering
```

---

## ⚙️ Installation & Setup (Local Environment)

### 1. Prerequisites
- Python 3.9+
- MySQL Server 8.0+ (or XAMPP / WampServer)
- pip

### 2. Configure MySQL Database
Start MySQL service, open terminal or MySQL Workbench, and run:
```bash
mysql -u root -p < schema.sql
```
This creates the `codeshield_db` database and the four tables:
- `users`: User authentication records
- `projects`: Workspace containers
- `scans`: Scan metadata and security scores
- `issues`: Granular findings with line numbers and remediation recommendations

### 3. Install Python Dependencies
```bash
cd CodeShield
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Configure Environment Variables
Optional: create a `.env` file or export environment variables:
```bash
export MYSQL_HOST=localhost
export MYSQL_USER=root
export MYSQL_PASSWORD=your_password
export MYSQL_DB=codeshield_db
export MYSQL_PORT=3306
export SECRET_KEY=your_flask_secret_key
```

### 5. Launch CodeShield
```bash
python app.py
```
Open your web browser and navigate to:
```
http://localhost:5000
```
