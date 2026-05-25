import { supabase } from './supabase';
import { CarouselTemplate } from '../types';

let cachedTemplates: CarouselTemplate[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export async function fetchTemplatesFromDb(): Promise<CarouselTemplate[]> {
  const now = Date.now();

  if (cachedTemplates && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedTemplates;
  }

  // Usar REST direto para nao depender do estado de sessao do Supabase client
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const res = await fetch(
    `${supabaseUrl}/rest/v1/carrossel_templates?ativo=eq.true&order=ordem`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Erro ao buscar templates: ${res.status}`);
  }

  const data = await res.json();
  cachedTemplates = (data || []) as CarouselTemplate[];
  cacheTimestamp = now;

  return cachedTemplates;
}

// Buscar TODOS os templates (incluindo inativos) para admin
export async function fetchAllTemplatesAdmin(): Promise<CarouselTemplate[]> {
  const { data, error } = await supabase
    .from('carrossel_templates')
    .select('*')
    .order('ordem');

  if (error) throw error;
  return (data || []) as CarouselTemplate[];
}

// Verificar se slug ja existe
export async function checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  let query = supabase
    .from('carrossel_templates')
    .select('id')
    .eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).length > 0;
}

// Criar template
export async function createTemplate(
  template: Omit<CarouselTemplate, 'id'> & { ativo?: boolean }
): Promise<CarouselTemplate> {
  const { data, error } = await supabase
    .from('carrossel_templates')
    .insert({ ...template, ativo: template.ativo ?? true })
    .select()
    .single();

  if (error) throw error;
  invalidateTemplateCache();
  return data as CarouselTemplate;
}

// Atualizar template
export async function updateTemplate(
  id: string,
  updates: Partial<CarouselTemplate>
): Promise<CarouselTemplate> {
  const { data, error } = await supabase
    .from('carrossel_templates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  invalidateTemplateCache();
  return data as CarouselTemplate;
}

// Deletar template (soft delete - marca como inativo)
export async function deleteTemplate(id: string): Promise<void> {
  const { error } = await supabase
    .from('carrossel_templates')
    .update({ ativo: false })
    .eq('id', id);

  if (error) throw error;
  invalidateTemplateCache();
}

// Deletar template permanentemente
export async function hardDeleteTemplate(id: string): Promise<void> {
  const { error } = await supabase
    .from('carrossel_templates')
    .delete()
    .eq('id', id);

  if (error) throw error;
  invalidateTemplateCache();
}

export function getTemplateBySlug(
  templates: CarouselTemplate[],
  slug: string
): CarouselTemplate | undefined {
  return templates.find(t => t.slug === slug);
}

export function getTemplatesByFamilia(
  templates: CarouselTemplate[],
  familia: 'twitter' | 'editorial'
): CarouselTemplate[] {
  return templates.filter(t => t.familia === familia);
}

export function invalidateTemplateCache(): void {
  cachedTemplates = null;
  cacheTimestamp = 0;
}
