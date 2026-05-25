import React from 'react';
import { Lightbulb } from 'lucide-react';

const SUGGESTIONS = [
  'Fundo editorial clean com gradiente suave',
  'Capa de carrossel profissional com textura',
  'Background minimalista escuro para texto branco',
  'Foto estilizada de escritorio/workspace',
  'Padrao geometrico moderno em cores neutras',
];

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center space-x-1.5">
        <Lightbulb className="w-2.5 h-2.5 text-zinc-600" />
        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">
          Sugestoes
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onSelect(suggestion)}
            disabled={disabled}
            className="px-2 py-1 rounded-md bg-[#18181b] border border-transparent text-[9px] text-zinc-500 hover:text-zinc-300 hover:border-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
