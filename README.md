# Advanced Mathematics AI Agent Platform

![Status: Production Ready](https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge)

An intelligent, multi-agent AI mathematics tutor built for Indian school students. The platform provides interactive AI chat, NCERT quizzes, and a symbolic math engine for calculus and algebra.

## 🚀 Live Demo

- **Frontend (Web App)**: [https://advanced-math-ai.vercel.app](https://advanced-math-ai.vercel.app)
- **Backend API (Hugging Face)**: [https://false45-math-api.hf.space](https://false45-math-api.hf.space)

## ✨ Key Features

1. **Intelligent Math Chat**: 
   A real-time AI tutor capable of step-by-step mathematical reasoning. It renders complex equations perfectly using LaTeX (KaTeX) formatting.

2. **NCERT Quiz Engine**:
   Automatically parses markdown knowledge-base files to provide interactive multiple-choice questions for Class 9 and 10 students, tracking their progress directly.

3. **Symbolic Math Engine**:
   A dedicated Python graphing and computational engine utilizing SymPy. Users can:
   - Differentiate (`d/dx`)
   - Integrate (`∫ dx`)
   - Find Roots/Solve equations (`f(x) = 0`)
   - Visualize functions dynamically on a 2D Cartesian plane.

4. **Progress Dashboard**:
   Tracks learning progress, current streaks, accuracy, and identifies weak topics using Firebase Authentication for secure user tracking.

5. **Premium Glassmorphic UI**:
   A lightning-fast React Single Page Application (SPA) built with Vite, featuring dark mode optimization, rich animations, and an intuitive layout.

## 💻 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, KaTeX, Recharts, Lucide-React
- **Backend**: Python 3.9+, FastAPI, SymPy (Symbolic Math)
- **AI Model**: Groq API (Llama-3.3-70b-versatile) 
- **Authentication**: Firebase Auth (Google Sign-In)
- **Deployment**: Vercel (Frontend), Hugging Face Spaces / Docker (Backend)

## 🛠 Running Locally

### 1. Backend Setup

1. Clone the repository and install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Configure `.env`:
   ```bash
   GROQ_API_KEY=your_groq_api_key
   ```
3. Start the FastAPI backend:
   ```bash
   uvicorn src.main:app --reload --port 8080
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Configure `.env`:
   ```bash
   VITE_API_URL=http://localhost:8080
   VITE_FIREBASE_API_KEY=your_firebase_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```
3. Start the React Frontend:
   ```bash
   npm run dev
   ```

---
*Built with ❤️ for students learning mathematics.*