<div align="center">
  <img src="https://huggingface.co/front/assets/huggingface_logo.svg" width="100" height="100" alt="Logo">
  
  # Advanced Mathematics AI Agent
  
  **An intelligent, multi-agent AI mathematics tutor built for students. Features interactive AI chat, NCERT quizzes, multimodal image/PDF parsing, and a symbolic math engine for calculus and algebra.**

  [![Status: Production Ready](https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge&logo=vercel)](https://advanced-math-ai.vercel.app)
  [![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Python](https://img.shields.io/badge/Python-3.9+-yellow?style=for-the-badge&logo=python)](https://www.python.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](https://opensource.org/licenses/MIT)

  [**Live Web App (Vercel)**](https://advanced-math-ai.vercel.app) • [**Backend API (Hugging Face)**](https://false45-math-api.hf.space/docs)

</div>

<br />

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🧠 **Intelligent Math Chat** | A real-time AI tutor capable of step-by-step mathematical reasoning. It renders complex equations perfectly using LaTeX (KaTeX) formatting. |
| 📸 **Multimodal Capabilities** | Upload PDFs of math textbooks or use your laptop camera to scan handwritten math problems directly to the AI using Google Gemini Vision. |
| 📚 **NCERT Quiz Engine** | Interactive multiple-choice questions for Class 9 and 10 students powered by a Qdrant Vector Database and RAG (Retrieval-Augmented Generation). |
| 📐 **Symbolic Math Engine** | A dedicated Python graphing and computational engine utilizing SymPy. Differentiate, Integrate, Find Roots, and Visualize functions dynamically on a 2D plane. |
| 📈 **Progress Dashboard** | Tracks learning progress, current streaks, accuracy, and identifies weak topics using Firebase Authentication for secure user tracking and a live Recharts line graph. |
| 🎨 **Premium UI/UX** | A lightning-fast React Single Page Application (SPA) built with Vite, featuring dark mode optimization, glassmorphism, and rich animations. |

<br />

## 💻 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=white)
* **Libraries:** KaTeX (Math Rendering), Recharts (Graphing), Lucide-React (Icons), React-Markdown
* **Hosting:** Vercel

### Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=flat-square&logo=docker&logoColor=white)
* **AI Frameworks:** LangChain, LangGraph (for multi-agent loops)
* **Models:** Groq (Llama-3.3-70b-versatile) for rapid inference, Google Gemini (1.5 Flash) for multimodal vision.
* **Database:** Firebase Admin (Firestore) for user tracking, Qdrant (Vector DB) for NCERT knowledge retrieval.
* **Math Computation:** SymPy
* **Hosting:** Hugging Face Spaces (Docker)

<br />

## 🛠 Running Locally

### 1. Backend Setup

1. Clone the repository and navigate to the backend directory:
   ```bash
   git clone https://github.com/YourUsername/Google-ADVANCED_AI_ASSISTANCE.git
   cd Google-ADVANCED_AI_ASSISTANCE/backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Configure your `.env` file in the `backend` folder:
   ```env
   GROQ_API_KEY=your_groq_api_key
   GEMINI_API_KEY=your_gemini_api_key
   USE_GEMINI=true
   ```
4. Start the FastAPI backend:
   ```bash
   uvicorn src.main:app --reload --port 8080
   ```
   *The API will be available at `http://localhost:8080`*

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:8080
   VITE_FIREBASE_API_KEY=your_firebase_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```
4. Start the React Frontend:
   ```bash
   npm run dev
   ```
   *The Web App will be available at `http://localhost:5173`*

<br />

## 🏗 Directory Structure

```text
Google-ADVANCED_AI_ASSISTANCE/
├── backend/
│   ├── src/
│   │   ├── api/          # FastAPI Routes (chat, progress, quiz, vision)
│   │   ├── agents/       # LangGraph multi-agent logic
│   │   └── services/     # Qdrant Vector DB & Firebase connectors
│   ├── knowledge-base/   # Markdown files for NCERT RAG system
│   ├── Dockerfile        # Containerization for Hugging Face
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components (Chat, Quiz, Graphing, Dashboard)
│   │   ├── context/      # Firebase Auth state management
│   │   └── index.css     # Glassmorphism UI styles
│   └── index.html        # Main HTML entry point
└── README.md
```

<br />

---
<div align="center">
  <i>Built with ❤️ for students learning mathematics.</i>
</div>