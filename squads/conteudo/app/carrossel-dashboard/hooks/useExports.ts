import { useState, useEffect, useCallback } from 'react';
import {
  DbExport,
  createExportRecord,
  fetchExportsByProject,
  fetchExportCounts,
} from '../services/supabase';
import { useAuth } from './useAuth';

export interface UseExportsReturn {
  exports: DbExport[];
  loading: boolean;
  exportCounts: Record<string, number>;
  countsLoading: boolean;
  recordExport: (projectId: string, slidesCount: number, zipSizeBytes: number) => Promise<DbExport>;
  loadExports: (projectId: string) => Promise<void>;
  refreshCounts: () => Promise<void>;
}

export function useExports(): UseExportsReturn {
  const { user } = useAuth();
  const [exports, setExports] = useState<DbExport[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportCounts, setExportCounts] = useState<Record<string, number>>({});
  const [countsLoading, setCountsLoading] = useState(true);

  // Carregar contagem de exports por projeto (para badges)
  const refreshCounts = useCallback(async () => {
    if (!user) return;
    try {
      setCountsLoading(true);
      const counts = await fetchExportCounts();
      setExportCounts(counts);
    } catch (err) {
      console.error('Erro ao carregar contagem de exports:', err);
    } finally {
      setCountsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshCounts();
    }
  }, [user, refreshCounts]);

  // Carregar historico de exports de um projeto especifico
  const loadExports = useCallback(async (projectId: string) => {
    try {
      setLoading(true);
      const data = await fetchExportsByProject(projectId);
      setExports(data);
    } catch (err) {
      console.error('Erro ao carregar exports:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Registrar novo export
  const recordExport = useCallback(async (
    projectId: string,
    slidesCount: number,
    zipSizeBytes: number,
  ): Promise<DbExport> => {
    if (!user) throw new Error('Usuario nao autenticado');

    const record = await createExportRecord({
      project_id: projectId,
      user_id: user.id,
      slides_count: slidesCount,
      zip_size_bytes: zipSizeBytes,
    });

    // Atualizar estado local
    setExports(prev => [record, ...prev]);
    setExportCounts(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || 0) + 1,
    }));

    return record;
  }, [user]);

  return {
    exports,
    loading,
    exportCounts,
    countsLoading,
    recordExport,
    loadExports,
    refreshCounts,
  };
}
