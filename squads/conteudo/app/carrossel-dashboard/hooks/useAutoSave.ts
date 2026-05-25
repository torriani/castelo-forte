import { useEffect, useRef, useCallback, useState } from 'react';

interface AutoSaveOptions {
  /** ID do projeto (null = nao salvar) */
  projectId: string | null;
  /** Dados para salvar */
  getData: () => any;
  /** Funcao de save */
  onSave: (id: string, data: any) => Promise<void>;
  /** Intervalo de debounce em ms (default 30000 = 30s) */
  debounceMs?: number;
  /** Ativado? */
  enabled?: boolean;
}

interface AutoSaveReturn {
  /** Se esta salvando agora */
  saving: boolean;
  /** Ultimo save timestamp */
  lastSavedAt: Date | null;
  /** Se tem mudancas nao salvas */
  isDirty: boolean;
  /** Forcar save imediato */
  saveNow: () => Promise<void>;
  /** Marcar como dirty (trigger debounce) */
  markDirty: () => void;
}

export function useAutoSave({
  projectId,
  getData,
  onSave,
  debounceMs = 30000,
  enabled = true,
}: AutoSaveOptions): AutoSaveReturn {
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const getDataRef = useRef(getData);
  const onSaveRef = useRef(onSave);

  // Manter refs atualizados
  useEffect(() => {
    getDataRef.current = getData;
  }, [getData]);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const doSave = useCallback(async () => {
    if (!projectId || !enabled) return;
    try {
      setSaving(true);
      const data = getDataRef.current();
      await onSaveRef.current(projectId, data);
      setLastSavedAt(new Date());
      setIsDirty(false);
    } catch (err) {
      console.error('Erro no auto-save:', err);
    } finally {
      setSaving(false);
    }
  }, [projectId, enabled]);

  const scheduleSave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      doSave();
    }, debounceMs);
  }, [doSave, debounceMs]);

  const markDirty = useCallback(() => {
    setIsDirty(true);
    if (projectId && enabled) {
      scheduleSave();
    }
  }, [projectId, enabled, scheduleSave]);

  const saveNow = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    await doSave();
  }, [doSave]);

  // Limpar timer ao desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Save antes de sair da pagina
  useEffect(() => {
    if (!projectId || !enabled || !isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Tentar salvar sincronamente nao e possivel, mas pelo menos avisar
      e.returnValue = 'Voce tem alteracoes nao salvas. Deseja sair?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [projectId, enabled, isDirty]);

  return {
    saving,
    lastSavedAt,
    isDirty,
    saveNow,
    markDirty,
  };
}
