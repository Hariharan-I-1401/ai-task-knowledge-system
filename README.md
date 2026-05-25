Capital Startup Funding Application Portal

Premium, investor-grade digital application web platform and structured deal intake pipeline engineered for FSV Capital venture deal flows.

This platform automates complex deal-flow management by providing founders with an elegant, multi-step application wizard and giving investors a high-trust administrative cockpit complete with live analytics, pipeline indicators, and high-fidelity reporting.

🚀 System Architecture Overview

The application is structured as a robust, decoupled framework ensuring strict data isolation, typing validation, and clean state representation:

Frontend Core: React (Vite.js) styled with Tailwind CSS, leveraging modular functional stepper forms, visual completion indicators, live canvas charts, and JWT auth flow states.

Backend API Engine: FastAPI (Python 3.10+) leveraging Pydantic schema engines, SQLAlchemy core ORM, and safe multipart file streams.

Database Layer: MySQL relational database managing transactional state consistency.

Data Exporter: Pandas memory-buffered streaming engines outputting compliant, high-fidelity spreadsheet structures.

✨ Core Features & Implementations

Multi-Step Founder Intake Matrix (11 Sections)

The ingestion workspace captures extensive metrics across 11 key operational evaluation segments:

Section 1: Basic Information: Core corporate metadata, HQ geographic location, legal markers, and LinkedIn properties.

Section 2: Startup Overview: Problem statements, solutions, industry/sector classifiers (Fintech, AI, Blockchain, SaaS, DeepTech), and startup operational stages.

Section 3: Product & Technology: Granular product profiles, code technologies, USP metrics, and IP/Patent monitoring.

Section 4: Market Opportunity: Sized addressable market indices (TAM, SAM, SOM), targeting descriptions, and competitive defensibility layouts.

Section 5: Traction & Metrics: Crucial operational indicators (MRR, MoM Growth rate, pilot enterprise customer counts, and key partnerships).

Section 6: Financials: Historical funding ledger, investor tracking, operational burn profiles, runway indexing, and 3-year growth plans.

Section 7: Funding Requirement: Clear ask amounts (automatically sanitized to numeric floats), targeted stages, equity parameters, and proceed allocation lists.

Section 8: Team Background: Human capital evaluations, domain experience, and advisory boards.

Section 9: Strategic Fit: Venture ecosystem synergetic alignment arguments and mentor program settings.

Section 10: Documents Upload: Mandatory PDF Pitch Deck uploads and optional financial models.

Section 11: Compliance & Declaration: Registration status flags, dispute histories, and a legal DPDP-compliant data processing agreement checkbox.

Secure Binary File Ingestion Flow

Integrates browser binary objects with FastAPI asynchronously over multipart boundaries.

Native validation guards block non-PDF attachments before upload transactions can be initiated.

Automatically serializes saved pitch deck naming configurations directly matching the authenticated owner profile.

Server-Verified Truth States

Client-side storage state fallbacks are completely replaced by an isolated JWT-verified database endpoint query (/startups/my-application). This ensures application status remains 100% accurate, even across session terminations.

Admin Cockpit & High-Fidelity Spreadsheet Exporter

Interactive administrative dashboards tracking total pipeline entries, tasks, active operators, and completion indices.

Dynamic sector distribution charts measuring portfolio health percentages.

A high-fidelity data compiler extracting every form parameter from MySQL, running custom formatting fallbacks, and serving them in a unified .xlsx spreadsheet download.

🛠️ Local Environment Installation & Setup

Prerequisites

Node.js (v18+)

Python (v3.10+)

MySQL Server running locally

Database Configuration

Launch your local database CLI client and run the setup commands to establish your schema:

CREATE DATABASE fsv_capital_db;


Backend API Setup

Step 1: Open your terminal and navigate to the backend folder:

cd backend


Step 2: Build and activate a clean Python virtual environment:

python -m venv venv
# On Windows (CMD/PowerShell):
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate


Step 3: Install all production dependency frameworks:

pip install fastapi uvicorn sqlalchemy mysqlclient pandas openpyxl pydantic python-multipart


Step 4: Create an environment file (.env) in your backend root and define your connection strings:

DATABASE_URL=mysql://your_username:your_password@localhost:3306/fsv_capital_db
SECRET_KEY=your_secure_jwt_secret_token_signature


Step 5: Launch the local API server:

uvicorn app.main:app --reload


Frontend UI Setup

Step 1: Navigate back and open your frontend folder:

cd ../frontend


Step 2: Install the node package configurations:

npm install


Step 3: Boot up the Vite compiler server:

npm run dev


Step 4: Access the platform:
Open your browser and navigate to http://localhost:5173.

📊 API Endpoint Architecture Ledger

Method

Endpoint

Authorization

Functional Objective

POST

/api/auth/register

Public

Generates a new credential-backed identity record

POST

/api/auth/login

Public

Authenticates credentials and issues a secure session JWT

POST

/api/startups/apply

Founder Only

Accepts 11-step form data arrays and Pitch Deck binary payloads

GET

/api/startups/my-application

Founder Only

Safely verifies application state against the active Auth Token

GET

/api/admin/stats

Admin Only

Compiles numerical aggregates and pipeline distribution charts

GET

/api/analytics/export

Admin Only

Compiles all active DB profiles directly into an Excel download

📜 Governance, Safety, and Trust

The code is built around standard corporate compliance frameworks:

Information Protection: Users must explicitly authorize data-sharing clauses before pipelines can initiate.

SQL Injection Defensibility: Parameterized SQLAlchemy session calls natively abstract queries to neutralize potential SQL injection payloads.

Resilient Fallback Handling: Database operations execute in transaction scopes, automatically running session rollbacks if any unexpected errors occur during processing.
