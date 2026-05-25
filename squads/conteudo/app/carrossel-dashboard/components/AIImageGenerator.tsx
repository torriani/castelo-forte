import React, { useState, useCallback } from 'react';
import { Wand2, Check, RefreshCw, X, Loader2 } from 'lucide-react';
import { generateImage } from '../services/openrouter';
import { uploadImage, UserImage } from '../services/storage';
import { PromptSuggestions } from './PromptSuggestions';

interface AIImageGeneratorProps {
  userId: string;
  onApplyImage: (url: string) => void;
  onImageUploaded: (image: UserImage) => void;
}

export const AIImageGenerator: React.FC<AIImageGeneratorProps> = ({
  userId,
  onApplyImage,
  onImageUploaded,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setPreviewUrl(null);

    if (customPrompt) {
      setPrompt(customPrompt);
    }

    const result = await generateImage(finalPrompt);

    if (result.error) {
      setError(result.error);
    } else {
      setPreviewUrl(result.imageUrl);
    }

    setIsGenerating(false);
  }, [prompt]);

  const handleApply = useCallback(async () => {
    if (!previewUrl || !userId) return;

    setIsSaving(true);
    setError(null);

    try {
      // Baixar a imagem e converter para File para upload no Supabase
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const file = new File([blob], `ai-generated-${Date.now()}.png`, { type: 'image/png' });

      const result = await uploadImage(userId, file);

      if (result.error) {
        setError(result.error);
        setIsSaving(false);
        return;
      }

      // Notificar que a imagem foi salva na galeria
      onImageUploaded(result.image!);
      // Aplicar no slide
      onApplyImage(result.image!.public_url);

      // Limpar estado
      setPreviewUrl(null);
      setPrompt('');
      setIsOpen(false);
    } catch (err: any) {
      setError(`Erro ao salvar: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [previewUrl, userId, onApplyImage, onImageUploaded]);

  const handleGenerateAnother = useCallback(() => {
    setPreviewUrl(null);
    setError(null);
    handleGenerate();
  }, [handleGenerate]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setPreviewUrl(null);
    setError(null);
    setPrompt('');
  }, []);

  // Botao fechado — apenas mostra o trigger
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg border border-dashed border-violet-500/30 text-violet-400 hover:bg-violet-500/5 hover:border-violet-500/50 transition-all text-[10px] font-bold uppercase tracking-wider"
      >
        <Wand2 className="w-3 h-3" />
        <span>Gerar com IA</span>
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-violet-500/20 bg-[#0d0d10] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <div className="flex items-center space-x-1.5">
          <Wand2 className="w-3 h-3 text-violet-400" />
          <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wider">
            Gerar imagem com IA
          </span>
        </div>
        <button
          onClick={handleClose}
          className="w-4 h-4 flex items-center justify-center text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Input de prompt */}
        <div className="space-y-1.5">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva a imagem que voce quer gerar..."
            className="w-full h-16 bg-[#18181b] border border-transparent focus:border-violet-500/30 rounded-lg px-3 py-2 text-[10px] text-zinc-300 focus:outline-none resize-none leading-relaxed placeholder:text-zinc-700"
            disabled={isGenerating || isSaving}
          />

          <button
            onClick={() => handleGenerate()}
            disabled={!prompt.trim() || isGenerating || isSaving}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Gerando...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3 h-3" />
                <span>Gerar</span>
              </>
            )}
          </button>
        </div>

        {/* Sugestoes de prompt */}
        {!previewUrl && !isGenerating && (
          <PromptSuggestions
            onSelect={(suggestion) => handleGenerate(suggestion)}
            disabled={isGenerating || isSaving}
          />
        )}

        {/* Erro */}
        {error && (
          <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-[9px] text-red-400">{error}</p>
          </div>
        )}

        {/* Preview da imagem gerada */}
        {previewUrl && (
          <div className="space-y-2">
            <div className="relative rounded-lg overflow-hidden border border-violet-500/20">
              <img
                src={previewUrl}
                alt="Imagem gerada por IA"
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-1.5 right-1.5 bg-violet-600 px-1.5 py-0.5 rounded text-[7px] text-white font-bold uppercase">
                Preview
              </div>
            </div>

            {/* Botoes de acao */}
            <div className="flex space-x-2">
              <button
                onClick={handleApply}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Aplicar</span>
                  </>
                )}
              </button>

              <button
                onClick={handleGenerateAnother}
                disabled={isGenerating || isSaving}
                className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Outro</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
