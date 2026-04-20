-- Create prompts table
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create prompt_versions table
CREATE TABLE IF NOT EXISTS public.prompt_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  version_num INTEGER NOT NULL,
  content TEXT NOT NULL,
  commit_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  analysis_score INTEGER CHECK (analysis_score IS NULL OR analysis_score BETWEEN 0 AND 100),
  analysis_metrics JSONB,
  tags TEXT[] DEFAULT '{}'
);

-- Create test_cases table
CREATE TABLE IF NOT EXISTS public.test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  expected_output TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_version_id UUID NOT NULL REFERENCES public.prompt_versions(id) ON DELETE CASCADE,
  test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
  actual_output TEXT NOT NULL,
  score INTEGER CHECK (score IS NULL OR score BETWEEN 1 AND 5),
  judgement_reason TEXT,
  model TEXT NOT NULL DEFAULT 'openai/gpt-4o-mini',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Performance Indices
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_versions_prompt_id ON public.prompt_versions(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON public.prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_updated_at ON public.prompts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_versions_created_at ON public.prompt_versions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_cases_prompt_id ON public.test_cases(prompt_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_prompt_version_id ON public.evaluations(prompt_version_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_test_case_id ON public.evaluations(test_case_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON public.evaluations(created_at DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'prompt_versions_prompt_id_version_num_key'
  ) THEN
    ALTER TABLE public.prompt_versions
      ADD CONSTRAINT prompt_versions_prompt_id_version_num_key UNIQUE (prompt_id, version_num);
  END IF;
END $$;

-- ============================================================================
-- Row Level Security (RLS) Policies (Defense in Depth)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- 1. Prompts Policies
-- Users can only view, insert, update, and delete their own prompts
CREATE POLICY "Users can manage their own prompts" 
  ON public.prompts 
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- 2. Prompt Versions Policies
-- Users can only manage versions of prompts they own
CREATE POLICY "Users can manage versions of their own prompts" 
  ON public.prompt_versions 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.prompts 
      WHERE id = prompt_versions.prompt_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.prompts 
      WHERE id = prompt_versions.prompt_id AND user_id = auth.uid()
    )
  );

-- 3. Test Cases Policies
-- Users can only manage test cases of prompts they own
CREATE POLICY "Users can manage test cases of their own prompts" 
  ON public.test_cases 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.prompts 
      WHERE id = test_cases.prompt_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.prompts 
      WHERE id = test_cases.prompt_id AND user_id = auth.uid()
    )
  );

-- 4. Evaluations Policies
-- Users can only manage evaluations of prompt versions they own
CREATE POLICY "Users can manage evaluations of their own prompt versions" 
  ON public.evaluations 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.prompt_versions pv
      JOIN public.prompts p ON p.id = pv.prompt_id
      WHERE pv.id = evaluations.prompt_version_id AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.prompt_versions pv
      JOIN public.prompts p ON p.id = pv.prompt_id
      WHERE pv.id = evaluations.prompt_version_id AND p.user_id = auth.uid()
    )
  );
