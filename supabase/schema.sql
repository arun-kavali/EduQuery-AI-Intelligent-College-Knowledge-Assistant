-- ====================================================================
-- EduQuery AI — Database Schema Specification (Supabase PostgreSQL + pgvector)
-- ====================================================================

-- 1. Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Profiles Table (Linked to auth.users.id)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Documents Table (Admin-uploaded college knowledge base documents)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  original_file_name TEXT,
  file_name TEXT,
  file_path TEXT,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  category TEXT DEFAULT 'General',
  department TEXT DEFAULT 'General',
  processing_status TEXT DEFAULT 'uploaded' CHECK (processing_status IN ('uploaded', 'processing', 'processed', 'indexed', 'failed')),
  processing_error TEXT,
  chunk_count INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Document Chunks Table (768-d Gemini Embeddings)
CREATE TABLE IF NOT EXISTS public.document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Conversations Table (User-isolated chat sessions)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  department TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Messages Table (Chat turn history)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]'::jsonb,
  is_unknown BOOLEAN DEFAULT FALSE,
  feedback TEXT CHECK (feedback IN ('positive', 'negative', 'helpful', 'not_helpful')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Message Sources Table
CREATE TABLE IF NOT EXISTS public.message_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  chunk_id UUID REFERENCES public.document_chunks(id) ON DELETE CASCADE,
  source_title TEXT,
  source_excerpt TEXT,
  relevance_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Answer Feedback Table
CREATE TABLE IF NOT EXISTS public.answer_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('helpful', 'not_helpful', 'positive', 'negative')),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- Indexes & Performance Optimizations
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_department ON public.documents(department);
CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON public.document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);

-- ====================================================================
-- Vector Search RPC Function (Cosine Similarity match_chunks)
-- ====================================================================
CREATE OR REPLACE FUNCTION match_chunks (
  query_embedding vector(768),
  match_threshold float DEFAULT 0.25,
  match_count int DEFAULT 5,
  filter_category text DEFAULT NULL,
  filter_department text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  chunk_index int,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.chunk_index,
    dc.content,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM public.document_chunks dc
  JOIN public.documents d ON dc.document_id = d.id
  WHERE (1 - (dc.embedding <=> query_embedding)) > match_threshold
    AND (filter_category IS NULL OR filter_category = 'All' OR d.category = filter_category)
    AND (filter_department IS NULL OR filter_department = 'General' OR d.department = filter_department)
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
