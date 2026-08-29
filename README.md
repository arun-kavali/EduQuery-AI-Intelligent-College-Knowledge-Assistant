# EduQuery AI — Intelligent College Knowledge Assistant

> **A Retrieval-Augmented Generation (RAG) Platform for Educational Institutions**

[![Repository URL](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/arun-kavali/EduQuery-AI-Intelligent-College-Knowledge-Assistant)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React_18_%7C_Vite_5-61dafb?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%7C_Express-339933?logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-Supabase_%7C_pgvector-3ecf8e?logo=supabase)](https://supabase.com/)
[![AI Provider](https://img.shields.io/badge/AI_Provider-Google_Gemini_API-4285f4?logo=google)](https://aistudio.google.com/)

EduQuery AI is an enterprise-grade Retrieval-Augmented Generation (RAG) platform designed specifically for universities, colleges, and academic institutions. It transforms static campus documents—such as official academic handbooks, course syllabi, fee structures, examination regulations, housing policies, and department circulars—into an interactive vector knowledge base. 

By combining vector semantic search using Supabase PostgreSQL (`pgvector`) with Google Gemini Large Language Models, EduQuery AI provides immediate, context-grounded AI answers backed by verifiable document source citations.

---

## 1. Project Name

**EduQuery AI — Intelligent College Knowledge Assistant**

- **Repository:** [https://github.com/arun-kavali/EduQuery-AI-Intelligent-College-Knowledge-Assistant](https://github.com/arun-kavali/EduQuery-AI-Intelligent-College-Knowledge-Assistant)
- **Git Clone URL:** `https://github.com/arun-kavali/EduQuery-AI-Intelligent-College-Knowledge-Assistant.git`

---

## 2. Problem Statement

Educational institutions issue hundreds of multi-page policy manuals, syllabus PDFs, and administrative notices every semester across fragmented portals.

- **Information Asymmetry:** Students, faculty members, and campus staff struggle to find accurate, up-to-date answers buried inside 50+ page PDFs.
- **Traditional Keyword Search Failures:** Standard search tools rely on exact string matching, failing for natural queries like *"What is the penalty if I turn in my lab report late due to medical illness?"*
- **Generative AI Hallucinations:** Commercial AI chatbots ungrounded in official documents invent fake campus deadlines, incorrect fee amounts, or non-existent academic rules.
- **Administrative Support Burden:** University helpdesks spend thousands of manual hours responding to repetitive, routine student inquiries.

### The Solution

EduQuery AI implements a strict Retrieval-Augmented Generation pipeline:
1. Admins upload official college PDFs, Word documents, or text files.
2. The system parses text, splits it into 1,000-character overlapping semantic chunks, and generates 768-dimensional vector embeddings using Google Gemini (`gemini-embedding-001`).
3. Vectors are stored in Supabase PostgreSQL using `pgvector` HNSW index.
4. User questions trigger vector similarity search via Supabase RPC (`match_chunks`), retrieving top-K matching contexts.
5. Google Gemini (`gemini-3.6-flash`) synthesizes an answer using **ONLY** the retrieved context, citing exact source documents and similarity match percentages.

---

## 3. Features

### AI & Core RAG Pipeline
- 🤖 **AI-Powered RAG Chat:** Conversational AI interface for natural language querying over college documents.
- 🎯 **Grounded Answers:** Prompts ground LLM outputs strictly inside retrieved document context to eliminate hallucinations.
- 📌 **Verifiable Source Citations:** Interactive citation cards showing document title, category, chunk index, text snippet excerpt, and similarity match percentage (`98% Match`).
- ⚠️ **Unknown-Question Fallback:** Automatically detects when document context is missing or below relevance thresholds (0.25) and safeguards the user with clear un-hallucinated disclaimers.
- 🧩 **Text Extraction & Chunking:** Recursive character text splitter divides files into 1,000-character segments with 200-character overlaps.
- 📐 **768-Dimensional Gemini Embeddings:** Converts document chunks into 768-d vector embeddings using Google Gemini (`gemini-embedding-001`).
- ⚡ **Supabase `pgvector` Similarity Search:** Fast vector distance matching (`<=>`) using PostgreSQL HNSW index.

### Document Management & Organization
- 📄 **Multi-Format Document Ingestion:** Supports PDF (`pdf-parse`), Microsoft Word (`mammoth` DOCX), and plain text (`TXT`).
- 📂 **Document Management Hub:** Browse, search, filter, and inspect indexed documents and vector chunks.
- 🏷️ **Category & Department Filtering:** Categorizes knowledge into Admissions, Academics, Courses, Fees, Exams, Hostel, Library, or Department (CS, IT, Electronics, Mechanical, Civil, Administration).
- 🗑️ **Cascading Document Deletion:** Secure deletion of document records and all associated vector chunk embeddings.

### Security, Roles & Analytics
- 🔐 **Student & Admin Authentication:** Secure user sessions via Supabase Auth integration.
- 🛡️ **Role-Based Access Control (RBAC):** Role separation for Students, Faculty, and Administrators.
- 💬 **Persistent Conversation History:** Stores user chat sessions and message logs in Supabase PostgreSQL.
- 👍 **Answer Feedback System:** Interactive thumbs-up and thumbs-down ratings on AI answers.
- 🛠️ **Admin Dashboard & Statistics:** Health metrics (Total Documents, Vector Chunks, Total Chats, Avg Feedback), ingestion progress stepper (Upload, Extract, Embed, Index), and live RAG test bench.

---

## 4. Technology Stack

| Category | Technology | Usage in Project |
| :--- | :--- | :--- |
| **Frontend** | [React 18](https://react.dev/) | Component-based UI rendering |
| | [Vite 5](https://vitejs.dev/) | Frontend build tool & local dev server |
| | [React Router DOM v6](https://reactrouter.com/) | Client-side page routing |
| | [Lucide React](https://lucide.dev/) | Modern icon set |
| | [Axios](https://axios-http.com/) | HTTP API requests |
| | Vanilla CSS | Custom light theme design system (`index.css`) |
| **Backend** | [Node.js](https://nodejs.org/) (v18+) | Server-side JavaScript runtime |
| | [Express.js v4](https://expressjs.com/) | RESTful API backend web framework |
| | `multer` | File upload handling |
| | `pdf-parse` | PDF raw text extraction |
| | `mammoth` | DOCX Word document raw text extraction |
| | `dotenv` | Environment variable management |
| | `cors` | Cross-origin resource sharing middleware |
| **Database** | [Supabase PostgreSQL](https://supabase.com/) | Relational database hosting |
| | `pgvector` Extension | High-dimensional vector indexing & HNSW similarity search |
| | `@supabase/supabase-js` | Supabase Node.js & React database client |
| **AI / RAG** | [Google Generative AI SDK](https://aistudio.google.com/) | `@google/generative-ai` client |
| | `gemini-embedding-001` | 768-dimensional vector embedding model |
| | `gemini-3.6-flash` | Grounded RAG answer synthesis LLM |
| **Authentication** | Supabase Auth & Role Middleware | Role-based authorization (`student`, `faculty`, `admin`) |

---

## 5. Screenshots

> *Note: Place your screenshot image files in the `screenshots/` directory at the project root.*

```text
screenshots/
├── landing-page.png
├── auth-page.png
├── chat-dashboard.png
├── document-hub.png
└── admin-dashboard.png
```

![Landing Page](screenshots/landing-page.png)
*Figure 1: Landing Page featuring project overview, statistics, and RAG pipeline flow visualizer.*

![Authentication Page](screenshots/auth-page.png)
*Figure 2: Authentication Page with split-screen banner, Student/Admin role selector, and SSO option.*

![AI Chat Dashboard](screenshots/chat-dashboard.png)
*Figure 3: AI Chat Dashboard showing status indicators, prompt bubbles, grounded answer card, and Active Sources drawer.*

![Document Hub](screenshots/document-hub.png)
*Figure 4: Document Knowledge Base displaying search, category filter pills, and indexed document status cards.*

![Admin Control Center](screenshots/admin-dashboard.png)
*Figure 5: Admin Control Center featuring metric stat cards, document ingestion task stepper, and live RAG test bench.*

---

## 6. Live Demo

- **Vercel Deployment URL:** `https://your-eduquery-frontend.vercel.app` *(Deployment Pending — Add live URL here when deployed)*

---

## 7. Backend

- **Backend API Production URL:** `https://your-eduquery-backend.onrender.com/api` *(Deployment Pending — Add API URL here when deployed)*
- **Local Health Check Endpoint:** `http://localhost:5000/api/health`

---

## 8. Setup Instructions

### Prerequisites
- **Node.js:** v18.0.0 or higher installed.
- **npm:** v9.0.0 or higher.
- **Supabase Account:** Free account at [supabase.com](https://supabase.com).
- **Google Gemini API Key:** Free key from [Google AI Studio](https://aistudio.google.com).

---

### Step-by-Step Local Setup

#### 1. Clone the GitHub Repository
```bash
git clone https://github.com/arun-kavali/EduQuery-AI-Intelligent-College-Knowledge-Assistant.git
cd EduQuery-AI-Intelligent-College-Knowledge-Assistant
```

#### 2. Install Backend Dependencies (`server/`)
```bash
cd server
npm install
```

#### 3. Install Frontend Dependencies (`client/`)
```bash
cd ../client
npm install
```

#### 4. Configure Database Schema (Supabase)
1. Log in to your **Supabase Dashboard** and select your project.
2. Navigate to the **SQL Editor** tab.
3. Copy and execute the complete contents of [`supabase/schema.sql`](file:///c:/Users/arunm/OneDrive/Desktop/EduQuery%20AI/supabase/schema.sql).
4. Confirm that the `vector` extension is enabled and the `documents`, `document_chunks`, `conversations`, `messages`, and `feedback` tables are created along with the `match_chunks` RPC function.

#### 5. Configure Environment Variables
Create `.env` files inside both `server/` and `client/` directories following the template in Section 9 below.

#### 6. Start the Backend Server
```bash
cd server
npm start
```
*The Express server will start on `http://localhost:5000` and output `🟢 LIVE GEMINI MODE ACTIVE` when a valid key is configured.*

#### 7. Start the Frontend Development Server
```bash
cd client
npm run dev
```
*The React Vite server will start on `http://localhost:3000`.*

#### 8. Open the Application
Open your browser and navigate to:
```text
http://localhost:3000
```

---

## 9. Environment Variables

### Frontend Environment Variables (`client/.env`)

Create a `.env` file in the `client/` directory:

```env
# Supabase Frontend Configuration
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Express Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Backend Environment Variables (`server/.env`)

Create a `.env` file in the `server/` directory:

```env
# Express Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Database Configuration
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Google Gemini AI Provider Configuration
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
GEMINI_GENERATION_MODEL=gemini-3.6-flash
```

---

### 🚨 Critical Security Notice

> [!CAUTION]
> **NEVER COMMIT REAL CREDENTIALS TO GIT**
> 
> The repository and source control history must **NEVER** contain:
> - Actual Google Gemini API keys
> - Database connection passwords
> - Supabase `service_role` secret keys
> - Authentication secret tokens
> - Private environment files (`.env`)
> 
> Always ensure `.env` is listed in your root `.gitignore` file.
