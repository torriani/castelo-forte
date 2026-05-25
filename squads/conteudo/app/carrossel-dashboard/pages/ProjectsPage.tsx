import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, FolderOpen, Layout, X, ArrowRight,
  Trash2, Pencil, Clock, FileCheck, File, Download,
} from 'lucide-react';
import { useTemplates } from '../hooks/useTemplates';
import { useProjects } from '../hooks/useProjects';
import { useExports } from '../hooks/useExports';
import { useAuth } from '../hooks/useAuth';
import { CarouselTemplate } from '../types';
import { DbProject } from '../services/supabase';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { templates, loading: templatesLoading } = useTemplates();
  const {
    projects,
    loading: projectsLoading,
    createProject,
    deleteProject,
    updateProject,
  } = useProjects();
  const { exportCounts } = useExports();

  const [showWizard, setShowWizard] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('twitter-branco');

  // Renomear
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Deletar
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const twitterTemplates = templates.filter(t => t.familia === 'twitter');
  const editorialTemplates = templates.filter(t => t.familia === 'editorial');

  const handleCreate = async () => {
    if (!projectName.trim() || !user) return;

    try {
      const defaultSlide = {
        id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        content: '',
        isHook: true,
        darkMode: false,
        footerText: '1/1',
        templateSlug: selectedTemplate,
      };

      const dbProject = await createProject(
        projectName.trim(),
        selectedTemplate,
        [defaultSlide],
        null,
      );

      setShowWizard(false);
      setProjectName('');
      // Navegar para o editor com o UUID do banco
      navigate(`/editor/${dbProject.id}`);
    } catch (err) {
      console.error('Erro ao criar projeto:', err);
      alert('Erro ao criar projeto. Tente novamente.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && projectName.trim()) {
      handleCreate();
    }
  };

  const handleOpenProject = (project: DbProject) => {
    navigate(`/editor/${project.id}`);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      setDeletingId(null);
    } catch (err) {
      console.error('Erro ao deletar projeto:', err);
      alert('Erro ao deletar. Tente novamente.');
    }
  };

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) return;
    try {
      await updateProject(id, { name: renameValue.trim() });
      setRenamingId(null);
      setRenameValue('');
    } catch (err) {
      console.error('Erro ao renomear:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  const renderProjectCard = (project: DbProject) => {
    const isDeleting = deletingId === project.id;
    const isRenaming = renamingId === project.id;
    const slideCount = Array.isArray(project.slides) ? project.slides.length : 0;
    const projectExportCount = exportCounts[project.id] || 0;

    return (
      <div
        key={project.id}
        className="group bg-[#09090b] border border-white/5 rounded-xl hover:border-white/15 transition-all cursor-pointer overflow-hidden"
      >
        {/* Thumbnail / preview area */}
        <div
          onClick={() => handleOpenProject(project)}
          className="h-32 bg-[#121214] flex items-center justify-center border-b border-white/5"
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-zinc-600">
              {Array.from({ length: Math.min(slideCount, 5) }).map((_, i) => (
                <div key={i} className="w-5 h-6 bg-zinc-800 rounded-[2px] border border-white/5" />
              ))}
              {slideCount > 5 && (
                <span className="text-[9px] text-zinc-700 ml-1">+{slideCount - 5}</span>
              )}
            </div>
            <span className="text-[9px] text-zinc-700 mt-2 block">{slideCount} slides</span>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-3">
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
                className="flex-1 bg-[#121214] border border-white/20 rounded px-2 py-1 text-xs text-white outline-none focus:border-white/40"
                autoFocus
              />
              <button
                onClick={() => handleRename(project.id)}
                className="text-green-500 hover:text-green-400 text-[10px] font-bold"
              >
                OK
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h3
                onClick={() => handleOpenProject(project)}
                className="text-white text-xs font-bold truncate flex-1 mr-2"
              >
                {project.name}
              </h3>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenamingId(project.id);
                    setRenameValue(project.name);
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded text-zinc-600 hover:text-white hover:bg-white/10"
                  title="Renomear"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingId(project.id);
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10"
                  title="Deletar"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3 mt-2">
            <div className="flex items-center space-x-1 text-[9px] text-zinc-600">
              <Clock className="w-3 h-3" />
              <span>{formatDate(project.updated_at)}</span>
            </div>
            <div className="flex items-center space-x-1 text-[9px]">
              {project.status === 'exported' ? (
                <>
                  <FileCheck className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">Exportado</span>
                </>
              ) : (
                <>
                  <File className="w-3 h-3 text-zinc-600" />
                  <span className="text-zinc-600">Rascunho</span>
                </>
              )}
            </div>
            {projectExportCount > 0 && (
              <div className="flex items-center space-x-1 text-[9px]">
                <Download className="w-3 h-3 text-blue-500" />
                <span className="text-blue-500">{projectExportCount}x</span>
              </div>
            )}
          </div>
        </div>

        {/* Confirmacao de delete */}
        {isDeleting && (
          <div className="px-4 py-3 bg-red-950/30 border-t border-red-500/20">
            <p className="text-[10px] text-red-400 mb-2">Deletar "{project.name}"?</p>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project.id);
                }}
                className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded hover:bg-red-500"
              >
                Confirmar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingId(null);
                }}
                className="px-3 py-1 text-zinc-500 text-[10px] hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-bold text-lg">Meus Projetos</h1>
          <p className="text-zinc-500 text-xs mt-1">
            {projects.length} projeto{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-black rounded-lg font-bold text-xs hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo carrossel</span>
        </button>
      </div>

      {/* Loading */}
      {projectsLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!projectsLoading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <FolderOpen className="w-12 h-12 text-zinc-700 mb-4" />
          <h2 className="text-white font-bold text-sm mb-2">Nenhum projeto ainda</h2>
          <p className="text-zinc-500 text-xs max-w-xs text-center mb-6">
            Crie seu primeiro carrossel clicando no botao acima.
          </p>
        </div>
      )}

      {/* Grid de projetos */}
      {!projectsLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map(renderProjectCard)}
        </div>
      )}

      {/* Wizard modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#09090b] border border-white/10 rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-zinc-400" />
                <span className="text-white font-bold text-sm">Novo carrossel</span>
              </div>
              <button
                onClick={() => setShowWizard(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Nome do projeto */}
              <div className="space-y-2">
                <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  Nome do projeto
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ex: Carrossel Black Friday, Post Semanal..."
                  className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-zinc-700 transition-colors"
                  autoFocus
                />
              </div>

              {/* Template default */}
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
                  <div className="space-y-4 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {renderTemplatePicker(twitterTemplates, 'Twitter')}
                    {renderTemplatePicker(editorialTemplates, 'Editorial')}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowWizard(false)}
                className="px-4 py-2 text-xs text-zinc-500 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
