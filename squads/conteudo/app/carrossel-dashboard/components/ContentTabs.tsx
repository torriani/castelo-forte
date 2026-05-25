import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Send,
  FolderOpen,
  FileText,
  Upload,
  ChevronRight,
  ChevronDown,
  Image as ImageIcon,
  Wand2,
  Crown,
  Flame,
  Lightbulb,
  AlertTriangle,
  Search,
  BookOpen,
  ShoppingBag,
} from 'lucide-react';
import { Client } from '../types';

export type ContentTab = 'criar' | 'enviar' | 'selecionar';

export type PostType = 'imperial' | 'polemico' | 'crenca' | 'problema' | 'curiosidade' | 'historia' | 'oferta';

export interface GenerateParams {
  headline: string;
  fatos: string;
  cta: string;
  postType: PostType;
  slideCount: number;
  useRag: boolean;
}

interface ContentTabsProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
  // Criar
  onGenerate: (params: GenerateParams) => void;
  generating: boolean;
  // Enviar
  onSubmitText: (text: string) => void;
  // Selecionar
  clients: Client[];
  selectedPath: string | null;
  onSelectCopy: (path: string) => void;
}

const TABS: { id: ContentTab; label: string; icon: React.FC<any> }[] = [
  { id: 'criar', label: 'Criar', icon: Sparkles },
  { id: 'enviar', label: 'Enviar', icon: Send },
  { id: 'selecionar', label: 'Selecionar', icon: FolderOpen },
];

const POST_TYPES: { id: PostType; label: string; icon: React.FC<any>; tom: string }[] = [
  { id: 'imperial', label: 'Imperial', icon: Crown, tom: 'Dominante, doutrinário' },
  { id: 'polemico', label: 'Polêmico', icon: Flame, tom: 'Provocativo, controverso' },
  { id: 'crenca', label: 'Crença', icon: Lightbulb, tom: 'Revelador, conspiratório' },
  { id: 'problema', label: 'Problema', icon: AlertTriangle, tom: 'Empático, direcionado' },
  { id: 'curiosidade', label: 'Curiosidade', icon: Search, tom: 'Misterioso, intrigante' },
  { id: 'historia', label: 'História', icon: BookOpen, tom: 'Íntimo, vulnerável' },
  { id: 'oferta', label: 'Oferta', icon: ShoppingBag, tom: 'Confiante, urgente' },
];

const SLIDE_COUNTS = [3, 5, 7, 10];

// ============ Aba CRIAR ============
const TabCriar: React.FC<{
  onGenerate: (params: GenerateParams) => void;
  generating: boolean;
}> = ({ onGenerate, generating }) => {
  const [headline, setHeadline] = useState('');
  const [fatos, setFatos] = useState('');
  const [cta, setCta] = useState('');
  const [postType, setPostType] = useState<PostType>('imperial');
  const [slideCount, setSlideCount] = useState(10);
  const [useRag, setUseRag] = useState(false);

  const canGenerate = headline.trim().length > 0 && fatos.trim().length > 0;

  const handleGenerate = () => {
    if (!canGenerate || generating) return;
    onGenerate({
      headline: headline.trim(),
      fatos: fatos.trim(),
      cta: cta.trim(),
      postType,
      slideCount,
      useRag,
    });
  };

  return (
    <div className="space-y-4">

      {/* Tipo de post (B-06) */}
      <div>
        <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
          Tipo de Post
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {POST_TYPES.map(type => {
            const isActive = postType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setPostType(type.id)}
                className={`flex items-center space-x-2 px-2.5 py-2 rounded-lg border text-left transition-all ${
                  isActive
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-[#121214] border-transparent text-zinc-500 hover:text-zinc-300 hover:border-white/10'
                }`}
              >
                <type.icon className={`w-3 h-3 shrink-0 ${isActive ? 'text-amber-500' : ''}`} />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold block">{type.label}</span>
                  <span className="text-[8px] text-zinc-600 block truncate">{type.tom}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tamanho / slides (B-07) */}
      <div>
        <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
          Slides
        </label>
        <div className="flex items-center space-x-2">
          {SLIDE_COUNTS.map(count => (
            <button
              key={count}
              onClick={() => setSlideCount(count)}
              className={`flex-1 py-2 rounded-lg border text-center text-xs font-bold transition-all ${
                slideCount === count
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-[#121214] border-transparent text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
        <p className="text-[9px] text-zinc-700 mt-1.5">
          {slideCount === 10 ? 'Estrutura completa do tipo escolhido' :
           slideCount === 7 ? 'Hook → Build-up → Clímax → Nova crença → CTA' :
           slideCount === 5 ? 'Hook → Build-up → Clímax → Resolução → CTA' :
           'Hook → Argumento → CTA'}
        </p>
      </div>

      {/* Separador */}
      <div className="border-t border-white/5" />

      {/* Headline */}
      <div>
        <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
          Headline / Tema
        </label>
        <input
          type="text"
          value={headline}
          onChange={e => setHeadline(e.target.value)}
          placeholder="Ex: Por que 90% dos mentores falham no tráfego pago"
          className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-white/20 placeholder:text-zinc-700"
        />
      </div>

      {/* Fatos e argumentos */}
      <div>
        <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
          Fatos e Argumentos
        </label>
        <textarea
          value={fatos}
          onChange={e => setFatos(e.target.value)}
          placeholder={"Ex:\n- Mentores investem em orgânico e ignoram pago\n- Custo de aquisição sobe sem estratégia\n- Escala exige tráfego pago bem feito"}
          className="w-full h-24 bg-[#18181b] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-white/20 resize-none leading-relaxed custom-scrollbar placeholder:text-zinc-700"
        />
      </div>

      {/* CTA */}
      <div>
        <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
          CTA Final <span className="text-zinc-700 normal-case">(opcional)</span>
        </label>
        <input
          type="text"
          value={cta}
          onChange={e => setCta(e.target.value)}
          placeholder="Ex: Salva esse post e manda pro mentor que precisa ouvir isso"
          className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-white/20 placeholder:text-zinc-700"
        />
      </div>

      {/* RAG toggle (B-22) */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Modo RAG</span>
          <p className="text-[8px] text-zinc-700 mt-0.5">
            {useRag ? 'Busca contexto do squad (~85% qualidade)' : 'Prompt direto (padrão)'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setUseRag(!useRag)}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            useRag ? 'bg-emerald-600' : 'bg-zinc-700'
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
              useRag ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Gerar */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate || generating}
        className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
          canGenerate && !generating
            ? 'bg-white text-black hover:bg-gray-100'
            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
        }`}
      >
        {generating ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-black rounded-full animate-spin" />
            <span>Gerando {slideCount} slides...</span>
          </>
        ) : (
          <>
            <Wand2 className="w-3.5 h-3.5" />
            <span>Gerar Carrossel</span>
          </>
        )}
      </button>
    </div>
  );
};

// ============ Aba ENVIAR ============
const TabEnviar: React.FC<{
  onSubmitText: (text: string) => void;
}> = ({ onSubmitText }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = text.trim().length > 10;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    setText(content);
    setFileName(file.name);
    e.target.value = '';
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmitText(text.trim());
    setText('');
    setFileName(null);
  };

  const estimatedSlides = text.trim()
    ? text.trim().split(/\n{2,}|---/).filter(s => s.trim()).length
    : 0;

  return (
    <div className="space-y-4">
      <p className="text-[10px] text-zinc-600 leading-relaxed">
        Cole o texto do carrossel ou faça upload de um arquivo. Cada parágrafo vira um slide.
      </p>

      <input
        type="file"
        ref={fileInputRef}
        accept=".txt,.md,.text"
        className="hidden"
        onChange={handleFileUpload}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center justify-center space-x-2 py-2.5 border border-dashed border-white/10 rounded-lg text-zinc-500 hover:text-zinc-300 hover:border-white/20 transition-all"
      >
        <Upload className="w-3.5 h-3.5" />
        <span className="text-[11px]">
          {fileName ? fileName : 'Upload arquivo (.txt, .md)'}
        </span>
      </button>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
            Texto do Carrossel
          </label>
          {estimatedSlides > 0 && (
            <span className="text-[9px] text-zinc-600">
              ~{estimatedSlides} slides
            </span>
          )}
        </div>
        <textarea
          value={text}
          onChange={e => { setText(e.target.value); setFileName(null); }}
          placeholder={"Cole o texto do carrossel aqui.\n\nCada parágrafo (separado por linha em branco) vira um slide.\n\n---\n\nVocê também pode usar --- como separador."}
          className="w-full h-48 bg-[#18181b] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-white/20 resize-none leading-relaxed custom-scrollbar placeholder:text-zinc-700"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
          canSubmit
            ? 'bg-white text-black hover:bg-gray-100'
            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
        }`}
      >
        <Send className="w-3.5 h-3.5" />
        <span>Montar Carrossel</span>
      </button>
    </div>
  );
};

// ============ Aba SELECIONAR ============
const TabSelecionar: React.FC<{
  clients: Client[];
  selectedPath: string | null;
  onSelectCopy: (path: string) => void;
}> = ({ clients, selectedPath, onSelectCopy }) => {
  const [expandedClients, setExpandedClients] = useState<Set<string>>(() =>
    new Set(clients.map(c => c.name))
  );
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());

  const toggleClient = (name: string) => {
    setExpandedClients(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleCampaign = (key: string) => {
    setExpandedCampaigns(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-[10px] text-zinc-600 leading-relaxed">
        Escolha uma cópia existente. O carrossel será montado direto, sem IA.
      </p>

      {clients.length === 0 && (
        <div className="text-center py-6">
          <FolderOpen className="w-5 h-5 text-zinc-700 mx-auto mb-2" />
          <p className="text-xs text-zinc-600">Nenhuma cópia encontrada</p>
          <p className="text-[10px] text-zinc-700 mt-1">outputs/copys/</p>
        </div>
      )}

      <div className="-mx-1">
        {clients.map(client => (
          <div key={client.name}>
            <button
              onClick={() => toggleClient(client.name)}
              className="w-full flex items-center px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              {expandedClients.has(client.name) ? (
                <ChevronDown className="w-3 h-3 mr-2 shrink-0" />
              ) : (
                <ChevronRight className="w-3 h-3 mr-2 shrink-0" />
              )}
              <FolderOpen className="w-3 h-3 mr-2 shrink-0 text-amber-500/70" />
              <span className="font-medium truncate">{client.name}</span>
              <span className="ml-auto text-[9px] text-zinc-700">
                {client.campaigns.reduce((acc, c) => acc + c.carousels.length, 0)}
              </span>
            </button>

            {expandedClients.has(client.name) && client.campaigns.map(campaign => {
              const campaignKey = `${client.name}/${campaign.name}`;
              return (
                <div key={campaignKey} className="ml-4">
                  <button
                    onClick={() => toggleCampaign(campaignKey)}
                    className="w-full flex items-center px-3 py-1 text-[11px] text-zinc-500 hover:text-zinc-300 rounded-md transition-colors"
                  >
                    {expandedCampaigns.has(campaignKey) ? (
                      <ChevronDown className="w-2.5 h-2.5 mr-2 shrink-0" />
                    ) : (
                      <ChevronRight className="w-2.5 h-2.5 mr-2 shrink-0" />
                    )}
                    <span className="truncate">{campaign.name}</span>
                    <span className="ml-auto text-[9px] text-zinc-700">{campaign.carousels.length}</span>
                  </button>

                  {expandedCampaigns.has(campaignKey) && (
                    <div className="ml-4">
                      {campaign.carousels.map(carousel => {
                        const isSelected = selectedPath === carousel.path;
                        return (
                          <button
                            key={carousel.path}
                            onClick={() => onSelectCopy(carousel.path)}
                            className={`w-full flex items-center px-3 py-1.5 text-[10px] transition-colors rounded-md ${
                              isSelected
                                ? 'bg-white/10 text-white font-medium'
                                : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
                            }`}
                          >
                            <FileText className="w-3 h-3 mr-2 shrink-0" />
                            <span className="truncate">{carousel.name}</span>
                            {carousel.hasImages && (
                              <ImageIcon className="w-2.5 h-2.5 ml-auto text-emerald-500/60 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ ContentTabs Main ============
export const ContentTabs: React.FC<ContentTabsProps> = ({
  activeTab,
  onTabChange,
  onGenerate,
  generating,
  onSubmitText,
  clients,
  selectedPath,
  onSelectCopy,
}) => {
  return (
    <section className="space-y-4">
      {/* Tab bar */}
      <div className="flex items-center space-x-1 bg-[#121214] rounded-lg p-1">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'criar' && (
        <TabCriar onGenerate={onGenerate} generating={generating} />
      )}
      {activeTab === 'enviar' && (
        <TabEnviar onSubmitText={onSubmitText} />
      )}
      {activeTab === 'selecionar' && (
        <TabSelecionar
          clients={clients}
          selectedPath={selectedPath}
          onSelectCopy={onSelectCopy}
        />
      )}
    </section>
  );
};
