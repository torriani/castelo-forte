import React, { useState } from 'react';
import { Trash2, Check, Loader2, ImageIcon } from 'lucide-react';
import { UserImage } from '../services/storage';

interface ImageGalleryProps {
  images: UserImage[];
  loading: boolean;
  selectedUrl: string | undefined;
  onSelect: (url: string) => void;
  onDelete: (image: UserImage) => Promise<boolean>;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  loading,
  selectedUrl,
  onSelect,
  onDelete,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, image: UserImage) => {
    e.stopPropagation();
    setDeletingId(image.id);
    await onDelete(image);
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-4 h-4 text-zinc-600 animate-spin" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-zinc-700">
        <ImageIcon className="w-5 h-5 mb-1.5" />
        <p className="text-[9px]">Nenhuma imagem</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {images.map(image => {
        const isSelected = selectedUrl === image.public_url;
        const isDeleting = deletingId === image.id;

        return (
          <div
            key={image.id}
            onClick={() => onSelect(image.public_url)}
            className={`relative aspect-square rounded-md overflow-hidden cursor-pointer group border transition-all ${
              isSelected
                ? 'border-white/40 ring-1 ring-white/20'
                : 'border-transparent hover:border-white/20'
            }`}
          >
            <img
              src={image.public_url}
              alt={image.original_name}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Overlay de selecao */}
            {isSelected && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Botao de deletar (hover) */}
            <button
              onClick={(e) => handleDelete(e, image)}
              disabled={isDeleting}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600/80"
            >
              {isDeleting ? (
                <Loader2 className="w-2.5 h-2.5 text-white animate-spin" />
              ) : (
                <Trash2 className="w-2.5 h-2.5 text-white" />
              )}
            </button>

            {/* Nome do arquivo (hover) */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-[7px] text-white truncate">{image.original_name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
