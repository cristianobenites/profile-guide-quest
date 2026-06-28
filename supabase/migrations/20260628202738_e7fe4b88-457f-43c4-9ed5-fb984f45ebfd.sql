CREATE TABLE public.slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  index integer NOT NULL,
  title_guess text,
  preview_image_url text,
  extracted_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.slides TO authenticated;
GRANT ALL ON public.slides TO service_role;
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage slides of own projects" ON public.slides FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()));

CREATE TABLE public.extracted_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  slide_id uuid REFERENCES public.slides(id) ON DELETE CASCADE,
  type text NOT NULL,
  role text NOT NULL DEFAULT 'NORMAL',
  label text,
  storage_url text,
  x numeric,
  y numeric,
  w numeric,
  h numeric,
  meta jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.extracted_assets TO authenticated;
GRANT ALL ON public.extracted_assets TO service_role;
ALTER TABLE public.extracted_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage assets of own projects" ON public.extracted_assets FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()));

CREATE TABLE public.takeaways (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  slide_id uuid REFERENCES public.slides(id) ON DELETE CASCADE,
  text text NOT NULL,
  score integer NOT NULL DEFAULT 3,
  evidence_status text NOT NULL DEFAULT 'OK',
  flags jsonb NOT NULL DEFAULT '{}',
  meta jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.takeaways TO authenticated;
GRANT ALL ON public.takeaways TO service_role;
ALTER TABLE public.takeaways ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage takeaways of own projects" ON public.takeaways FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()));

CREATE TABLE public.pipeline_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'PROCESSING',
  current_step text NOT NULL DEFAULT 'INGESTION',
  progress numeric NOT NULL DEFAULT 0,
  error text,
  step_history jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pipeline_runs TO authenticated;
GRANT ALL ON public.pipeline_runs TO service_role;
ALTER TABLE public.pipeline_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage pipeline runs of own projects" ON public.pipeline_runs FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()));

CREATE TABLE public.project_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  label text NOT NULL,
  summary text,
  snapshot jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_versions TO authenticated;
GRANT ALL ON public.project_versions TO service_role;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage versions of own projects" ON public.project_versions FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()));

CREATE TRIGGER update_takeaways_updated_at BEFORE UPDATE ON public.takeaways FOR EACH ROW EXECUTE FUNCTION private.update_updated_at_column();
CREATE TRIGGER update_pipeline_runs_updated_at BEFORE UPDATE ON public.pipeline_runs FOR EACH ROW EXECUTE FUNCTION private.update_updated_at_column();