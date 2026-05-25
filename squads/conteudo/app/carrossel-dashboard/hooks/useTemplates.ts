import { useState, useEffect, useCallback } from 'react';
import { CarouselTemplate } from '../types';
import { fetchTemplatesFromDb, invalidateTemplateCache } from '../services/templates';

interface UseTemplatesReturn {
  templates: CarouselTemplate[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useTemplates(): UseTemplatesReturn {
  const [templates, setTemplates] = useState<CarouselTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTemplatesFromDb();
      setTemplates(data);
    } catch (err: any) {
      console.error('Erro ao carregar templates:', err);
      setError(err.message || 'Falha ao carregar templates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    invalidateTemplateCache();
    load();
  }, [load]);

  return { templates, loading, error, refresh };
}
