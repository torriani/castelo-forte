import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Plus,
  Layers,
  Clock,
  FileCheck,
  Download,
  Trash2,
  Pencil,
  User,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Client, BrandProfile } from '../types';
import { DbProject } from '../services/supabase';

export type NavSection = 'carrosseis' | 'personas' | 'config';

interface CarouselBrowserProps {
  clients: Client[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
  projects: DbProject[];
  projectsLoading: boolean;
  exportCounts: Record<string, number>;
  onOpenProject: (project: DbProject) => void;
  onDeleteProject: (id: string) => Promise<void>;
  onRenameProject: (id: string, name: string) => Promise<void>;
  onNewCarousel: () => void;
  activeProjectId?: string;
  // Navegacao
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
  // Persona ativa
  selectedBrand: BrandProfile | null;
  onChangePersona: () => void;
}

const NAV_ITEMS: { id: NavSection; label: string; icon: React.FC<any>; enabled: boolean }[] = [
  { id: 'carrosseis', label: 'Carrosséis', icon: Layers, enabled: true },
  // Futuras secoes:
  // { id: 'personas', label: 'Personas', icon: User, enabled: false },
  // { id: 'config', label: 'Config', icon: Settings, enabled: false },
];

export const CarouselBrowser: React.FC<CarouselBrowserProps> = ({
  clients,
  selectedPath,
  onSelect,
  projects,
  projectsLoading,
  exportCounts,
  onOpenProject,
  onDeleteProject,
  onRenameProject,
  onNewCarousel,
  activeProjectId,
  activeSection,
  onSectionChange,
  selectedBrand,
  onChangePersona,
}) => {
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (clients.length > 0) {
      setExpandedClients(new Set(clients.map(c => c.name)));
    }
  }, [clients]);

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

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) return;
    try {
      await onRenameProject(id, renameValue.trim());
      setRenamingId(null);
      setRenameValue('');
    } catch (err) {
      console.error('Erro ao renomear:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteProject(id);
      setDeletingId(null);
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <aside className="w-[280px] bg-[#09090b] border-r border-white/5 flex flex-col h-full flex-shrink-0">

      {/* App Header */}
      <div className="h-14 flex items-center px-5 border-b border-white/5 shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-amber-500/80 mr-2.5" />
        <span className="text-white font-bold tracking-wider text-xs uppercase">Carrossel Studio</span>
      </div>

      {/* Persona ativa (mini-card) */}
      {selectedBrand && (
        <button
          onClick={onChangePersona}
          className="mx-3 mt-3 mb-1 flex items-center space-x-2.5 px-3 py-2 bg-[#121214] rounded-lg border border-white/5 hover:border-white/15 transition-colors group"
          title="Trocar persona"
        >
          {selectedBrand.avatarUrl ? (
            <img src={selectedBrand.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
          ) : (
            <div
              className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center"
              style={{ backgroundColor: selectedBrand.corAccent || '#333' }}
            >
              <span className="text-[8px] font-bold text-white">
                {selectedBrand.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0 text-left">
            <span className="text-[11px] text-white font-medium block truncate">{selectedBrand.name}</span>
            <span className="text-[9px] text-zinc-600">@{selectedBrand.handle}</span>
          </div>
          <User className="w-3 h-3 text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
        </button>
      )}

      {/* Nav Sections */}
      <div className="px-3 pt-3 pb-1 flex items-center space-x-1">
        {NAV_ITEMS.map(item => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => item.enabled && onSectionChange(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-white/10 text-white'
                  : item.enabled
                    ? 'text-zinc-600 hover:text-zinc-400 hover:bg-white/5'
                    : 'text-zinc-800 cursor-not-allowed'
              }`}
              disabled={!item.enabled}
            >
              <item.icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content based on active section */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar">
        {activeSection === 'carrosseis' && (
          <>
            {/* === COPIAS === */}
            <div className="py-2">
              <div className="px-4 py-1.5">
                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Copias</span>
              </div>

              {clients.length === 0 && (
                <div className="px-5 py-4 text-center">
                  <p className="text-zinc-600 text-xs">Nenhum carrossel</p>
                  <p className="text-zinc-700 text-[10px] mt-1">outputs/copys/</p>
                </div>
              )}

              {clients.map(client => (
                <div key={client.name}>
                  <button
                    onClick={() => toggleClient(client.name)}
                    className="w-full flex items-center px-4 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
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
                      <div key={campaignKey} className="ml-3">
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
                          <span className="ml-auto text-[9px] text-zinc-700">{campaign.carousels.length}</span>
                        </button>

                        {expandedCampaigns.has(campaignKey) && (
                          <div className="ml-4">
                            {campaign.carousels.map(carousel => {
                              const isSelected = selectedPath === carousel.path;
                              return (
                                <button
                                  key={carousel.path}
                                  onClick={() => onSelect(carousel.path)}
                                  className={`w-full flex items-center px-3 py-1.5 text-[10px] transition-colors rounded-md mx-1 ${
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

            {/* Separador */}
            <div className="mx-4 border-t border-white/5" />

            {/* === MEUS PROJETOS === */}
            <div className="py-2">
              <div className="px-4 py-1.5 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Layers className="w-3 h-3 text-zinc-600" />
                  <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Meus Projetos</span>
                </div>
                <button
                  onClick={onNewCarousel}
                  className="flex items-center space-x-1 px-2 py-1 rounded text-[9px] font-bold text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                  title="Novo carrossel"
                >
                  <Plus className="w-3 h-3" />
                  <span>Novo</span>
                </button>
              </div>

              {projectsLoading && (
                <div className="flex items-center justify-center py-6">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}

              {!projectsLoading && projects.length === 0 && (
                <div className="px-5 py-4 text-center">
                  <p className="text-zinc-600 text-[10px]">Nenhum projeto salvo</p>
                </div>
              )}

              {!projectsLoading && projects.map(project => {
                const isActive = activeProjectId === project.id;
                const isDeleting = deletingId === project.id;
                const isRenaming = renamingId === project.id;
                const slideCount = Array.isArray(project.slides) ? project.slides.length : 0;
                const projectExportCount = exportCounts[project.id] || 0;

                return (
                  <div key={project.id}>
                    <div
                      className={`group px-4 py-2 cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-white/10 border-l-2 border-white'
                          : 'hover:bg-white/5 border-l-2 border-transparent'
                      }`}
                    >
                      {isRenaming ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename(project.id);
                              if (e.key === 'Escape') setRenamingId(null);
                            }}
                            className="flex-1 bg-[#121214] border border-white/20 rounded px-2 py-1 text-[11px] text-white outline-none focus:border-white/40"
                            autoFocus
                          />
                          <button
                            onClick={() => handleRename(project.id)}
                            className="text-green-500 hover:text-green-400 text-[9px] font-bold"
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between" onClick={() => onOpenProject(project)}>
                            <span className="text-white text-[11px] font-bold truncate flex-1 mr-2">
                              {project.name}
                            </span>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRenamingId(project.id);
                                  setRenameValue(project.name);
                                }}
                                className="w-5 h-5 flex items-center justify-center rounded text-zinc-600 hover:text-white hover:bg-white/10"
                                title="Renomear"
                              >
                                <Pencil className="w-2.5 h-2.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingId(project.id);
                                }}
                                className="w-5 h-5 flex items-center justify-center rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10"
                                title="Deletar"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 mt-0.5" onClick={() => onOpenProject(project)}>
                            <span className="text-[9px] text-zinc-600">{slideCount} slides</span>
                            <span className="text-[9px] text-zinc-700">·</span>
                            <div className="flex items-center space-x-1 text-[9px]">
                              <Clock className="w-2.5 h-2.5 text-zinc-700" />
                              <span className="text-zinc-600">{formatDate(project.updated_at)}</span>
                            </div>
                            {project.status === 'exported' && (
                              <FileCheck className="w-2.5 h-2.5 text-green-600" />
                            )}
                            {projectExportCount > 0 && (
                              <div className="flex items-center space-x-0.5 text-[9px]">
                                <Download className="w-2.5 h-2.5 text-blue-500" />
                                <span className="text-blue-500">{projectExportCount}x</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Confirmacao de delete */}
                    {isDeleting && (
                      <div className="px-4 py-2 bg-red-950/30 border-t border-b border-red-500/20">
                        <p className="text-[9px] text-red-400 mb-1.5">Deletar "{project.name}"?</p>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="px-2.5 py-1 bg-red-600 text-white text-[9px] font-bold rounded hover:bg-red-500"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-2.5 py-1 text-zinc-500 text-[9px] hover:text-white"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/5">
        <p className="text-[8px] text-zinc-700">
          {activeSection === 'carrosseis'
            ? `outputs/copys/ · ${projects.length} projeto${projects.length !== 1 ? 's' : ''}`
            : 'Carrossel Studio v3'
          }
        </p>
      </div>
    </aside>
  );
};
