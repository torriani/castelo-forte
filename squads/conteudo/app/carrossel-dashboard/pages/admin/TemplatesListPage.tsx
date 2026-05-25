import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, LayoutTemplate, Eye, EyeOff } from 'lucide-react';
import { CarouselTemplate } from '../../types';
import { fetchAllTemplatesAdmin, deleteTemplate, updateTemplate } from '../../services/templates';

export const TemplatesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<CarouselTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllTemplatesAdmin();
      setTemplates(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id);
      setDeleteConfirm(null);
      loadTemplates();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar template');
    }
  };

  const handleToggleAtivo = async (template: CarouselTemplate) => {
    try {
      await updateTemplate(template.id, { ativo: !template.ativo });
      loadTemplates();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar template');
    }
  };

  // Contar zonas ativas de um template
  const countZones = (template: CarouselTemplate): number => {
    let count = 0;
    if (template.zona_header?.ativo) count++;
    if (template.zona_header_bar?.ativo) count++;
    if (template.zona_titulo?.ativo) count++;
    if (template.zona_subtitulo?.ativo) count++;
    if (template.zona_body?.ativo) count++;
    if (template.zona_imagem?.ativo) count++;
    if (template.zona_footer_bar?.ativo) count++;
    return count;
  };

  // Gerar mini preview das zonas
  const ZonePreview: React.FC<{ template: CarouselTemplate }> = ({ template }) => {
    const zones: { name: string; active: boolean; color: string }[] = [
      { name: 'header', active: !!template.zona_header?.ativo, color: 'bg-blue-500' },
      { name: 'header_bar', active: !!template.zona_header_bar?.ativo, color: 'bg-purple-500' },
      { name: 'titulo', active: !!template.zona_titulo?.ativo, color: 'bg-amber-500' },
      { name: 'subtitulo', active: !!template.zona_subtitulo?.ativo, color: 'bg-orange-500' },
      { name: 'body', active: !!template.zona_body?.ativo, color: 'bg-green-500' },
      { name: 'imagem', active: !!template.zona_imagem?.ativo, color: 'bg-pink-500' },
      { name: 'footer_bar', active: !!template.zona_footer_bar?.ativo, color: 'bg-cyan-500' },
    ];

    return (
      <div
        className="w-full aspect-[4/5] rounded-md border border-zinc-800 flex flex-col overflow-hidden"
        style={{ background: template.background || '#000' }}
      >
        {zones
          .filter((z) => z.active)
          .map((zone) => (
            <div
              key={zone.name}
              className={`flex-1 ${zone.color} opacity-30 border-b border-black/20 flex items-center justify-center`}
            >
              <span className="text-[7px] text-white/80 font-mono">{zone.name}</span>
            </div>
          ))}
        {zones.filter((z) => z.active).length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[8px] text-zinc-600">Sem zonas</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-bold text-lg">Templates</h1>
          <p className="text-zinc-500 text-xs mt-1">
            {templates.length} template{templates.length !== 1 ? 's' : ''} cadastrado{templates.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/templates/new')}
          className="flex items-center space-x-2 px-3 py-2 bg-white text-black rounded-lg text-xs font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Template</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      {/* Grid de templates */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`group relative bg-zinc-900/50 border rounded-lg p-3 transition-all hover:border-zinc-600 ${
              template.ativo === false
                ? 'border-zinc-800/50 opacity-60'
                : 'border-zinc-800'
            }`}
          >
            {/* Preview thumbnail */}
            <div className="mb-3">
              <ZonePreview template={template} />
            </div>

            {/* Info */}
            <div className="space-y-1">
              <h3 className="text-white text-xs font-medium truncate">{template.nome}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-mono text-zinc-500">{template.slug}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                    template.familia === 'twitter'
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}
                >
                  {template.familia}
                </span>
                <span className="text-[9px] text-zinc-600">
                  {countZones(template)} zona{countZones(template) !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Acoes (hover) */}
            <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleToggleAtivo(template)}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors"
                title={template.ativo === false ? 'Ativar' : 'Desativar'}
              >
                {template.ativo === false ? (
                  <EyeOff className="w-3 h-3" />
                ) : (
                  <Eye className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => navigate(`/admin/templates/${template.id}/edit`)}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors"
                title="Editar"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                onClick={() => setDeleteConfirm(template.id)}
                className="p-1.5 bg-zinc-800 hover:bg-red-900/50 rounded text-zinc-400 hover:text-red-400 transition-colors"
                title="Deletar"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Badge inativo */}
            {template.ativo === false && (
              <div className="absolute top-2 left-2">
                <span className="text-[8px] bg-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded uppercase font-bold">
                  Inativo
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {templates.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <LayoutTemplate className="w-10 h-10 text-zinc-700 mb-3" />
          <p className="text-zinc-500 text-xs mb-4">Nenhum template cadastrado.</p>
          <button
            onClick={() => navigate('/admin/templates/new')}
            className="flex items-center space-x-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Criar primeiro template</span>
          </button>
        </div>
      )}

      {/* Modal de confirmacao de delete */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 max-w-sm w-full mx-4">
            <h3 className="text-white font-bold text-sm mb-2">Confirmar exclusao</h3>
            <p className="text-zinc-400 text-xs mb-4">
              O template sera desativado e nao aparecera mais para os usuarios. Deseja continuar?
            </p>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-md text-xs hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors"
              >
                Desativar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
