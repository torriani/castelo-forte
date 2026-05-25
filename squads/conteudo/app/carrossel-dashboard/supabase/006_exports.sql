-- Migration 006: Tabela carrossel_exports
-- Registra metadata de cada export ZIP (sem armazenar o arquivo)

CREATE TABLE IF NOT EXISTS carrossel_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES carrossel_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slides_count INTEGER NOT NULL DEFAULT 0,
  zip_size_bytes BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices para consulta por projeto e por usuario
CREATE INDEX IF NOT EXISTS idx_carrossel_exports_project_id ON carrossel_exports(project_id);
CREATE INDEX IF NOT EXISTS idx_carrossel_exports_user_id ON carrossel_exports(user_id);
CREATE INDEX IF NOT EXISTS idx_carrossel_exports_created_at ON carrossel_exports(created_at DESC);

-- RLS: usuario so ve seus exports
ALTER TABLE carrossel_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exports"
  ON carrossel_exports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exports"
  ON carrossel_exports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own exports"
  ON carrossel_exports FOR DELETE
  USING (auth.uid() = user_id);
