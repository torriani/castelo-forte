import React, { useCallback, useRef, useState } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (file: File) => Promise<any>;
  uploading: boolean;
  error: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  uploading,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    await onUpload(file);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Limpar input para permitir upload do mesmo arquivo
    e.target.value = '';
  }, [handleFile]);

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      <button
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        disabled={uploading}
        className={`w-full border border-dashed rounded-lg px-3 py-3 flex items-center justify-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-white/40 bg-white/10'
            : uploading
              ? 'border-white/10 bg-[#121214] cursor-not-allowed opacity-60'
              : 'border-white/10 bg-[#121214] hover:bg-white/5 hover:border-white/20'
        }`}
      >
        {uploading ? (
          <div className="flex items-center space-x-2 text-zinc-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-[9px]">Enviando...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-zinc-500">
            <Upload className="w-3 h-3" />
            <span className="text-[9px]">
              {isDragOver ? 'Solte a imagem aqui' : 'Upload ou arraste imagem'}
            </span>
          </div>
        )}
      </button>

      {error && (
        <div className="flex items-start space-x-1.5 text-red-400">
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
          <span className="text-[9px] leading-tight">{error}</span>
        </div>
      )}

      <p className="text-[8px] text-zinc-700 text-center">
        PNG, JPG, WebP - max 5MB
      </p>
    </div>
  );
};
