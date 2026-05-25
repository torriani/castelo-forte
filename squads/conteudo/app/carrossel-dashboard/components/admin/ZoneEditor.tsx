import React from 'react';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  Image,
  Minus,
  User,
} from 'lucide-react';

// Tipos de zona disponiveis
export type ZoneType = 'text' | 'image' | 'bar' | 'avatar-row';

export interface ZoneDefinition {
  key: string;
  type: ZoneType;
  position: 'top' | 'center' | 'bottom';
  font?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fields?: string[];
  paddingTop?: number;
  paddingBottom?: number;
}

interface ZoneEditorProps {
  zones: ZoneDefinition[];
  onChange: (zones: ZoneDefinition[]) => void;
}

const ZONE_TYPE_OPTIONS: { value: ZoneType; label: string; icon: React.FC<any> }[] = [
  { value: 'text', label: 'Texto', icon: Type },
  { value: 'image', label: 'Imagem', icon: Image },
  { value: 'bar', label: 'Barra', icon: Minus },
  { value: 'avatar-row', label: 'Avatar Row', icon: User },
];

const POSITION_OPTIONS = [
  { value: 'top', label: 'Topo' },
  { value: 'center', label: 'Centro' },
  { value: 'bottom', label: 'Base' },
];

const SIZE_OPTIONS = [
  { value: 'sm', label: 'Pequeno' },
  { value: 'md', label: 'Medio' },
  { value: 'lg', label: 'Grande' },
  { value: 'xl', label: 'Extra Grande' },
];

const FONT_OPTIONS = [
  { value: '', label: 'Padrao' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Georgia', label: 'Georgia (Serif)' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat' },
];

function generateKey(type: ZoneType, existingKeys: string[]): string {
  let counter = 1;
  let key = `${type}_${counter}`;
  while (existingKeys.includes(key)) {
    counter++;
    key = `${type}_${counter}`;
  }
  return key;
}

export const ZoneEditor: React.FC<ZoneEditorProps> = ({ zones, onChange }) => {
  const addZone = () => {
    const existingKeys = zones.map((z) => z.key);
    const newZone: ZoneDefinition = {
      key: generateKey('text', existingKeys),
      type: 'text',
      position: 'center',
      size: 'md',
    };
    onChange([...zones, newZone]);
  };

  const removeZone = (index: number) => {
    const updated = zones.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveZone = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= zones.length) return;
    const updated = [...zones];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  const updateZone = (index: number, field: keyof ZoneDefinition, value: any) => {
    const updated = zones.map((zone, i) => {
      if (i !== index) return zone;

      const newZone = { ...zone, [field]: value };

      // Atualizar key automaticamente quando tipo muda
      if (field === 'type') {
        const existingKeys = zones.filter((_, j) => j !== index).map((z) => z.key);
        newZone.key = generateKey(value as ZoneType, existingKeys);
      }

      return newZone;
    });
    onChange(updated);
  };

  const getTypeIcon = (type: ZoneType) => {
    const opt = ZONE_TYPE_OPTIONS.find((o) => o.value === type);
    if (!opt) return null;
    const Icon = opt.icon;
    return <Icon className="w-3.5 h-3.5" />;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Zonas ({zones.length})
        </label>
        <button
          type="button"
          onClick={addZone}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar Zona</span>
        </button>
      </div>

      {zones.length === 0 && (
        <div className="border border-dashed border-zinc-700 rounded-lg p-6 text-center">
          <p className="text-zinc-500 text-xs">
            Nenhuma zona definida. Adicione pelo menos uma zona ao template.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {zones.map((zone, index) => (
          <div
            key={`${zone.key}-${index}`}
            className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-3"
          >
            {/* Header da zona */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-zinc-500">{getTypeIcon(zone.type)}</span>
                <span className="text-xs font-mono text-zinc-400">{zone.key}</span>
                <span className="text-[9px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded uppercase">
                  {zone.position}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => moveZone(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Mover para cima"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveZone(index, 'down')}
                  disabled={index === zones.length - 1}
                  className="p-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Mover para baixo"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeZone(index)}
                  className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                  title="Remover zona"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Campos da zona */}
            <div className="grid grid-cols-2 gap-2">
              {/* Tipo */}
              <div>
                <label className="text-[10px] text-zinc-500 uppercase mb-1 block">Tipo</label>
                <select
                  value={zone.type}
                  onChange={(e) => updateZone(index, 'type', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500"
                >
                  {ZONE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Posicao */}
              <div>
                <label className="text-[10px] text-zinc-500 uppercase mb-1 block">Posicao</label>
                <select
                  value={zone.position}
                  onChange={(e) => updateZone(index, 'position', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500"
                >
                  {POSITION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Key (editavel) */}
              <div>
                <label className="text-[10px] text-zinc-500 uppercase mb-1 block">Key</label>
                <input
                  type="text"
                  value={zone.key}
                  onChange={(e) => updateZone(index, 'key', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-zinc-500"
                  placeholder="zona_key"
                />
              </div>

              {/* Tamanho */}
              <div>
                <label className="text-[10px] text-zinc-500 uppercase mb-1 block">Tamanho</label>
                <select
                  value={zone.size || 'md'}
                  onChange={(e) => updateZone(index, 'size', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500"
                >
                  {SIZE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fonte (so para tipo text) */}
              {zone.type === 'text' && (
                <div className="col-span-2">
                  <label className="text-[10px] text-zinc-500 uppercase mb-1 block">Fonte</label>
                  <select
                    value={zone.font || ''}
                    onChange={(e) => updateZone(index, 'font', e.target.value || undefined)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500"
                  >
                    {FONT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Padding vertical (B-12) */}
              <div>
                <label className="text-[10px] text-zinc-500 uppercase mb-1 block">
                  Padding Top <span className="text-zinc-600">{zone.paddingTop || 0}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="4"
                  value={zone.paddingTop || 0}
                  onChange={(e) => updateZone(index, 'paddingTop', Number(e.target.value))}
                  className="w-full accent-white h-1"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase mb-1 block">
                  Padding Bottom <span className="text-zinc-600">{zone.paddingBottom || 0}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="4"
                  value={zone.paddingBottom || 0}
                  onChange={(e) => updateZone(index, 'paddingBottom', Number(e.target.value))}
                  className="w-full accent-white h-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
