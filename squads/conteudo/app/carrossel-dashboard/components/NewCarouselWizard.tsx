import React, { useState, useEffect } from 'react';
import {
  Plus,
  X,
  ArrowRight,
  Layout,
  BookOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Image as ImageIcon,
  ArrowLeft,
} from 'lucide-react';
import { CarouselTemplate, Client } from '../types';

type WizardStep = 'choice' | 'from-copy' | 'from-scratch';

interface NewCarouselWizardProps {
  open: boolean;
  onClose: () => void;
  // Templates
  templates: CarouselTemplate[];
  templatesLoading: boolean;
  // Copias
  clients: Client[];
  // Callbacks
  onCreateFromScratch: (name: string, templateSlug: string) => void;
  onCreateFromCopy: (path: string) => void;
}

export const NewCarouselWizard: React.FC<NewCarouselWizardProps> = ({
  open,
  onClose,
  templates,
  templatesLoading,
  clients,
  onCreateFromScratch,
  onCreateFromCopy,
}) => {
  const [step, setStep] = useState<WizardStep>('choice');
  const [projectName, setProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('twitter-branco');

  // Browser de copias
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());
  const [selectedCopyPath, setSelectedCopyPath] = useState<string | null>(null);

  // Reset ao abrir
  useEffect(() => {
    if (open) {
      setStep('choice');
      setProjectName('');
      setSelectedTemplate('twitter-branco');
      setSelectedCopyPath(null);
      if (clients.length > 0) {
        setExpandedClients(new Set(clients.map(c => c.name)));
      }
    }
  }, [open, clients]);

  if (!open) return null;

  const twitterTemplates = templates.filter(t => t.familia === 'twitter');
  const editorialTemplates = templates.filter(t => t.familia === 'editorial');

  const handleCreateScratch = () => {
    if (!projectName.trim()) return;
    onCreateFromScratch(projectName.trim(), selectedTemplate);
    onClose();
  };

  const handleCreateFromCopy = () => {
    if (!selectedCopyPath) return;
    onCreateFromCopy(selectedCopyPath);
    onClose();
  };

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

  const renderTemplatePicker = (templateList: CarouselTemplate[], label: string) => {
    if (templateList.length === 0) return null;
    return (
      <div className="space-y-2">
        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">{label}</span>
        <div className="grid grid-cols-2 gap-2">
          {templateList.map(tmpl => (
            <button
              key={tmpl.slug}
              onClick={() => setSelectedTemplate(tmpl.slug)}
              className={`px-3 py-3 rounded-lg border text-left transition-all ${
                selectedTemplate === tmpl.slug
                  ? 'bg-white/10 border-white/30 text-white ring-1 ring-white/20'
                  : 'bg-[#121214] border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <div
                  className="w-4 h-4 rounded-sm border border-white/10"
                  style={{ backgroundColor: tmpl.background }}
                />
                <span className="text-[11px] font-bold">{tmpl.nome}</span>
              </div>
              <span className="text-[9px] text-zinc-600 block">
                {tmpl.dark_mode ? 'Fundo escuro' : 'Fundo claro'}
                {tmpl.descricao ? ` · ${tmpl.descricao}` : ''}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#09090b] border border-white/10 rounded-2xl w-full max-w-2xl mx-4 overflow-hidden shadow-2xl max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center space-x-2">
            {step !== 'choice' && (
              <button
                onClick={() => setStep('choice')}
                className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-colors mr-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <Plus className="w-4 h-4 text-zinc-400" />
            <span className="text-white font-bold text-sm">Novo carrossel</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">

          {/* === STEP: CHOICE === */}
          {step === 'choice' && (
            <div className="p-6 space-y-4">
              <p className="text-zinc-400 text-xs mb-4">Como voce quer comecar?</p>

              <button
                onClick={() => setStep('from-copy')}
                className="w-full flex items-center space-x-4 p-5 rounded-xl border border-white/10 bg-[#121214] hover:bg-white/5 hover:border-white/20 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <span className="text-white font-bold text-sm block">A partir de uma copia</span>
                  <span className="text-zinc-500 text-[11px] block mt-0.5">
                    Selecione um carrossel de outputs/copys/ e crie um projeto editavel
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={() => setStep('from-scratch')}
                className="w-full flex items-center space-x-4 p-5 rounded-xl border border-white/10 bg-[#121214] hover:bg-white/5 hover:border-white/20 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Layout className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <span className="text-white font-bold text-sm block">Do zero</span>
                  <span className="text-zinc-500 text-[11px] block mt-0.5">
                    Crie um carrossel vazio com o template de sua escolha
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </button>
            </div>
          )}

          {/* === STEP: FROM COPY === */}
          {step === 'from-copy' && (
            <div className="p-6">
              <p className="text-zinc-400 text-xs mb-4">Selecione uma copia para usar como base:</p>

              <div className="border border-white/10 rounded-xl overflow-hidden max-h-[50vh] overflow-y-auto custom-scrollbar bg-[#0a0a0b]">
                {clients.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <p className="text-zinc-600 text-xs">Nenhum carrossel encontrado</p>
                    <p className="text-zinc-700 text-[10px] mt-1">outputs/copys/</p>
                  </div>
                )}

                {clients.map(client => (
                  <div key={client.name}>
                    <button
                      onClick={() => toggleClient(client.name)}
                      className="w-full flex items-center px-4 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
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
                            className="w-full flex items-center px-4 py-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                          >
                            {expandedCampaigns.has(campaignKey) ? (
                              <ChevronDown className="w-2.5 h-2.5 mr-2 shrink-0" />
                            ) : (
                              <ChevronRight className="w-2.5 h-2.5 mr-2 shrink-0" />
                            )}
                            <span className="truncate">{campaign.name}</span>
                          </button>

                          {expandedCampaigns.has(campaignKey) && (
                            <div className="ml-5">
                              {campaign.carousels.map(carousel => {
                                const isSelected = selectedCopyPath === carousel.path;
                                return (
                                  <button
                                    key={carousel.path}
                                    onClick={() => setSelectedCopyPath(carousel.path)}
                                    className={`w-full flex items-center px-3 py-2 text-[10px] transition-colors rounded-md mx-1 ${
                                      isSelected
                                        ? 'bg-white/10 text-white font-medium ring-1 ring-white/20'
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
          )}

          {/* === STEP: FROM SCRATCH === */}
          {step === 'from-scratch' && (
            <div className="p-6 space-y-5">
              {/* Nome */}
              <div className="space-y-2">
                <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  Nome do projeto
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && projectName.trim()) handleCreateScratch();
                  }}
                  placeholder="Ex: Carrossel Black Friday, Post Semanal..."
                  className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-zinc-700 transition-colors"
                  autoFocus
                />
              </div>

              {/* Template */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Layout className="w-3 h-3 text-zinc-500" />
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    Template inicial
                  </span>
                </div>

                {templatesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                    {renderTemplatePicker(twitterTemplates, 'Twitter')}
                    {renderTemplatePicker(editorialTemplates, 'Editorial')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'choice' && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end space-x-3 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-zinc-500 hover:text-white transition-colors"
            >
              Cancelar
            </button>

            {step === 'from-scratch' && (
              <button
                onClick={handleCreateScratch}
                disabled={!projectName.trim()}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-bold text-xs transition-all ${
                  projectName.trim()
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                <span>Criar e editar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {step === 'from-copy' && (
              <button
                onClick={handleCreateFromCopy}
                disabled={!selectedCopyPath}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-bold text-xs transition-all ${
                  selectedCopyPath
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                <span>Usar esta copia</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
