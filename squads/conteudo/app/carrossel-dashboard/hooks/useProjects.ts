import { useState, useEffect, useCallback } from 'react';
import {
  DbProject,
  fetchProjects,
  fetchProjectById,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
} from '../services/supabase';
import { useAuth } from './useAuth';

export interface UseProjectsReturn {
  projects: DbProject[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createProject: (name: string, defaultTemplateSlug: string, slides: any, brand: any) => Promise<DbProject>;
  updateProject: (id: string, updates: Partial<Pick<DbProject, 'name' | 'status' | 'default_template_slug' | 'slides' | 'brand' | 'thumbnail_url'>>) => Promise<DbProject>;
  deleteProject: (id: string) => Promise<void>;
  loadProject: (id: string) => Promise<DbProject | null>;
}

export function useProjects(): UseProjectsReturn {
  const { user } = useAuth();
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProjects();
      setProjects(data);
    } catch (err: any) {
      console.error('Erro ao carregar projetos:', err);
      setError(err.message || 'Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refresh();
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [user, refresh]);

  const createProject = useCallback(async (
    name: string,
    defaultTemplateSlug: string,
    slides: any,
    brand: any,
  ): Promise<DbProject> => {
    if (!user) throw new Error('Usuario nao autenticado');
    const project = await apiCreateProject({
      user_id: user.id,
      name,
      default_template_slug: defaultTemplateSlug,
      slides,
      brand,
    });
    setProjects(prev => [project, ...prev]);
    return project;
  }, [user]);

  const updateProject = useCallback(async (
    id: string,
    updates: Partial<Pick<DbProject, 'name' | 'status' | 'default_template_slug' | 'slides' | 'brand' | 'thumbnail_url'>>,
  ): Promise<DbProject> => {
    const updated = await apiUpdateProject(id, updates);
    setProjects(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  }, []);

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    await apiDeleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const loadProject = useCallback(async (id: string): Promise<DbProject | null> => {
    return fetchProjectById(id);
  }, []);

  return {
    projects,
    loading,
    error,
    refresh,
    createProject,
    updateProject,
    deleteProject,
    loadProject,
  };
}
