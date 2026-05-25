import React from 'react';
import { Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { ExportProgress } from '../services/export';

interface ExportButtonProps {
  slidesCount: number;
  isExporting: boolean;
  progress: ExportProgress | null;
  onExport: () => void;
  /** Variante visual: 'sidebar' (botao largo) ou 'topbar' (botao compacto) */
  variant?: 'sidebar' | 'topbar';
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  slidesCount,
  isExporting,
  progress,
  onExport,
  variant = 'sidebar',
}) => {
  if (slidesCount === 0) return null;

  const progressPercent = progress && progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  const statusIcon = () => {
    if (!isExporting) return <Download className="w-3 h-3" />;
    if (progress?.status === 'done') return <CheckCircle2 className="w-3 h-3 text-green-500" />;
    if (progress?.status === 'error') return <AlertCircle className="w-3 h-3 text-red-500" />;
    return (
      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
    );
  };

  const statusText = () => {
    if (!isExporting) return `Exportar ${slidesCount} Slides`;
    if (progress?.status === 'rendering') {
      return `Slide ${progress.current}/${progress.total}`;
    }
    if (progress?.status === 'zipping') return 'Compactando...';
    if (progress?.status === 'done') return 'Concluido!';
    if (progress?.status === 'error') return 'Erro!';
    return 'Exportando...';
  };

  // Variante topbar (compacta, para a barra superior do preview)
  if (variant === 'topbar') {
    return (
      <button
        onClick={onExport}
        disabled={isExporting}
        className={`flex items-center space-x-2 px-4 py-2 border border-white/20 rounded-lg text-xs font-medium transition-colors relative overflow-hidden ${
          isExporting ? 'bg-white/10 cursor-not-allowed' : 'hover:bg-white/5'
        }`}
      >
        {/* Progress bar de fundo */}
        {isExporting && progress && progress.status === 'rendering' && (
          <div
            className="absolute inset-0 bg-white/5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        )}
        <span className="relative flex items-center space-x-2">
          {statusIcon()}
          <span>{statusText()}</span>
        </span>
      </button>
    );
  }

  // Variante sidebar (botao largo, para a barra lateral)
  return (
    <div className="space-y-2">
      <button
        onClick={onExport}
        disabled={isExporting}
        className={`w-full py-3.5 rounded-lg font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2 relative overflow-hidden ${
          isExporting
            ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
            : 'bg-white text-black hover:bg-gray-100'
        }`}
      >
        {/* Progress bar de fundo */}
        {isExporting && progress && progress.status === 'rendering' && (
          <div
            className="absolute inset-0 bg-white/10 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        )}
        <span className="relative flex items-center space-x-2">
          {statusIcon()}
          <span>{statusText()}</span>
        </span>
      </button>

      {/* Progress info detalhado */}
      {isExporting && progress && (
        <div className="space-y-1.5">
          {/* Barra de progresso */}
          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progress.status === 'error' ? 'bg-red-500' :
                progress.status === 'done' ? 'bg-green-500' :
                'bg-white'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Texto de status */}
          <p className="text-[9px] text-zinc-600 text-center">
            {progress.message}
          </p>
        </div>
      )}
    </div>
  );
};
