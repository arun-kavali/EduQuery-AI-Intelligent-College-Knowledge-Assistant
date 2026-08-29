-- =========================================================
-- EduQuery AI - Supabase Production Database Schema
-- Includes Vector Search (pgvector), RLS Policies & Triggers
-- =========================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INT NOT NULL,
  category TEXT DEFAULT 'General' CHECK (category IN ('Admissions', 'Academics', 'Departments', 'Courses', 'Fees', 'Examinations', 'Hostel', 'Library', 'Clubs', 'Placements', 'Scholarships', 'Policies', 'Events', 'Notices', 'General')),
  department TEXT DEFAULT 'General',
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  chunk_count INT DEFAULT 0,
  status TEXT DEFAULT 'processed' CHECK (status IN ('processing', 'processed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Document Chunks Table (Vector Storage)
CREATE TABLE IF NOT EXISTS public.document_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(768), -- Fixed dimension to 768 for text-embedding-004
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW Cosine Similarity Index
CREATE INDEX IF NOT EXISTS document_chunks_embedding_hnsw_idx 
ON public.document_chunks 
USING hnsw (embedding vector_cosine_ops);

-- 4. Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  department TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]'::jsonb,
  is_unknown BOOLEAN DEFAULT FALSE,
  feedback TEXT CHECK (feedback IN ('positive', 'negative', NULL)),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RPC Function for Cosine Similarity Vector Search
CREATE OR REPLACE FUNCTION match_chunks (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
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
    (1 - (dc.embedding <=> query_embedding))::float AS similarity
  FROM public.document_chunks dc
  JOIN public.documents d ON d.id = dc.document_id
  WHERE (1 - (dc.embedding <=> query_embedding)) > match_threshold
    AND (filter_category IS NULL OR filter_category = 'All' OR d.category = filter_category)
    AND (filter_department IS NULL OR filter_department = 'General' OR d.department = filter_department OR d.department = 'General')
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR PROFILES
CREATE POLICY "Public profiles are readable by authenticated users" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated' OR true);

CREATE POLICY "Allow profile insertion" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS POLICIES FOR DOCUMENTS & CHUNKS
CREATE POLICY "Documents readable by all authenticated users" ON public.documents
  FOR SELECT USING (true);

CREATE POLICY "Allow document insert" ON public.documents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow document delete" ON public.documents
  FOR DELETE USING (true);

CREATE POLICY "Chunks readable by all authenticated users" ON public.document_chunks
  FOR SELECT USING (true);

CREATE POLICY "Allow chunk insert" ON public.document_chunks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow chunk delete" ON public.document_chunks
  FOR DELETE USING (true);

-- RLS POLICIES FOR CONVERSATIONS & MESSAGES
CREATE POLICY "Users can manage their own conversations" ON public.conversations
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'service_role');

CREATE POLICY "Users can access messages of their conversations" ON public.messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE id = messages.conversation_id 
      AND (user_id = auth.uid() OR user_id IS NULL)
    )
    OR auth.role() = 'service_role'
  );

-- Automatically create profile on signup via Postgres Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
