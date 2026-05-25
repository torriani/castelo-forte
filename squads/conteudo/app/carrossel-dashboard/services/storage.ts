import { supabase } from './supabase';

const BUCKET = 'carrossel-images';
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export interface UserImage {
  id: string;
  user_id: string;
  filename: string;
  original_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  created_at: string;
}

export interface UploadResult {
  image: UserImage;
  error: null;
}

export interface UploadError {
  image: null;
  error: string;
}

// Validar arquivo antes do upload
function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Formato nao suportado. Use PNG, JPG ou WebP.';
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximo: 5MB.`;
  }
  return null;
}

// Gerar nome unico para o arquivo
function generateFilename(originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'png';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}.${ext}`;
}

// Obter dimensoes da imagem
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}

// Upload de imagem para o Supabase Storage + registro na tabela
export async function uploadImage(
  userId: string,
  file: File
): Promise<UploadResult | UploadError> {
  // Validar
  const validationError = validateFile(file);
  if (validationError) {
    return { image: null, error: validationError };
  }

  const filename = generateFilename(file.name);
  const storagePath = `${userId}/${filename}`;

  try {
    // 1. Upload para o Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { image: null, error: `Erro no upload: ${uploadError.message}` };
    }

    // 2. Obter URL publica
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // 3. Obter dimensoes
    const dimensions = await getImageDimensions(file);

    // 4. Registrar na tabela
    const { data: imageRecord, error: dbError } = await supabase
      .from('carrossel_user_images')
      .insert({
        user_id: userId,
        filename,
        original_name: file.name,
        storage_path: storagePath,
        public_url: publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
        width: dimensions.width || null,
        height: dimensions.height || null,
      })
      .select()
      .single();

    if (dbError) {
      // Rollback: remover arquivo do storage se falhar no banco
      await supabase.storage.from(BUCKET).remove([storagePath]);
      return { image: null, error: `Erro ao salvar registro: ${dbError.message}` };
    }

    return { image: imageRecord as UserImage, error: null };
  } catch (err: any) {
    return { image: null, error: `Erro inesperado: ${err.message}` };
  }
}

// Listar imagens do usuario
export async function listUserImages(userId: string): Promise<UserImage[]> {
  const { data, error } = await supabase
    .from('carrossel_user_images')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao listar imagens:', error);
    return [];
  }

  return (data || []) as UserImage[];
}

// Deletar imagem (storage + banco)
export async function deleteImage(imageId: string, storagePath: string): Promise<{ error: string | null }> {
  try {
    // 1. Remover do storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([storagePath]);

    if (storageError) {
      console.error('Erro ao remover do storage:', storageError);
      // Continuar mesmo se falhar no storage (pode ja ter sido removido)
    }

    // 2. Remover do banco
    const { error: dbError } = await supabase
      .from('carrossel_user_images')
      .delete()
      .eq('id', imageId);

    if (dbError) {
      return { error: `Erro ao deletar registro: ${dbError.message}` };
    }

    return { error: null };
  } catch (err: any) {
    return { error: `Erro inesperado: ${err.message}` };
  }
}
