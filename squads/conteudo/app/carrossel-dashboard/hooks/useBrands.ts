import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { DbBrand, fetchBrands, createBrand, updateBrand, deleteBrand } from '../services/supabase';
import { BrandProfile } from '../types';

// Converter DbBrand (banco) para BrandProfile (frontend)
export function dbBrandToProfile(db: DbBrand): BrandProfile {
  return {
    id: db.id,
    name: db.nome,
    handle: db.handle,
    avatarUrl: db.avatar_url || '',
    isVerified: db.verificado,
    marcaNome: db.marca_nome || undefined,
    marcaIconeUrl: db.marca_icone_url || undefined,
    tagline: db.tagline || undefined,
    categoria: db.categoria || undefined,
    corPrimaria: db.cor_primaria,
    corSecundaria: db.cor_secundaria,
    corAccent: db.cor_accent,
  };
}

// Converter BrandProfile (frontend) para campos do banco
export function profileToDbFields(profile: Partial<BrandProfile>): Partial<DbBrand> {
  const fields: Record<string, any> = {};
  if (profile.name !== undefined) fields.nome = profile.name;
  if (profile.handle !== undefined) fields.handle = profile.handle;
  if (profile.avatarUrl !== undefined) fields.avatar_url = profile.avatarUrl || null;
  if (profile.isVerified !== undefined) fields.verificado = profile.isVerified;
  if (profile.marcaNome !== undefined) fields.marca_nome = profile.marcaNome || null;
  if (profile.marcaIconeUrl !== undefined) fields.marca_icone_url = profile.marcaIconeUrl || null;
  if (profile.tagline !== undefined) fields.tagline = profile.tagline || null;
  if (profile.categoria !== undefined) fields.categoria = profile.categoria || null;
  if (profile.corPrimaria !== undefined) fields.cor_primaria = profile.corPrimaria;
  if (profile.corSecundaria !== undefined) fields.cor_secundaria = profile.corSecundaria;
  if (profile.corAccent !== undefined) fields.cor_accent = profile.corAccent;
  return fields as Partial<DbBrand>;
}

export interface NewBrandData {
  name: string;
  handle: string;
  avatarUrl?: string;
  isVerified?: boolean;
  marcaNome?: string;
  marcaIconeUrl?: string;
  tagline?: string;
  categoria?: string;
  corPrimaria?: string;
  corSecundaria?: string;
  corAccent?: string;
}

interface UseBrandsReturn {
  brands: BrandProfile[];
  loading: boolean;
  error: string | null;
  selectedBrandId: string | null;
  selectedBrand: BrandProfile | null;
  selectBrand: (id: string) => void;
  create: (data: NewBrandData) => Promise<BrandProfile | null>;
  update: (id: string, data: Partial<NewBrandData>) => Promise<BrandProfile | null>;
  remove: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useBrands(): UseBrandsReturn {
  const { user } = useAuth();
  const [brands, setBrands] = useState<BrandProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  // Carregar brands
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dbBrands = await fetchBrands();
      const profiles = dbBrands.map(dbBrandToProfile);
      setBrands(profiles);

      // Auto-selecionar o primeiro brand se nenhum selecionado
      if (!selectedBrandId && profiles.length > 0) {
        setSelectedBrandId(profiles[0].id || null);
      }
    } catch (err: any) {
      console.error('Erro ao carregar brands:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedBrandId]);

  useEffect(() => {
    refresh();
  }, [user]);

  // Brand selecionado
  const selectedBrand = brands.find(b => b.id === selectedBrandId) || null;

  // Selecionar brand
  const selectBrand = useCallback((id: string) => {
    setSelectedBrandId(id);
  }, []);

  // Criar novo brand
  const create = useCallback(async (data: NewBrandData): Promise<BrandProfile | null> => {
    if (!user) {
      setError('Usuario nao autenticado');
      return null;
    }

    setError(null);
    try {
      const dbData = {
        nome: data.name,
        handle: data.handle,
        avatar_url: data.avatarUrl || null,
        verificado: data.isVerified || false,
        marca_nome: data.marcaNome || null,
        marca_icone_url: data.marcaIconeUrl || null,
        tagline: data.tagline || null,
        categoria: data.categoria || null,
        cor_primaria: data.corPrimaria || '#000000',
        cor_secundaria: data.corSecundaria || '#666666',
        cor_accent: data.corAccent || '#d4b995',
        user_id: user.id,
      };

      const created = await createBrand(dbData as any);
      const profile = dbBrandToProfile(created);

      setBrands(prev => [...prev, profile]);
      setSelectedBrandId(profile.id || null);
      return profile;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [user]);

  // Atualizar brand
  const update = useCallback(async (id: string, data: Partial<NewBrandData>): Promise<BrandProfile | null> => {
    setError(null);
    try {
      const dbFields = profileToDbFields(data as Partial<BrandProfile>);
      const updated = await updateBrand(id, dbFields);
      const profile = dbBrandToProfile(updated);

      setBrands(prev => prev.map(b => b.id === id ? profile : b));
      return profile;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  // Remover brand
  const remove = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    try {
      await deleteBrand(id);
      setBrands(prev => prev.filter(b => b.id !== id));

      // Se deletou o selecionado, selecionar outro
      if (selectedBrandId === id) {
        const remaining = brands.filter(b => b.id !== id);
        setSelectedBrandId(remaining.length > 0 ? remaining[0].id || null : null);
      }
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [selectedBrandId, brands]);

  return {
    brands,
    loading,
    error,
    selectedBrandId,
    selectedBrand,
    selectBrand,
    create,
    update,
    remove,
    refresh,
  };
}
