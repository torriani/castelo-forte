-- Migration 005: Tabela carrossel_projects
-- Persiste projetos de carrossel por usuario

CREATE TABLE IF NOT EXISTS carrossel_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Sem nome',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'exported')),
  default_template_slug TEXT NOT NULL DEFAULT 'twitter-branco',
  slides JSONB NOT NULL DEFAULT '[]'::jsonb,
  brand JSONB DEFAULT NULL,
  thumbnail_url TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indice para listagem por usuario
CREATE INDEX IF NOT EXISTS idx_carrossel_projects_user_id ON carrossel_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_carrossel_projects_updated_at ON carrossel_projects(updated_at DESC);

-- RLS: usuario so ve seus projetos
ALTER TABLE carrossel_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON carrossel_projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON carrossel_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON carrossel_projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON carrossel_projects FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para updated_at automatico
CREATE OR REPLACE FUNCTION update_carrossel_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_carrossel_projects_updated_at
  BEFORE UPDATE ON carrossel_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_carrossel_projects_updated_at();
