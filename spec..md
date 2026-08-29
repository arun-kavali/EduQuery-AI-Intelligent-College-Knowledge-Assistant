# Spec Driven Development

# Building EduQuery AI — Your Intelligent College Knowledge Assistant with SDD

## Table of Contents

1. Introduction
2. What Spec Driven Development Means
3. Why SDD Matters
4. What We Are Going to Build Today
5. The Parameters of a Good Specification
6. Essential SDD Spec Topics to Include in Every Project
7. Complete Specification
8. Project Overview & Tech Stack
9. Authentication, Roles, Knowledge Base, and RAG Pipeline
10. Document Processing, AI Generation, Semantic Search, and Retrieval
11. Frontend Pages
12. Backend Architecture & Database Tables
13. API Endpoints
14. Folder Structure & Development Phases
15. UI, Security, Outcome, and AI Coding Agent Instructions
16. Requirement-by-Requirement Compliance Matrix
17. Where Each Specification Parameter Shows Up
18. Setting Up an AI Coding Agent
19. How to Properly Write Specs for AI Coding Agents
20. How to Build the Project Using the Specification
21. Why a Single Spec Is Not Enough
22. Testing, Deployment, and Final Submission Requirements
23. Final Expected Outcome
24. Closing Thought

---

# Introduction

## What Spec Driven Development Means

Spec Driven Development, often shortened to SDD, is a development approach where the specification is written before any application code is produced.

The core principle is simple:

**Specification first. Code second.**

In traditional development, a developer may start writing code with only a rough understanding of the product requirements. In Spec Driven Development, the developer first creates a detailed specification that explains:

* What problem the application solves
* Who the target users are
* What features must exist
* Which technologies must be used
* Which pages must be built
* How authentication must work
* How frontend and backend communicate
* How the database is structured
* How documents are uploaded and processed
* How embeddings are generated
* How vector search works
* How the RAG pipeline retrieves context
* How the LLM generates grounded answers
* How unknown questions must be handled
* How the application must be tested
* How the application must be deployed
* How the final project must satisfy the submission requirements

Once the specification is complete, the AI coding agent must treat it as the primary source of truth.

Whenever the coding agent is uncertain, it must return to the specification rather than guessing, inventing architecture, or introducing unnecessary technologies.

For a full-stack RAG application such as EduQuery AI, this is especially important because the project contains multiple connected systems:

* User authentication
* Role-based access
* Admin document management
* File storage
* PDF/document processing
* Text extraction
* Text cleaning
* Chunking
* Embedding generation
* Vector storage
* Semantic similarity search
* Retrieval-Augmented Generation
* AI answer generation
* Source references
* Conversation history
* Frontend-backend communication
* Database persistence
* Deployment

The specification is what keeps all these systems consistent.

---

# Why SDD Matters

SDD matters most when using AI coding agents such as Google Antigravity, Codex, Cursor, GitHub Copilot, Lovable, Bolt, Replit, or similar AI-assisted development tools.

A vague prompt produces vague code.

For example, if an AI coding agent is told:

> Build me an AI college chatbot.

The agent has to guess:

* Which AI model to use
* Whether authentication is required
* Whether documents should be stored
* Whether uploaded PDFs need processing
* How embeddings are generated
* Which vector database is used
* Whether the system is actually RAG-based
* How retrieved documents are linked to answers
* How sources are displayed
* How chat history works
* Which users can upload documents
* How the admin panel works
* How unknown questions are handled

That leads to inconsistent architecture and incomplete functionality.

A common failure would be building a normal chatbot that sends the student's question directly to an LLM.

That does **not** satisfy the EduQuery AI project requirements.

EduQuery AI must implement a real Retrieval-Augmented Generation pipeline:

**College Documents → Text Extraction → Chunking → Embeddings → Vector Database → Similarity Search → Relevant Context → LLM → Final Answer**

A clear specification prevents the AI coding agent from skipping mandatory stages.

The specification also ensures:

* The frontend does not invent API endpoints
* The backend does not use a different database structure from the UI
* The document processing pipeline remains consistent
* The RAG pipeline is real and verifiable
* Admin and student permissions remain separated
* The deployed application matches the required architecture
* Every NxtWave must-have requirement is explicitly implemented

For this project, the specification is both a build contract and a verification checklist.

---

# What We Are Going to Build Today

Today we are going to build a full-stack AI-powered college knowledge assistant called:

# EduQuery AI

## Tagline

**Your Intelligent College Knowledge Assistant**

EduQuery AI is an intelligent college information platform that allows students to ask questions about their college and receive AI-generated answers grounded in uploaded college documents and institutional knowledge.

The system is based on Retrieval-Augmented Generation, commonly known as RAG.

The application must answer questions related to topics such as:

* Admissions
* Departments
* Courses
* Fees
* Examinations
* Academic calendar
* Hostel
* Library
* Clubs
* Placements
* Scholarships
* College policies
* Events
* Notices
* Academic regulations
* Student services

The application must not simply depend on the general knowledge of an LLM.

Instead, the application must follow a real retrieval pipeline.

The high-level question-answering flow is:

**Student Question → Query Embedding → Vector Database Search → Relevant Context Retrieval → LLM → Grounded Answer + Sources**

The complete ingestion pipeline is:

**College Documents → Text Extraction → Text Cleaning → Chunking → Embedding Generation → Vector Database Storage**

The application has two main user roles:

### Student/User

Students use EduQuery AI to:

* Register and log in
* Ask college-related questions
* View AI-generated answers
* View source documents
* View source excerpts
* Continue conversations
* Access previous chat history
* Start new conversations
* View suggested questions
* Provide answer feedback

### Admin

Administrators use EduQuery AI to:

* Access the admin dashboard
* Upload college documents
* Upload PDF and supported document files
* Organize documents by category
* Organize documents by department
* Monitor processing status
* View document metadata
* Update document information
* Replace or update documents
* Delete documents
* Manage the college knowledge base
* View basic analytics
* Review knowledge base health

The end result must feel like a polished, modern AI knowledge platform rather than a basic chatbot.

---

# The Parameters of a Good Specification

Not every document qualifies as a useful software specification.

A specification that an AI coding agent can reliably build from must meet the following quality standards.

## Clarity

Every requirement must have one clear meaning.

The specification must avoid vague statements such as:

* Add some AI features
* Create a nice dashboard
* Support documents and other things
* Make the chatbot intelligent
* Add anything useful

Instead, the specification must define exactly what the application is expected to do.

## Completeness

The specification must cover:

* Product purpose
* Target users
* User roles
* Technology stack
* Core features
* Bonus features
* Authentication
* Database design
* File storage
* Document processing
* RAG pipeline
* Vector search
* AI generation
* Frontend pages
* Backend services
* API endpoints
* Folder structure
* Security
* Error handling
* Development phases
* Testing
* Deployment
* Final submission requirements

## Consistency

Names must remain consistent across:

* Frontend
* Backend
* Database
* APIs
* Services
* Components
* Documentation

For example, if the system uses the name `document_chunks`, the frontend, backend, database documentation, and API contracts must not randomly use conflicting names such as:

* chunks
* vectors
* embeddings_data
* processed_documents

unless they refer to explicitly different concepts.

## Concrete Technology Choices

The technology stack must be explicitly defined.

The coding agent must not randomly replace technologies during development.

## Structured Sections

Related requirements must be grouped under clear headings.

The specification should be readable by both:

* Human developers
* AI coding agents

## Phased Delivery

The application must be built in phases.

The AI coding agent must not attempt to generate the entire application blindly in one step.

Each phase must be:

* Implemented
* Tested
* Verified
* Reviewed

before moving to the next phase.

## Authoritative Tone

The specification uses terms such as:

* Must
* Shall
* Required
* Must not
* Explicitly
* Only after
* Before proceeding

This prevents the AI coding agent from treating mandatory features as optional.

---

# Essential SDD Spec Topics to Include in Every Project

This project specification must clearly define:

1. Project Overview
2. Problem Statement
3. Target Users
4. Technology Stack
5. Core Features
6. Bonus Features
7. Authentication
8. Role-Based Access
9. Document Upload
10. Document Processing
11. RAG Architecture
12. Embedding Generation
13. Vector Database Search
14. AI Answer Generation
15. Unknown Question Handling
16. Source References
17. Chat History
18. Admin Management
19. Frontend Pages
20. Backend Architecture
21. Database Tables
22. API Endpoints
23. Folder Structure
24. Development Phases
25. UI and UX Requirements
26. Security Requirements
27. Testing Requirements
28. Deployment Requirements
29. Final Expected Outcome
30. AI Coding Agent Instructions

---

# Complete Specification

# Project Overview & Tech Stack

## Project Overview

Build a full-stack AI-powered college information assistant called:

# EduQuery AI

## Tagline

**Your Intelligent College Knowledge Assistant**

EduQuery AI must allow students to ask questions about their college and receive answers generated through a real Retrieval-Augmented Generation pipeline.

The system must retrieve relevant information from uploaded college knowledge sources before generating an answer.

Supported knowledge sources may include:

* College documents
* PDF files
* Official notices
* Admission information
* Department information
* Course information
* Fee information
* Examination notices
* Academic calendars
* Hostel information
* Library information
* Club information
* Placement information
* Scholarship information
* College policies
* Event information
* Frequently asked questions

The core product workflow must be:

```text
Admin Uploads College Document
            ↓
      File Storage
            ↓
     Text Extraction
            ↓
      Text Cleaning
            ↓
         Chunking
            ↓
   Embedding Generation
            ↓
   Vector Database Storage
            ↓
────────────────────────────────
            ↓
     Student Asks Question
            ↓
   Generate Query Embedding
            ↓
 Semantic Similarity Search
            ↓
 Retrieve Relevant Chunks
            ↓
   Relevance Threshold Check
       ↙              ↘
Relevant            Not Relevant
   ↓                    ↓
Send Context       Unknown Question
to LLM              Response
   ↓
AI Generates
Grounded Answer
   ↓
Answer + Sources
```

The system must never treat a direct LLM request as a valid RAG implementation.

A working retrieval pipeline with embeddings and semantic/vector search is mandatory.

---

# Problem Statement

College information is often distributed across many disconnected documents, notices, PDF files, department pages, and administrative resources.

Students may struggle to quickly find accurate answers to questions such as:

* What is the exam schedule?
* What documents are required for admission?
* What is the hostel fee?
* Which department offers a particular course?
* When is the academic event?
* What scholarship options are available?
* What are the library timings?
* What placement policies apply?
* What is the college attendance policy?

Traditional search requires students to manually open multiple documents and scan large amounts of text.

A generic AI chatbot is not sufficient because it can hallucinate information or answer from general knowledge rather than official college resources.

EduQuery AI solves this problem by creating a centralized AI-powered knowledge assistant that retrieves relevant information from approved college documents before generating an answer.

---

# Target Users

## Primary Users

### Students

Students need fast access to accurate college information.

Their primary workflow is:

**Login → Ask Question → Retrieve Relevant Knowledge → Receive Grounded Answer → View Source**

## Administrative Users

Administrators maintain the college knowledge base.

Their primary workflow is:

**Login → Upload Document → Process Document → Generate Embeddings → Store Knowledge → Manage Documents**

---

# Technology Stack

## Frontend

The frontend must use:

* React.js
* Vite
* JavaScript
* React Router
* Axios
* Modern CSS
* Lucide React icons

The frontend must be deployed on Vercel.

The frontend must be responsive and work properly on:

* Desktop
* Tablet
* Mobile

## Backend

The backend must use:

* Node.js
* Express.js
* JavaScript
* REST API architecture
* Middleware-based request handling
* Centralized error handling
* Input validation

The backend must be deployed on Render.

## Database and Platform Services

Supabase is the primary backend data platform.

Supabase must provide:

* PostgreSQL database
* Authentication
* User management
* File storage
* Database relationships
* Row-level security where appropriate

The project is already connected to Supabase through MCP configuration in Google Antigravity.

The AI coding agent must use the connected Supabase project and must not create unnecessary duplicate database systems.

## Vector Database

The project must use:

* PostgreSQL
* pgvector

The vector database must store embeddings generated from processed document chunks.

Each chunk must be independently searchable through semantic similarity search.

## AI Services

The application must use AI services for:

* Embedding generation
* RAG answer generation
* Optional AI-powered bonus features

The AI provider configuration must be environment-based.

No API keys may be exposed in frontend code.

The implementation may use Google Gemini APIs where configured.

The backend must keep AI provider calls centralized inside AI services.

## File Storage

Supabase Storage must be used for uploaded documents where appropriate.

The database must store document metadata and references to the stored file.

## Deployment

The required production architecture is:

```text
GitHub Repository
        │
        ├──────────────→ Vercel
        │                  │
        │                  ▼
        │             React Frontend
        │                  │
        │                  ▼
        │                Users
        │
        └──────────────→ Render
                           │
                           ▼
                     Express Backend
                           │
                           ▼
                       Supabase
                  ┌────────┼────────┐
                  ▼        ▼        ▼
            PostgreSQL   Auth    Storage
                  │
                  ▼
               pgvector
```

---

# Authentication, Roles, Knowledge Base, and RAG Pipeline

# Authentication

The authentication system must support:

* User registration
* User login
* User logout
* Persistent authenticated sessions
* Protected frontend routes
* Protected backend endpoints
* Authenticated user profile retrieval
* Role-based access

Supabase Authentication must be used.

The system must not expose service-role credentials to the frontend.

## Required Authentication Features

### Signup

Users must be able to:

* Enter their name
* Enter their email
* Enter a password
* Confirm the password
* Receive validation errors where required

### Login

Users must be able to:

* Enter email
* Enter password
* Receive authentication errors
* Remain logged in across page refreshes according to the configured session behavior

### Logout

Users must be able to:

* End their active session
* Clear authenticated application state
* Return to a public or login page

### Protected Routes

Unauthenticated users must not access:

* Chat history
* Student dashboard
* Admin dashboard
* Admin document management

The application must redirect unauthorized users appropriately.

---

# Role-Based Access

The application must support at least two roles:

```text
student
admin
```

## Student Permissions

Students may:

* Access the student application
* Start conversations
* Ask questions
* View answers
* View source references
* View their own chat history
* Delete their own conversations where supported
* Submit answer feedback

Students must not:

* Upload knowledge base documents
* Modify documents
* Delete knowledge base documents
* Access admin analytics
* Access admin-only APIs

## Admin Permissions

Admins may:

* Access the admin dashboard
* Upload documents
* Update document metadata
* Replace documents
* Delete documents
* View document processing status
* Organize documents
* Access document management
* View knowledge base analytics

Admin authorization must be verified on both:

* Frontend routes
* Backend endpoints

Frontend hiding alone is not considered security.

---

# Knowledge Base Management

The knowledge base is the source of truth for EduQuery AI answers.

Administrators must be able to manage college knowledge documents.

Each document must contain metadata including:

* Document ID
* Title
* Description
* Category
* Department
* Original file name
* File type
* File storage path
* Processing status
* Chunk count
* Version number
* Upload date
* Last updated date
* Uploaded by
* Processing error where applicable

Document categories may include:

* Admissions
* Academics
* Departments
* Courses
* Fees
* Examinations
* Academic Calendar
* Hostel
* Library
* Clubs
* Placements
* Scholarships
* Policies
* Events
* Notices
* General

The system must support department-wise knowledge bases.

Example departments may include:

* Computer Science
* Information Technology
* Electronics
* Mechanical
* Civil
* Management
* Administration

The architecture must support adding new departments without changing the codebase.

---

# Document Upload

Administrators must be able to upload supported documents.

Initial mandatory support must include:

* PDF

The implementation may additionally support other formats where practical.

The upload workflow must be:

```text
Admin Selects File
        ↓
Frontend Validation
        ↓
Backend/API Upload Request
        ↓
File Validation
        ↓
Supabase Storage
        ↓
Document Metadata Created
        ↓
Processing Started
        ↓
Status Updated
```

The UI must show processing states such as:

```text
UPLOADED
PROCESSING
PROCESSED
FAILED
```

The system must not report a document as successfully processed before text extraction and embedding storage are completed.

---

# Document Processing Pipeline

EduQuery AI must process uploaded documents through a real ingestion pipeline.

The required pipeline is:

**College Documents → Text Extraction → Text Cleaning → Chunking → Embedding Generation → Vector Database**

## Stage 1: Text Extraction

The backend must extract readable text from uploaded PDF documents.

The extracted content must be associated with the original document.

## Stage 2: Text Cleaning

The system must normalize extracted text where required.

The processing pipeline should:

* Remove unnecessary whitespace
* Normalize repeated line breaks
* Preserve meaningful paragraphs
* Preserve document metadata
* Avoid removing useful information

## Stage 3: Chunking

The extracted document text must be split into meaningful chunks.

Each chunk must contain:

* Chunk ID
* Document ID
* Chunk index
* Chunk content
* Token or character metadata where available
* Category
* Department
* Source metadata

Chunks should preferably contain overlapping context where appropriate to reduce information loss across chunk boundaries.

Chunking must not simply store the entire document as one vector.

## Stage 4: Embedding Generation

The backend must generate a semantic embedding for every processed document chunk.

Each embedding represents the meaning of its associated chunk.

The embedding generation process must:

* Run on the backend
* Never expose AI API keys to the browser
* Associate each embedding with its chunk
* Handle embedding failures
* Update document processing status

## Stage 5: Vector Storage

Each processed chunk embedding must be stored in the vector-enabled database.

The system must preserve the relationship:

```text
Document
   ↓
Document Chunks
   ↓
Chunk Embeddings
```

---

# Vector Database and Semantic Search

The project must use vector-based semantic search.

When a student submits a question, the application must:

1. Receive the user's question
2. Generate an embedding for the question
3. Search the vector database
4. Compare the question vector against document chunk vectors
5. Retrieve the most relevant chunks
6. Calculate or return similarity/relevance information
7. Apply a relevance threshold
8. Pass only relevant context to the answer generation system

The system must not simply perform a normal keyword search and call that a RAG implementation.

Semantic/vector similarity search is mandatory.

The application may later add hybrid keyword and semantic search as a bonus feature.

---

# Required RAG Pipeline

The required document ingestion pipeline is:

```text
College Documents
       ↓
Text Extraction
       ↓
Text Cleaning
       ↓
Chunking
       ↓
Embedding Generation
       ↓
Vector Database
```

The required query pipeline is:

```text
Student Question
       ↓
Query Embedding
       ↓
Vector Database Search
       ↓
Similarity Search
       ↓
Relevant Context Retrieval
       ↓
Relevance Threshold Validation
       ↓
LLM
       ↓
Final Answer
       ↓
Source References
```

The full system flow is:

```text
ADMIN
  │
  ▼
Upload College Document
  │
  ▼
Store Original File
  │
  ▼
Extract Text
  │
  ▼
Clean Text
  │
  ▼
Split Into Chunks
  │
  ▼
Generate Embeddings
  │
  ▼
Store Chunks + Vectors
  │
  │
────────────────────────────────
  │
STUDENT
  │
  ▼
Ask Question
  │
  ▼
Generate Query Embedding
  │
  ▼
Semantic Similarity Search
  │
  ▼
Retrieve Relevant Chunks
  │
  ▼
Is Context Relevant?
  │
  ├──────────── YES ────────────┐
  │                             │
  NO                            ▼
  │                       Build RAG Context
  ▼                             │
Unknown Answer                  ▼
Response                    Send Context
                                 +
                           User Question
                                 │
                                 ▼
                                LLM
                                 │
                                 ▼
                          Grounded Answer
                                 │
                                 ▼
                         Answer + Sources
```

This pipeline is mandatory.

---

# AI-Generated Answers

AI-generated answers must be grounded in retrieved college knowledge.

The answer generation prompt must instruct the LLM to:

* Use the provided retrieved context
* Answer based on the available context
* Avoid inventing unsupported information
* Clearly state uncertainty where appropriate
* Avoid pretending to know information not contained in the knowledge base

The answer must be generated only after successful retrieval.

The backend must construct the AI request using:

* System instructions
* Retrieved context
* User question
* Relevant conversation context where appropriate

The answer response must include:

* Answer text
* Source documents
* Relevant source chunks
* Relevance information where supported
* Timestamp

---

# Unknown Question Handling

Unknown question handling is mandatory.

The system must not hallucinate answers when the vector search does not find sufficiently relevant information.

The query pipeline must include a relevance threshold.

The backend logic must follow this pattern:

```text
Student Question
       ↓
Vector Search
       ↓
Relevant Chunks?
       │
   ┌───┴────┐
   │        │
  YES       NO
   │        │
   ▼        ▼
LLM with    Return
Context     Unknown Answer
   │
   ▼
Grounded Answer
```

When relevant information is unavailable, the application must return a clear response similar to:

> I couldn't find reliable information about this in the currently available college knowledge base. Please try asking in another way or contact the relevant college department.

The exact wording may vary.

The important behavior is mandatory:

**No sufficiently relevant context = no fabricated answer.**

---

# Source and Reference Display

Every grounded answer must display the source information used.

The source UI must show relevant information such as:

* Document title
* Category
* Department where applicable
* Relevant source excerpt
* Source reference indicator

Where technically practical, the application should support source highlighting.

The answer UI must clearly distinguish:

```text
AI Answer
```

from:

```text
Sources Used
```

Users must be able to understand where the answer came from.

---

# Conversation History and Context

The application must support persistent conversation history.

Users must be able to:

* Start a new conversation
* Continue an existing conversation
* View previous conversations
* Open previous conversations
* View messages in a conversation
* Delete conversations where supported

Each conversation must contain:

* Conversation ID
* User ID
* Title
* Created date
* Last updated date

Each message must contain:

* Message ID
* Conversation ID
* Role
* Content
* Sources where applicable
* Created date

The system must support relevant conversation context.

The backend should include recent conversation messages where appropriate.

The system must avoid sending an unlimited conversation history to the AI model.

Conversation context should be controlled to prevent:

* Excessive token usage
* Slow responses
* Context window overflow

---

# Answer Feedback

EduQuery AI should include answer feedback as a bonus feature.

Students should be able to submit:

* 👍 Helpful
* 👎 Not Helpful

Feedback must be associated with:

* User
* Conversation
* Message
* Feedback type
* Optional comment
* Timestamp

The application must prevent duplicate feedback from the same user for the same answer unless explicitly updated.

---

# Suggested Questions

The application should display suggested questions based on available knowledge categories.

Examples may include:

* What are the hostel fees?
* When are the upcoming examinations?
* What documents are required for admission?
* What scholarships are available?
* What are the library timings?

Suggested questions may be:

* Static by category
* Dynamically generated
* AI-generated as a bonus feature

---

# Department-Wise Knowledge Bases

EduQuery AI should support department-specific knowledge.

Documents may be assigned to:

* General college knowledge
* Specific departments

The application architecture must allow retrieval filtering.

Example:

```text
Computer Science Knowledge Base
        +
General College Knowledge
```

A student asking a department-specific question may retrieve information from both:

* The selected department
* General college documents

---

# Multilingual Chatbot

Multilingual support is a bonus feature.

The application may allow students to ask questions in supported languages.

The system should preserve the user's language where possible.

The system may:

* Detect the language automatically
* Allow manual language selection
* Generate answers in the language used by the student

This feature must not interfere with the accuracy of the core RAG pipeline.

---

# Streaming AI Responses

Streaming AI responses are an advanced bonus feature.

If implemented, the answer should appear progressively while the AI response is generated.

The UI must handle:

* Streaming state
* Partial responses
* Errors
* Completion
* Source display after retrieval

Streaming must not be implemented in a way that bypasses source retrieval.

Retrieval must occur before generation begins.

---

# Voice Input and Responses

Voice input and response functionality is optional.

If implemented:

* Students may use microphone input
* Speech must be converted to text
* The text must go through the same RAG pipeline
* Voice input must not bypass semantic search

Voice output may read the generated answer.

---

# Conversation Export

Conversation export is optional.

Users may export supported conversations in an appropriate format such as:

* Text
* PDF
* Markdown

Exported content must clearly distinguish:

* User questions
* AI answers
* Source information where appropriate

---

# Admin Dashboard

The admin dashboard is a recommended bonus feature.

It should display useful metrics such as:

* Total documents
* Successfully processed documents
* Processing documents
* Failed documents
* Total document chunks
* Total conversations
* Total questions
* Total users where permitted
* Feedback statistics
* Recent document uploads

The dashboard must display real data rather than hardcoded statistics.

---

# Admin Analytics

Admin analytics may include:

* Most frequently asked topics
* Most frequently asked questions
* Most used document categories
* Positive feedback count
* Negative feedback count
* Knowledge base document counts
* Processing success rate
* Unanswered or unknown questions

Unknown questions can be useful because they reveal gaps in the knowledge base.

---

# Document Version Management

Document version management is an advanced bonus feature.

Each document should support:

* Version number
* Upload date
* Last updated date
* Replacement history where practical

When a document is replaced:

* Old chunks must not remain active incorrectly
* New text must be processed
* New embeddings must be generated
* The active vector index must reflect the latest document version

---

# Automatic Document Summarization

Automatic document summarization is optional.

When a document is successfully processed, the system may generate:

* Short summary
* Key topics
* Main information

The summary must be clearly identified as generated metadata.

---

# OCR for Scanned Documents

OCR support is an advanced optional feature.

If implemented, the system should:

```text
Detect Scanned Document
        ↓
Run OCR
        ↓
Extract Text
        ↓
Continue Standard RAG Pipeline
```

OCR must not replace or break the normal PDF text extraction workflow.

---

# Hybrid Keyword and Semantic Search

Hybrid search is an optional advanced feature.

The retrieval process may combine:

* Vector semantic similarity
* Keyword search
* Metadata filtering

However, the initial required implementation must first have working semantic vector search.

Hybrid search must not be used as an excuse to omit vector search.

---

# Document Re-Ranking

Re-ranking is an optional advanced feature.

The system may:

1. Retrieve the top candidate chunks
2. Compare their relevance to the question
3. Re-rank them
4. Pass the highest-quality context to the LLM

This must be implemented only after the core retrieval pipeline is working.

---

# AI-Generated FAQs

AI-generated FAQs are optional.

The system may analyze processed documents and generate useful questions and answers.

Generated FAQs must be reviewable before being treated as authoritative knowledge.

---

# Frontend Pages

The application must use React with React Router.

## Public Pages

### `/`

Landing page.

The landing page must include:

* EduQuery AI branding
* Tagline
* Clear explanation of the problem
* Explanation of how the AI knowledge assistant works
* Main features
* RAG workflow visualization
* Call-to-action buttons
* Responsive navigation
* Login button
* Signup button
* Modern professional design

The landing page must explain the core trust principle:

**Answers are generated using retrieved college knowledge sources.**

---

### `/login`

The login page must include:

* Email input
* Password input
* Validation
* Loading state
* Authentication error display
* Login button
* Link to signup

---

### `/register`

The registration page must include:

* Name
* Email
* Password
* Confirm password
* Validation
* Loading state
* Error handling
* Link to login

---

# Student Pages

### `/chat`

The primary EduQuery AI chat interface.

The page must include:

* New conversation button
* Chat history sidebar
* Suggested questions
* User messages
* AI messages
* Loading state
* Typing/generating state
* Message input
* Send button
* Source display
* Unknown question display
* Answer feedback
* Responsive layout

The primary interaction is:

```text
Student Question
        ↓
Backend RAG API
        ↓
Semantic Search
        ↓
Relevant Context
        ↓
AI Answer
        ↓
Source References
        ↓
Displayed in Chat
```

---

### `/chat/:conversationId`

Displays a specific conversation.

The application must:

* Load conversation messages
* Restore previous chat history
* Allow the user to continue the conversation
* Display previous answer sources

---

### `/history`

Displays previous conversations.

Users must be able to:

* Search conversations where practical
* Open conversations
* Delete conversations
* Start a new conversation

---

### `/profile`

Displays user information and account controls.

The page may include:

* Name
* Email
* Role
* Account information
* Logout

---

# Admin Pages

### `/admin/dashboard`

The admin dashboard must be accessible only to users with the admin role.

The dashboard should include:

* Document metrics
* Processing metrics
* Knowledge base metrics
* Recent uploads
* Recent activity
* Feedback metrics where implemented

---

### `/admin/documents`

Admin document management page.

The page must allow administrators to:

* Upload documents
* View documents
* Search documents
* Filter by category
* Filter by department
* View processing status
* Edit metadata
* Delete documents

---

### `/admin/documents/upload`

Document upload interface.

The page must include:

* File selection
* Title
* Description
* Category
* Department
* Upload validation
* File type validation
* Loading state
* Processing status

---

### `/admin/documents/:id`

Document details page.

The page must display:

* Document information
* Category
* Department
* File metadata
* Processing status
* Number of chunks
* Version
* Upload date
* Last updated date
* Processing errors where applicable

The page must support update and delete actions for authorized admins.

---

# Backend Architecture

The backend must use a layered architecture.

The major backend layers are:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
AI / RAG Services
   ↓
Supabase
```

## Routes Layer

Responsible for:

* HTTP routing
* Middleware composition
* Authentication middleware
* Role authorization
* Request validation

Routes must not contain major business logic.

## Controllers Layer

Controllers are responsible for:

* Reading requests
* Calling services
* Returning responses

Controllers must remain thin.

Controllers must not contain complex:

* RAG logic
* Database queries
* AI provider logic
* Document processing logic

## Services Layer

Services must own business logic.

Examples:

* Authentication service
* User service
* Document service
* Document processing service
* Embedding service
* Vector search service
* RAG service
* Chat service
* Analytics service

## AI Layer

The AI layer must centralize:

* Embedding generation
* LLM calls
* Prompt construction
* AI error handling

The frontend must never call the AI provider directly using secret credentials.

## RAG Layer

The RAG layer must coordinate:

* Query embedding
* Vector search
* Metadata filtering
* Relevance checking
* Context construction
* Answer generation
* Source construction

---

# Database Tables

The database must use proper relationships.

## `profiles`

Stores application user profile information.

Suggested fields:

* id
* full_name
* email
* role
* created_at
* updated_at

Role values:

```text
student
admin
```

---

## `documents`

Stores uploaded knowledge base documents.

Suggested fields:

* id
* title
* description
* original_file_name
* file_path
* file_type
* category
* department_id or department
* processing_status
* processing_error
* chunk_count
* version
* uploaded_by
* created_at
* updated_at

---

## `document_chunks`

Stores processed document chunks and embeddings.

Suggested fields:

* id
* document_id
* content
* chunk_index
* embedding
* metadata
* created_at

The embedding column must support vector operations through pgvector.

---

## `departments`

Stores department information.

Suggested fields:

* id
* name
* code
* description
* created_at

---

## `conversations`

Stores user conversations.

Suggested fields:

* id
* user_id
* title
* created_at
* updated_at

---

## `messages`

Stores messages.

Suggested fields:

* id
* conversation_id
* role
* content
* source_metadata
* relevance_data
* created_at

Role values:

```text
user
assistant
system
```

---

## `message_sources`

Stores source information associated with AI answers.

Suggested fields:

* id
* message_id
* document_id
* chunk_id
* source_title
* source_excerpt
* relevance_score
* created_at

---

## `answer_feedback`

Stores student feedback.

Suggested fields:

* id
* user_id
* message_id
* feedback_type
* comment
* created_at

Feedback values:

```text
helpful
not_helpful
```

---

# Database Relationships

The core relationships are:

```text
User
 │
 ├── Conversations
 │        │
 │        └── Messages
 │                 │
 │                 └── Message Sources
 │
 └── Answer Feedback


Admin
 │
 └── Documents
          │
          └── Document Chunks
                    │
                    └── Embeddings
```

---

# API Endpoints

All backend endpoints must be prefixed with:

```text
/api
```

## Health

### `GET /api/health`

Returns backend health status.

The response should indicate:

* Backend status
* Timestamp
* Database connectivity status where appropriate

---

# Authentication

### `POST /api/auth/register`

Registers a user.

Required data:

* Name
* Email
* Password

---

### `POST /api/auth/login`

Authenticates a user.

Required data:

* Email
* Password

---

### `POST /api/auth/logout`

Logs out the authenticated user where backend logout handling is required.

---

### `GET /api/auth/me`

Returns the currently authenticated user.

---

# Documents

### `GET /api/documents`

Returns documents for authorized users.

Admin access and filtering behavior must be enforced.

Supported filters may include:

* Category
* Department
* Processing status
* Search query

---

### `POST /api/documents`

Uploads and creates a document.

Admin only.

The backend must:

1. Validate authorization
2. Validate file
3. Store the file
4. Create document metadata
5. Start processing
6. Update processing status

---

### `GET /api/documents/:id`

Returns document details.

---

### `PUT /api/documents/:id`

Updates document metadata.

Admin only.

---

### `DELETE /api/documents/:id`

Deletes a document.

Admin only.

Deletion must also remove or deactivate associated chunks and embeddings.

---

### `POST /api/documents/:id/reprocess`

Reprocesses a document.

Admin only.

The system must safely:

* Remove outdated chunks where required
* Re-extract text
* Re-chunk
* Regenerate embeddings
* Store updated vectors

---

# Chat and RAG

### `POST /api/chat`

Processes a student question.

Required behavior:

1. Authenticate user
2. Receive conversation information
3. Receive question
4. Generate query embedding
5. Perform vector search
6. Retrieve relevant chunks
7. Apply relevance threshold
8. Handle unknown questions
9. Build RAG context
10. Generate AI answer
11. Save messages
12. Save source references
13. Return answer and sources

The response must include:

* Conversation ID
* User message
* AI answer
* Sources
* Unknown status where applicable

---

### `GET /api/chat/conversations`

Returns the authenticated user's conversations.

---

### `POST /api/chat/conversations`

Creates a new conversation.

---

### `GET /api/chat/conversations/:id`

Returns a conversation and its messages.

Users must only access their own conversations.

---

### `DELETE /api/chat/conversations/:id`

Deletes a user's conversation.

---

# Feedback

### `POST /api/feedback`

Submits answer feedback.

Required data:

* Message ID
* Feedback type
* Optional comment

---

### `PUT /api/feedback/:id`

Updates existing feedback where supported.

---

# Admin Analytics

### `GET /api/admin/dashboard`

Returns admin dashboard metrics.

Admin only.

Possible metrics:

* Total documents
* Processed documents
* Processing documents
* Failed documents
* Total chunks
* Total conversations
* Feedback metrics
* Recent uploads

---

# Suggested Questions

### `GET /api/suggestions`

Returns suggested questions.

The endpoint may support:

* Category filtering
* Department filtering

---

# Error Response Contract

All API errors should follow a consistent structure.

Example:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

Possible error codes include:

```text
UNAUTHORIZED
FORBIDDEN
VALIDATION_ERROR
DOCUMENT_NOT_FOUND
CONVERSATION_NOT_FOUND
FILE_UPLOAD_ERROR
DOCUMENT_PROCESSING_FAILED
EMBEDDING_GENERATION_FAILED
VECTOR_SEARCH_FAILED
AI_GENERATION_FAILED
KNOWLEDGE_NOT_FOUND
INTERNAL_SERVER_ERROR
```

---

# Folder Structure

The repository must follow the required project structure:

```text
EduQuery-AI/
│
├── frontend/
├── backend/
├── README.md
└── .gitignore
```

## Frontend Structure

```text
frontend/
└── src/
    ├── components/
    │   ├── common/
    │   ├── layout/
    │   ├── auth/
    │   ├── chat/
    │   │   ├── ChatWindow.jsx
    │   │   ├── ChatMessage.jsx
    │   │   ├── ChatInput.jsx
    │   │   ├── SourceCard.jsx
    │   │   ├── SourceList.jsx
    │   │   ├── SuggestedQuestions.jsx
    │   │   └── AnswerFeedback.jsx
    │   ├── documents/
    │   │   ├── DocumentUpload.jsx
    │   │   ├── DocumentTable.jsx
    │   │   ├── DocumentCard.jsx
    │   │   └── ProcessingStatus.jsx
    │   ├── dashboard/
    │   └── ProtectedRoute.jsx
    │
    ├── pages/
    │   ├── Landing.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Chat.jsx
    │   ├── History.jsx
    │   ├── Profile.jsx
    │   └── admin/
    │       ├── AdminDashboard.jsx
    │       ├── Documents.jsx
    │       ├── UploadDocument.jsx
    │       └── DocumentDetails.jsx
    │
    ├── context/
    │   └── AuthContext.jsx
    │
    ├── hooks/
    │   ├── useAuth.js
    │   ├── useChat.js
    │   └── useDocuments.js
    │
    ├── services/
    │   ├── api.js
    │   ├── authService.js
    │   ├── chatService.js
    │   ├── documentService.js
    │   └── adminService.js
    │
    ├── utils/
    │
    ├── App.jsx
    └── main.jsx
```

---

# Backend Structure

```text
backend/
└── src/
    ├── config/
    │   ├── env.js
    │   └── supabase.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── documentRoutes.js
    │   ├── chatRoutes.js
    │   ├── feedbackRoutes.js
    │   ├── adminRoutes.js
    │   └── suggestionRoutes.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── documentController.js
    │   ├── chatController.js
    │   ├── feedbackController.js
    │   └── adminController.js
    │
    ├── services/
    │   ├── authService.js
    │   ├── documentService.js
    │   ├── documentProcessingService.js
    │   ├── chunkingService.js
    │   ├── embeddingService.js
    │   ├── vectorSearchService.js
    │   ├── ragService.js
    │   ├── aiService.js
    │   ├── chatService.js
    │   ├── feedbackService.js
    │   └── analyticsService.js
    │
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── roleMiddleware.js
    │   ├── validationMiddleware.js
    │   ├── errorMiddleware.js
    │   └── uploadMiddleware.js
    │
    ├── prompts/
    │   ├── ragSystemPrompt.js
    │   └── documentSummaryPrompt.js
    │
    ├── utils/
    │   ├── chunking.js
    │   ├── response.js
    │   └── errors.js
    │
    ├── validators/
    │   ├── authValidator.js
    │   ├── documentValidator.js
    │   ├── chatValidator.js
    │   └── feedbackValidator.js
    │
    ├── app.js
    └── server.js
```

---

# Development Phases

The project must be built phase by phase.

The AI coding agent must not attempt to build every phase in one generation.

---

## Phase 1: Project Foundation

Build:

* Repository structure
* Frontend setup
* Backend setup
* Environment configuration
* Supabase configuration
* Database schema
* Authentication
* Signup
* Login
* Logout
* Protected routes
* Role-based access
* Base application layout
* Error handling
* Loading states

### Phase 1 Verification

Before proceeding:

* User registration must work
* Login must work
* Logout must work
* Protected routes must work
* Admin authorization must work
* Frontend must communicate with backend
* No secret credentials must appear in frontend code

---

## Phase 2: Admin Knowledge Base Management

Build:

* Admin dashboard
* Document upload
* File validation
* Supabase Storage integration
* Document metadata storage
* Document list
* Search and filters
* Category assignment
* Department assignment
* Update metadata
* Delete documents
* Processing status

### Phase 2 Verification

Before proceeding:

* Admin can upload a PDF
* File is stored successfully
* Metadata is stored successfully
* Non-admin users cannot access admin APIs
* Admin can update document metadata
* Admin can delete a document

---

## Phase 3: Document Processing and Vector Pipeline

Build the real document ingestion pipeline:

* PDF text extraction
* Text cleaning
* Chunking
* Chunk metadata
* Embedding generation
* pgvector storage
* Processing error handling
* Reprocessing functionality

### Phase 3 Verification

Before proceeding:

* A document must produce multiple chunks
* Each chunk must have an embedding
* Embeddings must be stored
* The document status must become `PROCESSED`
* Failed processing must be reported as `FAILED`
* Reprocessing must work

---

## Phase 4: Semantic Search and Core RAG

Build:

* Query embedding
* Vector similarity search
* Top relevant chunk retrieval
* Relevance threshold logic
* Context construction
* LLM answer generation
* Unknown question handling
* Source reference generation

### Phase 4 Verification

Test at least three scenarios:

### Scenario 1: Known Question

A question covered by an uploaded document must:

* Retrieve relevant chunks
* Generate an answer
* Display the correct source

### Scenario 2: Unknown Question

A question not covered by the knowledge base must:

* Fail the relevance threshold
* Avoid hallucination
* Return a clear unknown-information response

### Scenario 3: Semantic Variation

A question phrased differently from the document must still retrieve relevant information where semantic meaning matches.

---

## Phase 5: Student Chat Experience

Build:

* Chat interface
* Conversation creation
* Message persistence
* Chat history
* Conversation reopening
* Conversation context
* Source cards
* Suggested questions
* Answer feedback
* New conversation functionality

### Phase 5 Verification

Before proceeding:

* Chat messages must persist
* Conversation history must load
* Users must only access their own conversations
* Sources must remain associated with AI answers

---

## Phase 6: Advanced Features

Implement selected bonus features.

Priority order:

1. Admin analytics
2. Department-wise knowledge bases
3. Source highlighting
4. Confidence/relevance score
5. Suggested questions
6. Answer feedback
7. Streaming AI responses
8. Multilingual support
9. Document version management
10. Automatic document summarization
11. AI-generated FAQs

Advanced features such as OCR, hybrid search, and reranking must only be implemented if the core system is stable.

---

## Phase 7: Testing and Production Hardening

Test:

* Authentication
* Role authorization
* File upload
* Document processing
* Embedding generation
* Vector search
* RAG answers
* Unknown questions
* Sources
* Chat history
* Feedback
* Error handling
* Mobile responsiveness

Fix:

* Broken API calls
* Loading issues
* Unauthorized access
* Production environment issues
* CORS issues
* Deployment-specific problems

---

## Phase 8: Deployment and Submission

Deploy:

```text
Frontend → Vercel
Backend → Render
Database/Auth/Storage → Supabase
Source Code → GitHub
```

Verify the deployed application end-to-end.

The deployed application must support:

* Authentication
* Document upload
* Document processing
* Semantic search
* AI answers
* Source display
* Chat history

The project must not only work locally.

---

# UI and UX Requirements

EduQuery AI must have a modern, polished AI knowledge platform interface.

The design must not look like:

* A basic college form portal
* A generic admin template
* An unfinished chatbot demo

The design should communicate:

* Intelligence
* Trust
* Knowledge
* Simplicity
* Professionalism

## Global UI Requirements

The application must:

* Be fully responsive
* Have consistent spacing
* Use accessible contrast
* Have clear navigation
* Include loading states
* Include error states
* Include empty states
* Use consistent buttons
* Use consistent form validation
* Avoid unnecessary clutter

---

# Chat UI Requirements

The chat interface must clearly show:

* User question
* AI answer
* Loading state
* Generating state
* Source documents
* Source excerpts
* Feedback controls

The answer area should visually separate:

```text
Answer
```

from:

```text
Sources
```

---

# Admin UI Requirements

The admin interface must provide:

* Clear navigation
* Dashboard metrics
* Document status visibility
* Upload feedback
* Processing indicators
* Error indicators
* Search and filtering

---

# Loading States

The application must show appropriate loading feedback.

Examples:

* Authenticating
* Uploading document
* Processing document
* Generating embeddings
* Searching knowledge base
* Generating answer
* Loading chat history

The UI must not appear frozen during asynchronous operations.

---

# Error Handling

The frontend must clearly display errors.

Examples:

* Invalid login
* Network failure
* File upload failure
* Unsupported file
* Document processing failure
* AI generation failure
* Unknown information
* Unauthorized access

The frontend must not display raw backend stack traces to users.

---

# Security Requirements

The application must follow proper security practices.

## Secrets

The following must never be:

* Hardcoded in source code
* Exposed in the frontend
* Committed to GitHub

Examples:

* AI API keys
* Supabase service role key
* Backend secrets
* Private credentials

All sensitive configuration must use environment variables.

---

# Environment Variables

The exact final variable names may depend on the selected AI provider, but the application may require variables such as:

```text
PORT
NODE_ENV
CLIENT_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
AI_PROVIDER_API_KEY
AI_MODEL
EMBEDDING_MODEL
RAG_SIMILARITY_THRESHOLD
```

The README must list environment variable names without exposing actual values.

---

# Backend Security

The backend must:

* Validate incoming requests
* Verify authentication
* Verify admin permissions
* Use controlled CORS
* Handle errors centrally
* Prevent unauthorized document access
* Prevent users from accessing another user's conversations
* Limit sensitive data exposure
* Validate uploaded files

---

# Supabase Security

The application must configure appropriate access controls.

The implementation must consider:

* Authenticated user access
* Admin-only document management
* User-owned conversation access
* User-owned feedback
* Storage security

Service-level credentials must remain backend-only.

---

# Input Validation

The application must validate:

* Name
* Email
* Password
* Chat question
* Feedback
* Document metadata
* File type
* File size where configured

The backend must not trust frontend validation alone.

---

# RAG Safety Requirements

The AI must not:

* Invent college policies
* Invent dates
* Invent fees
* Invent admissions rules
* Pretend retrieved information exists when it does not

If relevant information cannot be found, the application must use the unknown-answer workflow.

---

# Final Expected Outcome

The completed EduQuery AI platform must allow:

## Administrators

To:

1. Log in
2. Access an admin dashboard
3. Upload official college documents
4. Store those documents securely
5. Process documents
6. Extract text
7. Split text into chunks
8. Generate embeddings
9. Store vectors
10. Manage the knowledge base

## Students

To:

1. Register or log in
2. Access the EduQuery AI chat interface
3. Ask college-related questions
4. Trigger semantic retrieval
5. Retrieve relevant document chunks
6. Generate an answer using retrieved context
7. View source documents
8. Continue conversations
9. Access previous conversations
10. Receive a clear response when knowledge is unavailable

The final application must demonstrate a real RAG system.

It must be possible to explain the complete flow:

```text
Document
   ↓
Text Extraction
   ↓
Chunking
   ↓
Embedding
   ↓
Vector Storage
   ↓
Student Question
   ↓
Query Embedding
   ↓
Similarity Search
   ↓
Relevant Context
   ↓
LLM
   ↓
Answer + Sources
```

The final product must feel like a professional AI knowledge platform rather than a simple LLM wrapper.

---

# AI Coding Agent Implementation Instructions

The AI coding agent must:

1. Read this complete specification before generating implementation code.
2. Follow the project architecture strictly.
3. Build the application phase by phase.
4. Never attempt to implement all phases blindly in one generation.
5. Verify the previous phase before starting the next phase.
6. Follow the specified frontend and backend folder structures unless a justified change is required.
7. Keep controllers thin.
8. Keep business logic inside services.
9. Keep AI provider calls centralized.
10. Keep RAG logic centralized.
11. Never place AI API keys in frontend code.
12. Never expose Supabase service role credentials to the browser.
13. Never bypass semantic retrieval for normal knowledge questions.
14. Never treat direct LLM responses as RAG.
15. Never fabricate answers when relevant context is unavailable.
16. Always apply relevance threshold handling.
17. Preserve source metadata for generated answers.
18. Enforce admin authorization on backend endpoints.
19. Enforce user ownership for conversations.
20. Use environment variables for all secrets.
21. Implement loading and error states.
22. Avoid unnecessary libraries.
23. Avoid changing the technology stack without explicit approval.
24. Report files created or modified after completing each phase.
25. Report tests performed after completing each phase.
26. Report known limitations or unresolved issues honestly.
27. Do not claim a feature works unless it has been implemented and tested.

---

# Requirement-by-Requirement Compliance Matrix

## Must-Have Requirements

| Requirement                       | EduQuery AI Implementation                 |
| --------------------------------- | ------------------------------------------ |
| Chat Interface                    | Student chat interface                     |
| User Authentication               | Supabase Auth with protected routes        |
| Document Upload                   | Admin document upload                      |
| Document Processing               | PDF extraction, cleaning, and processing   |
| Text Chunking                     | Documents split into searchable chunks     |
| Embedding Generation              | Embedding generated for every chunk        |
| Vector Database / Semantic Search | pgvector-based semantic similarity search  |
| RAG Pipeline                      | Retrieved context passed to LLM            |
| AI-Generated Answers              | Grounded answers from retrieved context    |
| Source/Reference Display          | Source cards and excerpts                  |
| Unknown Question Handling         | Relevance threshold and no-answer fallback |
| Chat History                      | Persistent conversations and messages      |
| Conversation Context              | Recent relevant conversation context       |
| Admin Document Management         | Upload, update, delete, reprocess          |
| Database/Storage Integration      | Supabase PostgreSQL and Storage            |
| Frontend–Backend Integration      | React → Express REST API                   |
| Working Deployment                | Vercel + Render + Supabase                 |

---

# Bonus Feature Compliance

| Bonus Feature                    | Planned Status                               |
| -------------------------------- | -------------------------------------------- |
| Multiple document collections    | Supported through categories and departments |
| Department-wise knowledge bases  | Planned                                      |
| Admin dashboard                  | Planned                                      |
| Document version management      | Planned after core                           |
| Source highlighting              | Planned                                      |
| Confidence/relevance score       | Planned                                      |
| Multilingual chatbot             | Planned after core                           |
| Voice input and responses        | Optional                                     |
| Conversation export              | Optional                                     |
| Suggested questions              | Planned                                      |
| Answer feedback                  | Planned                                      |
| Admin analytics                  | Planned                                      |
| Automatic document summarization | Optional advanced feature                    |
| OCR                              | Advanced optional feature                    |
| Hybrid keyword + semantic search | Advanced optional feature                    |
| Document re-ranking              | Advanced optional feature                    |
| Role-based access                | Required and planned                         |
| AI-generated FAQs                | Optional advanced feature                    |
| Streaming AI responses           | Planned after stable core                    |

---

# Where Each Specification Parameter Shows Up

## Clarity

The project overview explicitly defines:

* Product purpose
* Users
* RAG workflow
* Required behavior

## Completeness

This specification covers:

* Frontend
* Backend
* Authentication
* Database
* File storage
* Document processing
* Embeddings
* Vector search
* RAG
* AI
* APIs
* Pages
* Security
* Testing
* Deployment

## Consistency

The specification uses consistent terminology for:

* Documents
* Document chunks
* Conversations
* Messages
* Sources
* RAG service
* Vector search

## Concrete Technology Choices

The stack explicitly defines:

* React
* Vite
* Node.js
* Express
* Supabase
* PostgreSQL
* pgvector
* Vercel
* Render

## Structured Sections

The document separates:

* Product requirements
* Architecture
* Frontend
* Backend
* Database
* APIs
* Security
* Development phases

## Phased Delivery

The project is divided into eight phases.

Each phase must be tested before proceeding.

## Authoritative Tone

Mandatory requirements use:

* Must
* Required
* Must not
* Only after
* Before proceeding

---

# Setting Up an AI Coding Agent

EduQuery AI is being developed using Google Antigravity with Supabase connected through MCP configuration.

The AI coding agent must have access to the project workspace and should be instructed to read:

```text
spec.md
```

before implementation.

The developer should:

1. Open the EduQuery AI project workspace.
2. Ensure `spec.md` exists in the project root.
3. Ensure Supabase MCP integration is connected.
4. Ask the coding agent to read and summarize the specification.
5. Verify that the agent understands:

   * Frontend architecture
   * Backend architecture
   * Supabase usage
   * RAG pipeline
   * Development phases
6. Only then begin Phase 1.

The AI coding agent must be prompted to build one phase at a time.

---

# How to Properly Write Specs for AI Coding Agents

## Define the Target User

The primary users must be explicitly defined.

For EduQuery AI:

* Primary user: Student
* Administrative user: College administrator

## Lock the Technology Stack

The specification defines:

* React with Vite
* Express
* Supabase
* PostgreSQL
* pgvector
* Vercel
* Render

The coding agent must not replace these technologies without approval.

## Define Explicit Contracts

The specification defines:

* API endpoints
* Database tables
* User roles
* Processing statuses
* Error codes
* RAG stages

## Define Failure Behavior

The specification defines behavior for:

* Unknown questions
* Failed document processing
* Failed embeddings
* Unauthorized users
* Unsupported files
* Missing conversations

---

# How to Build the Project Using the Specification

## Step-by-Step Execution

Build one phase at a time.

Do not say:

> Build the entire EduQuery AI application.

Instead:

```text
Read spec.md.

Implement only Phase 1: Project Foundation.

Do not begin Phase 2.

Follow the specified folder structure and architecture.

After implementation:
1. Test all Phase 1 functionality.
2. Fix any issues found.
3. Report all files created or modified.
4. Report all tests performed.
5. Report any remaining issues.
```

The same process must be repeated for every phase.

---

# Verify Before Moving On

Examples:

Before Phase 2:

* Authentication must work.

Before Phase 3:

* Admin document management must work.

Before Phase 4:

* Documents must successfully generate chunks and embeddings.

Before Phase 5:

* Vector search and RAG answers must work.

Before deployment:

* All core requirements must work locally.

---

# Enforce File Auditing

At the end of every development phase, the AI coding agent must report:

```text
Files Created
Files Modified
Dependencies Added
Database Changes
Environment Variables Required
API Endpoints Added
Tests Performed
Known Issues
Next Recommended Step
```

---

# Why a Single Spec Is Not Enough

This specification is the master specification for EduQuery AI.

As the project grows, complex subsystems may require additional dedicated specifications.

Examples include:

* `rag-pipeline-spec.md`
* `database-schema-spec.md`
* `api-contracts.md`
* `deployment-spec.md`
* `testing-spec.md`

These sub-specifications must not contradict this master `spec.md`.

The master specification remains the primary source of truth.

---

# Testing Requirements

The final project must be tested for:

## Authentication

* Signup
* Login
* Logout
* Protected routes
* Student permissions
* Admin permissions

## Document Management

* Valid PDF upload
* Invalid file rejection
* Document metadata update
* Document deletion
* Document reprocessing

## RAG Pipeline

* Text extraction
* Chunk creation
* Embedding generation
* Vector storage
* Semantic retrieval
* Relevant context selection
* LLM answer generation
* Source generation

## Unknown Questions

Questions without relevant knowledge must not generate fabricated answers.

## Chat

* New conversations
* Existing conversations
* Message persistence
* Source persistence
* Conversation access control

## Deployment

The deployed application must be tested separately.

Local success does not prove deployment success.

---

# Deployment Requirements

The final project must be deployed and publicly accessible.

## Frontend

Deploy on:

**Vercel**

The deployed frontend must communicate with the deployed backend.

## Backend

Deploy on:

**Render**

The deployed backend must have all required environment variables configured.

## Database and Storage

Use:

**Supabase**

Verify:

* Authentication
* PostgreSQL
* Storage
* pgvector
* Row-level security where applicable

## Source Code

Maintain the project in:

**GitHub**

The required repository structure is:

```text
project/
├── frontend/
├── backend/
├── README.md
└── .gitignore
```

The repository must not contain:

* `.env`
* API keys
* Service role keys
* Private credentials
* Secrets

---

# README Requirements

The final `README.md` must include:

## 1. Project Name

EduQuery AI

## 2. Tagline

Your Intelligent College Knowledge Assistant

## 3. Problem Statement

Explain the problem solved by the project.

## 4. Features

List:

* Core features
* RAG features
* Bonus features

## 5. Technology Stack

List:

* Frontend
* Backend
* Database
* Authentication
* Storage
* AI services
* Vector database
* Deployment platforms

## 6. Architecture

Explain:

```text
Documents → Processing → Embeddings → Vector Search → RAG → AI Answer
```

## 7. Screenshots

Include screenshots of:

* Landing page
* Login
* Chat interface
* Answer with sources
* Admin dashboard
* Document management
* Document upload

## 8. Live Demo

Provide the deployed Vercel URL.

## 9. Backend

Provide the deployed Render API URL.

## 10. Setup Instructions

Explain:

* Installation
* Dependency setup
* Environment variables
* Database setup
* Local development

## 11. Environment Variables

List names only.

Never expose actual values.

---

# Final Submission Checklist

Before submission, verify:

* [ ] The project idea is approved.
* [ ] EduQuery AI has been built independently.
* [ ] The application contains meaningful functionality.
* [ ] User authentication works.
* [ ] Role-based access works.
* [ ] Students can ask questions.
* [ ] Admins can upload documents.
* [ ] Documents are actually processed.
* [ ] Text is extracted.
* [ ] Text is chunked.
* [ ] Embeddings are generated.
* [ ] Embeddings are stored in a vector database.
* [ ] Semantic search works.
* [ ] Relevant context is retrieved.
* [ ] Retrieved context is passed to the LLM.
* [ ] Answers are grounded in the knowledge base.
* [ ] Sources are displayed.
* [ ] Unknown questions are handled.
* [ ] Chat history works.
* [ ] Admin document management works.
* [ ] Database and storage are connected.
* [ ] Frontend and backend integration works.
* [ ] The frontend is deployed.
* [ ] The backend is deployed.
* [ ] The live database is connected.
* [ ] GitHub repository is complete.
* [ ] README is complete.
* [ ] No `.env` file is committed.
* [ ] No secrets are exposed.
* [ ] The live application has been tested.
* [ ] The complete architecture can be explained.

---

# Final Expected Outcome

The final EduQuery AI application must be a complete, deployed, AI-powered college knowledge assistant.

It must allow an administrator to upload and manage college knowledge documents.

Those documents must be:

1. Stored
2. Processed
3. Extracted
4. Chunked
5. Embedded
6. Indexed in vector storage

Students must then be able to ask questions.

Every supported question must follow:

```text
Question
   ↓
Embedding
   ↓
Vector Search
   ↓
Relevant Context
   ↓
LLM
   ↓
Grounded Answer
   ↓
Sources
```

If relevant information is unavailable:

```text
Question
   ↓
Vector Search
   ↓
Insufficient Context
   ↓
Unknown Question Response
```

The final application must satisfy the required project completion standards:

* Meaningful functionality
* Working frontend
* Working backend
* Working database
* Working storage
* Working authentication
* Working CRUD operations
* Real RAG implementation
* Semantic vector search
* Source references
* Proper security practices
* Complete GitHub repository
* Complete README
* Public deployment

The final product should be polished enough to demonstrate as a serious full-stack AI application.

---

# Closing Thought

Spec Driven Development shifts the difficult part of software development away from blindly generating code and toward clearly defining what must be built.

For EduQuery AI, that matters because this is not just a chatbot project.

It is a connected system involving:

* Full-stack development
* Authentication
* Role-based access
* File management
* Document processing
* Embeddings
* Vector databases
* Semantic search
* Retrieval-Augmented Generation
* AI answer generation
* Conversation persistence
* Source transparency
* Deployment

A vague implementation may produce a visually attractive chatbot that fails the actual project requirements.

A strict specification ensures that the application is built around the required architecture:

**College Knowledge → Processing → Embeddings → Vector Search → Retrieved Context → AI Answer → Source Transparency**

The objective is not to generate a project quickly and hope that it works.

The objective is to build EduQuery AI systematically, verify every requirement, understand the architecture, test the live application, and produce a project that can be demonstrated and explained confidently.
