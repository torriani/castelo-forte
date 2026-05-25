import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  UserImage,
  uploadImage,
  listUserImages,
  deleteImage,
} from '../services/storage';

interface UseUserImagesReturn {
  images: UserImage[];
  loading: boolean;
  uploading: boolean;
  error: string | null;
  upload: (file: File) => Promise<UserImage | null>;
  remove: (image: UserImage) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useUserImages(): UseUserImagesReturn {
  const { user } = useAuth();
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar imagens do usuario
  const refresh = useCallback(async () => {
    if (!user) {
      setImages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userImages = await listUserImages(user.id);
      setImages(userImages);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar imagens:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Carregar ao montar e quando user mudar
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Upload de nova imagem
  const upload = useCallback(async (file: File): Promise<UserImage | null> => {
    if (!user) {
      setError('Usuario nao autenticado');
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadImage(user.id, file);

      if (result.error) {
        setError(result.error);
        return null;
      }

      // Adicionar ao inicio da lista (mais recente primeiro)
      setImages(prev => [result.image!, ...prev]);
      return result.image;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  }, [user]);

  // Remover imagem
  const remove = useCallback(async (image: UserImage): Promise<boolean> => {
    setError(null);

    try {
      const { error: deleteError } = await deleteImage(image.id, image.storage_path);

      if (deleteError) {
        setError(deleteError);
        return false;
      }

      // Remover da lista local
      setImages(prev => prev.filter(img => img.id !== image.id));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, []);

  return {
    images,
    loading,
    uploading,
    error,
    upload,
    remove,
    refresh,
  };
}
