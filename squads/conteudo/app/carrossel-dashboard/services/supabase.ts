import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos do banco
export interface DbTemplate {
  id: string;
  slug: string;
  nome: string;
  familia: 'twitter' | 'editorial';
  descricao: string | null;
  background: string;
  proporcao: string;
  dark_mode: boolean;
  zona_header: any;
  zona_header_bar: any;
  zona_titulo: any;
  zona_subtitulo: any;
  zona_body: any;
  zona_imagem: any;
  zona_footer_bar: any;
  ordem: number;
  ativo: boolean;
}

export interface DbBrand {
  id: string;
  nome: string;
  handle: string;
  avatar_url: string | null;
  verificado: boolean;
  marca_nome: string | null;
  marca_icone_url: string | null;
  tagline: string | null;
  categoria: string | null;
  cor_primaria: string;
  cor_secundaria: string;
  cor_accent: string;
}

export async function fetchTemplates(): Promise<DbTemplate[]> {
  const { data, error } = await supabase
    .from('carrossel_templates')
    .select('*')
    .eq('ativo', true)
    .order('ordem');

  if (error) throw error;
  return data || [];
}

export async function fetchBrands(): Promise<DbBrand[]> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const res = await fetch(`${url}/rest/v1/carrossel_brands?ativo=eq.true`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Erro brands: ${res.status}`);
  return await res.json();
}

// Criar novo brand vinculado ao usuario
export async function createBrand(brand: Omit<DbBrand, 'id'> & { user_id: string }): Promise<DbBrand> {
  const { data, error } = await supabase
    .from('carrossel_brands')
    .insert(brand)
    .select()
    .single();

  if (error) throw error;
  return data as DbBrand;
}

// Atualizar brand existente
export async function updateBrand(id: string, updates: Partial<DbBrand>): Promise<DbBrand> {
  const { data, error } = await supabase
    .from('carrossel_brands')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DbBrand;
}

// Deletar brand
export async function deleteBrand(id: string): Promise<void> {
  const { error } = await supabase
    .from('carrossel_brands')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ Projetos ============

export interface DbProject {
  id: string;
  user_id: string;
  name: string;
  status: 'draft' | 'exported';
  default_template_slug: string;
  slides: any; // JSONB — SlideData[]
  brand: any; // JSONB — BrandProfile | null
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchProjects(): Promise<DbProject[]> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const res = await fetch(`${url}/rest/v1/carrossel_projects?order=updated_at.desc`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Erro projects: ${res.status}`);
  return await res.json();
}

export async function fetchProjectById(id: string): Promise<DbProject | null> {
  const { data, error } = await supabase
    .from('carrossel_projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }
  return data as DbProject;
}

export async function createProject(project: {
  user_id: string;
  name: string;
  default_template_slug: string;
  slides: any;
  brand: any;
}): Promise<DbProject> {
  const { data, error } = await supabase
    .from('carrossel_projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data as DbProject;
}

export async function updateProject(
  id: string,
  updates: Partial<Pick<DbProject, 'name' | 'status' | 'default_template_slug' | 'slides' | 'brand' | 'thumbnail_url'>>
): Promise<DbProject> {
  const { data, error } = await supabase
    .from('carrossel_projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DbProject;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('carrossel_projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ Exports ============

export interface DbExport {
  id: string;
  project_id: string;
  user_id: string;
  slides_count: number;
  zip_size_bytes: number;
  created_at: string;
}

export async function createExportRecord(record: {
  project_id: string;
  user_id: string;
  slides_count: number;
  zip_size_bytes: number;
}): Promise<DbExport> {
  const { data, error } = await supabase
    .from('carrossel_exports')
    .insert(record)
    .select()
    .single();

  if (error) throw error;
  return data as DbExport;
}

export async function fetchExportsByProject(projectId: string): Promise<DbExport[]> {
  const { data, error } = await supabase
    .from('carrossel_exports')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchExportCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('carrossel_exports')
    .select('project_id');

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data || []) {
    counts[row.project_id] = (counts[row.project_id] || 0) + 1;
  }
  return counts;
}
