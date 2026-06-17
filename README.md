# Aegis AI — Next-Gen Full-Stack College Student Productivity & Learning Suite

Aegis AI is an advanced, high-fidelity web application designed to optimize student workflows, automate exam preparations, and assist in daily academic calculations. Featuring a gorgeous glassmorphic interface, voice-enabled AI, a 3D flashcard study module, and a dual-mode database fallback engine, this project is built to showcase clean engineering design, modular architecture, and modern full-stack development.

---

## 🚀 Technical Highlights (Why this belongs on a Resume)

*   **Dual-Mode Resilient Database Layer**: Built with a custom schema wrapper that automatically falls back to an asynchronous flat-file JSON database (`backend/data/*.json`) when a live MongoDB service is unavailable, ensuring zero-configuration setup for evaluators.
*   **Decoupled Multi-Model AI Orchestrator**: Integrates OpenAI's GPT-4o-Mini and Google's Gemini 1.5 Flash SDKs with a fallback to a smart keyword-matching local AI engine.
*   **Hardware-Accelerated 3D Flipping**: Utilizes CSS 3D perspectives (`perspective: 1000px`, `backface-visibility`) to render interactive study flashcards.
*   **Dynamic Print-to-PDF Engine**: Features media print-friendly CSS rules in the Resume Builder, enabling students to compile single-sheet physical PDFs directly via native browser print prompts (`Cmd+P` / `Ctrl+P`).
*   **SEO-Friendly Semantic Layout**: Built from the ground up using custom-tailored PostCSS Tailwind CSS v4 variables (`@theme`) and semantic HTML5 sections.

---

## 📂 Architecture & Directory Structure

The project is organized as a unified monorepo for clean version control and concurrent development.

```
college-student-assistant/
├── package.json               # Monorepo configuration & concurrent scripts
├── README.md                  # Project documentation & resume showcase
├── backend/
│   ├── package.json           # Backend dependency configurations
│   ├── .env                   # Local configuration variables
│   ├── server.js              # Express app initialization
│   ├── config/
│   │   ├── db.js              # Unified MongoDB & flat-file JSON DB engine
│   │   └── auth.middleware.js # Security middleware validating JWT tokens
│   ├── controllers/
│   │   ├── auth.controller.js # Authentication, profile management, and mock Google login
│   │   ├── notes.controller.js# PDF and Plain Text parser with file-handling
│   │   ├── tools.controller.js# Attendance, GPA ledgers and targets calculators
│   │   └── ai.controller.js   # AI routing (OpenAI, Gemini, Local Mock engine)
│   ├── models/                # Schema models (User, Note, Chat, Tracker)
│   ├── routes/                # Express API endpoints
│   ├── data/                  # Flat-file database storage folder
│   └── uploads/               # Temporary uploads folder
└── frontend/
    ├── package.json           # Frontend packages
    ├── index.html             # Main entry (pre-configured fonts & viewports)
    └── src/
        ├── App.jsx            # State-based router and theme context hub
        ├── index.css          # Core CSS, custom themes, and 3D utilities
        ├── components/        # Sidebar, Header, and shared widgets
        ├── context/           # Auth and Theme provider states
        ├── utils/             # API client utility
        └── pages/             # 7 Responsive pages
```

---

## 🌟 Core Modules

### 1. AI Learning Assistant
*   **Interactive Chat**: Real-time doubt-solving with semantic understanding.
*   **Voice Integration**: Voice dictation input (Web Speech API) and Text-to-Speech playback.
*   **Multi-language Support**: Switches output dynamically between English, Hindi, Spanish, French, Tamil, and Telugu.
*   **History Logs**: Save conversations locally or download logs as text files.

### 2. Notes & AI Study Vault
*   **Direct Typing Notebook**: Create study cards and write your lecture contents directly inside a beautiful, custom text editor sheet.
*   **Debounced Auto-Saving**: Automatically saves title and content updates asynchronously in the background as you type.
*   **AI Study Deck Generator**: With a single click, trigger deep AI analysis on your notes to generate executive summaries, key points, flashcards, and quizzes.
*   **Interactive Learning Modules**: Solve multiple-choice quizzes (complete with congrats particles) and study flashcards using hardware-accelerated 3D flip animations.

### 3. Attendance Planner & Condonation Calculator
*   **Target Advisor**: Add courses, track attendance, and receive recommendations on whether to attend or skip next classes to remain above threshold.
*   **SRM Condonation Model**: Pre-configured guidelines for SRM University (75% general requirement, condonable to 65% on medical/dean approval).

### 4. GPA Predictor & Indian 10-Point Scale Ledger
*   **Semester Ledger**: Record credits and grades (O, A+, A, B+, B, C, F) to compute instant GPAs.
*   **Target GPA Planner**: Enter a target CGPA, and the app calculates the average GPA required in subsequent terms.

### 5. Single-Page Resume Builder
*   **Interactive CV Creator**: Edit contact info, education, skills, and experience in real-time.
*   **Print-Friendly CSS**: Configured with print media targets that hide page elements, rendering a clean, professional single-page PDF document.

---

## 🛠️ System Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React (v19), Tailwind CSS (v4), Lucide Icons, Canvas Confetti, Vite |
| **Backend** | Node.js, Express, Multer, PDF-Parse, JWT, Bcrypt |
| **Database** | MongoDB (Production) / Flat-File JSON DB (Development/Evaluation Fallback) |
| **AI Integration** | Google Generative AI SDK, OpenAI SDK, Smart Local Mock AI Pattern |

---

## 🚀 Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16.0 or higher)

### 1. Install Dependencies
Run the installation scripts in the root directory to fetch both backend and frontend requirements:
```bash
npm install && npm run install:all
```

### 2. Run the Application
Start both the API server and Vite client concurrently:
```bash
npm run dev
```

*   **Vite Frontend**: `http://localhost:5173`
*   **Express Backend**: `http://localhost:5001`

### 3. Sign In
*   Open `http://localhost:5173`.
*   Sign in with the pre-loaded credentials:
    *   **Username**: `keshavmaan`
    *   **Password**: `keshav`
