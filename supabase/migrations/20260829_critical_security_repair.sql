-- EduQuery AI: production upgrade for an existing deployment only.
-- It intentionally does not create or drop application tables or data.
BEGIN;

DO $$
BEGIN
  IF to_regclass('public.documents') IS NULL OR to_regclass('public.profiles') IS NULL
     OR to_regclass('public.conversations') IS NULL OR to_regclass('public.messages') IS NULL
     OR to_regclass('public.document_chunks') IS NULL OR to_regclass('public.message_sources') IS NULL
     OR to_regclass('public.answer_feedback') IS NULL THEN
    RAISE EXCEPTION 'Expected existing EduQuery tables are missing; aborting without changes.';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'status')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'processing_status') THEN
    ALTER TABLE public.documents RENAME COLUMN status TO processing_status;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'error_message')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'processing_error') THEN
    ALTER TABLE public.documents RENAME COLUMN error_message TO processing_error;
  END IF;
END $$;

ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS processing_status text DEFAULT 'uploaded';
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS processing_error text;

-- Backfill only missing profiles. Existing rows, including every admin role, are untouched.
INSERT INTO public.profiles (id, email, full_name, role)
SELECT u.id, u.email, COALESCE(u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1)), 'student'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL AND u.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)), 'student')
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

-- Remove policies only on the secured application tables, then install the
-- canonical least-privilege set. Service-role requests continue to bypass RLS.
DO $$
DECLARE policy_record record;
BEGIN
  FOR policy_record IN
    SELECT schemaname, tablename, policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename IN
      ('profiles', 'conversations', 'messages', 'message_sources', 'answer_feedback', 'documents', 'document_chunks')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', policy_record.policyname, policy_record.schemaname, policy_record.tablename);
  END LOOP;
END $$;

CREATE POLICY profiles_select_own ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY conversations_select_own ON public.conversations FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY messages_select_own ON public.messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND c.user_id = auth.uid()));
CREATE POLICY message_sources_select_own ON public.message_sources FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.messages m JOIN public.conversations c ON c.id = m.conversation_id WHERE m.id = message_sources.message_id AND c.user_id = auth.uid()));

COMMIT;
