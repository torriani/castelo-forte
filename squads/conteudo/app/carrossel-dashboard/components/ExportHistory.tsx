import React from 'react';
import { Download, Clock } from 'lucide-react';
import { DbExport } from '../services/supabase';

interface ExportHistoryProps {
  exports: DbExport[];
  loading: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const ExportHistory: React.FC<ExportHistoryProps> = ({ exports: exportList, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (exportList.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-[10px] text-zinc-600">Nenhum export ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center space-x-1.5 mb-2">
        <Download className="w-3 h-3 text-zinc-500" />
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
          Historico de exports ({exportList.length})
        </span>
      </div>
      {exportList.slice(0, 5).map((exp) => (
        <div
          key={exp.id}
          className="flex items-center justify-between px-3 py-2 bg-[#121214] rounded-lg border border-white/5"
        >
          <div className="flex items-center space-x-2">
            <Download className="w-3 h-3 text-zinc-600" />
            <div>
              <span className="text-[10px] text-zinc-300 block">
                {exp.slides_count} slides
              </span>
              <span className="text-[9px] text-zinc-600">
                {formatSize(exp.zip_size_bytes)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-[9px] text-zinc-600">
            <Clock className="w-2.5 h-2.5" />
            <span>{formatDate(exp.created_at)}</span>
          </div>
        </div>
      ))}
      {exportList.length > 5 && (
        <p className="text-[9px] text-zinc-600 text-center pt-1">
          +{exportList.length - 5} exports anteriores
        </p>
      )}
    </div>
  );
};
