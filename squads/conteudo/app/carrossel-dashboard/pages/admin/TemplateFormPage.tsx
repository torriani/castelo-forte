import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { CarouselTemplate } from '../../types';
import {
  createTemplate,
  updateTemplate,
  checkSlugExists,
  fetchAllTemplatesAdmin,
} from '../../services/templates';
import { ZoneEditor, ZoneDefinition } from '../../components/admin/ZoneEditor';
import { TemplatePreview } from '../../components/admin/TemplatePreview';

// Gerar slug a partir do nome
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Converter zonas do formato ZoneDefinition para o formato do banco (zonas individuais)
function zonesToDbFormat(zones: ZoneDefinition[]): Partial<CarouselTemplate> {
  const result: Partial<CarouselTemplate> = {
    zona_header: null,
    zona_header_bar: null,
    zona_titulo: null,
    zona_subtitulo: null,
    zona_body: null,
    zona_imagem: null,
    zona_footer_bar: null,
  };

  for (const zone of zones) {
    if (zone.key === 'header' || zone.key.startsWith('header') && zone.type === 'avatar-row') {
      result.zona_header = {
        tipo: zone.type === 'avatar-row' ? 'avatar-row' : 'text',
        ativo: true,
        posicao: zone.position,
      };
    } else if (zone.key === 'header_bar' || (zone.key.startsWith('bar') && zone.position === 'top')) {
      result.zona_header_bar = {
        ativo: true,
        marca_posicao: 'left',
        linha_separadora: true,
      };
    } else if (zone.key === 'titulo' || zone.key.startsWith('titulo')) {
      result.zona_titulo = {
        cor: '#ffffff',
        peso: 'bold',
        ativo: true,
        fonte: zone.font || 'Inter',
        tamanho: zone.size === 'xl' ? 32 : zone.size === 'lg' ? 24 : zone.size === 'sm' ? 14 : 18,
        alinhamento: 'left',
        posicao: zone.position,
      };
    } else if (zone.key === 'subtitulo' || zone.key.startsWith('subtitulo')) {
      result.zona_subtitulo = {
        cor: '#a1a1aa',
        peso: 'normal',
        ativo: true,
        fonte: zone.font || 'Inter',
        tamanho: zone.size === 'lg' ? 18 : zone.size === 'sm' ? 11 : 14,
        alinhamento: 'left',
        posicao: zone.position,
      };
    } else if (zone.key === 'body' || zone.key.startsWith('body') || zone.key.startsWith('text')) {
      result.zona_body = {
        cor: '#d4d4d8',
        peso: 'normal',
        ativo: true,
        fonte: zone.font || 'Inter',
        tamanho: zone.size === 'lg' ? 18 : zone.size === 'sm' ? 12 : 15,
        alinhamento: 'left',
        posicao: zone.position,
      };
    } else if (zone.key === 'imagem' || zone.key.startsWith('imagem') || zone.type === 'image') {
      result.zona_imagem = {
        ativo: true,
        formato: 'cover',
        overlay: false,
        posicao: zone.position,
        quantidade: 1,
      };
    } else if (zone.key === 'footer_bar' || (zone.key.startsWith('bar') && zone.position === 'bottom')) {
      result.zona_footer_bar = {
        ativo: true,
        icone_posicao: 'left',
        marca_posicao: 'right',
      };
    }
  }

  return result;
}

// Converter zonas do banco para formato ZoneDefinition
function dbToZones(template: CarouselTemplate): ZoneDefinition[] {
  const zones: ZoneDefinition[] = [];

  if (template.zona_header?.ativo) {
    zones.push({
      key: 'header',
      type: template.zona_header.tipo === 'avatar-row' ? 'avatar-row' : 'text',
      position: (template.zona_header.posicao as any) || 'top',
      size: 'md',
    });
  }

  if (template.zona_header_bar?.ativo) {
    zones.push({
      key: 'header_bar',
      type: 'bar',
      position: 'top',
      size: 'sm',
    });
  }

  if (template.zona_titulo?.ativo) {
    const t = template.zona_titulo;
    zones.push({
      key: 'titulo',
      type: 'text',
      position: (t.posicao as any) || 'top',
      font: t.fonte,
      size: t.tamanho >= 28 ? 'xl' : t.tamanho >= 20 ? 'lg' : t.tamanho >= 16 ? 'md' : 'sm',
    });
  }

  if (template.zona_subtitulo?.ativo) {
    const s = template.zona_subtitulo;
    zones.push({
      key: 'subtitulo',
      type: 'text',
      position: (s.posicao as any) || 'center',
      font: s.fonte,
      size: s.tamanho >= 16 ? 'lg' : s.tamanho >= 13 ? 'md' : 'sm',
    });
  }

  if (template.zona_body?.ativo) {
    const b = template.zona_body;
    zones.push({
      key: 'body',
      type: 'text',
      position: (b.posicao as any) || 'center',
      font: b.fonte,
      size: b.tamanho >= 16 ? 'lg' : b.tamanho >= 14 ? 'md' : 'sm',
    });
  }

  if (template.zona_imagem?.ativo) {
    zones.push({
      key: 'imagem',
      type: 'image',
      position: (template.zona_imagem.posicao as any) || 'center',
      size: 'lg',
    });
  }

  if (template.zona_footer_bar?.ativo) {
    zones.push({
      key: 'footer_bar',
      type: 'bar',
      position: 'bottom',
      size: 'sm',
    });
  }

  return zones;
}

interface FormState {
  nome: string;
  slug: string;
  familia: 'twitter' | 'editorial';
  descricao: string;
  background: string;
  proporcao: string;
  dark_mode: boolean;
  ordem: number;
  zones: ZoneDefinition[];
}

const DEFAULT_FORM: FormState = {
  nome: '',
  slug: '',
  familia: 'twitter',
  descricao: '',
  background: '#000000',
  proporcao: '4:5',
  dark_mode: true,
  ordem: 10,
  zones: [],
};

export const TemplateFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Carregar template existente para edicao
  useEffect(() => {
    if (!id) return;

    const loadTemplate = async () => {
      setLoadingTemplate(true);
      try {
        const all = await fetchAllTemplatesAdmin();
        const template = all.find((t) => t.id === id);
        if (!template) {
          setError('Template nao encontrado');
          return;
        }

        setForm({
          nome: template.nome,
          slug: template.slug,
          familia: template.familia,
          descricao: template.descricao || '',
          background: template.background,
          proporcao: template.proporcao,
          dark_mode: template.dark_mode,
          ordem: template.ordem,
          zones: dbToZones(template),
        });
        setSlugManuallyEdited(true); // Nao auto-gerar slug ao editar
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar template');
      } finally {
        setLoadingTemplate(false);
      }
    };

    loadTemplate();
  }, [id]);

  // Auto-gerar slug a partir do nome
  const handleNomeChange = (nome: string) => {
    setForm((prev) => ({
      ...prev,
      nome,
      slug: slugManuallyEdited ? prev.slug : slugify(nome),
    }));
  };

  const handleSlugChange = (slug: string) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug: slugify(slug) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validacoes
    if (!form.nome.trim()) {
      setError('Nome e obrigatorio');
      return;
    }

    if (!form.slug.trim()) {
      setError('Slug e obrigatorio');
      return;
    }

    if (form.zones.length === 0) {
      setError('Adicione pelo menos 1 zona ao template');
      return;
    }

    setLoading(true);

    try {
      // Verificar slug unico
      const slugExists = await checkSlugExists(form.slug, id);
      if (slugExists) {
        setError(`Slug "${form.slug}" ja esta em uso. Escolha outro.`);
        setLoading(false);
        return;
      }

      // Converter zonas para formato do banco
      const zonesDb = zonesToDbFormat(form.zones);

      const templateData = {
        nome: form.nome.trim(),
        slug: form.slug.trim(),
        familia: form.familia,
        descricao: form.descricao.trim() || null,
        background: form.background,
        proporcao: form.proporcao,
        dark_mode: form.dark_mode,
        ordem: form.ordem,
        ...zonesDb,
      };

      if (isEditing) {
        await updateTemplate(id!, templateData);
      } else {
        await createTemplate(templateData as any);
      }

      navigate('/admin/templates');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar template');
    } finally {
      setLoading(false);
    }
  };

  if (loadingTemplate) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <button
            type="button"
            onClick={() => navigate('/admin/templates')}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-white font-bold text-lg">
              {isEditing ? 'Editar Template' : 'Novo Template'}
            </h1>
            <p className="text-zinc-500 text-xs">
              {isEditing ? 'Modifique os campos e salve' : 'Preencha os campos para criar um novo template'}
            </p>
          </div>
        </div>

        {/* Layout side-by-side: form | preview */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Coluna esquerda: formulario */}
          <form onSubmit={handleSubmit} className="flex-1 min-w-0 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            {/* Campos basicos */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => handleNomeChange(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
                    placeholder="Twitter Black"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-zinc-600 transition-colors"
                    placeholder="twitter-black"
                  />
                  <p className="text-[10px] text-zinc-600 mt-1">Auto-gerado a partir do nome</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Familia */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">
                    Familia *
                  </label>
                  <select
                    value={form.familia}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, familia: e.target.value as 'twitter' | 'editorial' }))
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
                  >
                    <option value="twitter">Twitter</option>
                    <option value="editorial">Editorial</option>
                  </select>
                </div>

                {/* Background */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">
                    Background
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={form.background}
                      onChange={(e) => setForm((prev) => ({ ...prev, background: e.target.value }))}
                      className="w-8 h-8 rounded border border-zinc-700 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.background}
                      onChange={(e) => setForm((prev) => ({ ...prev, background: e.target.value }))}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-zinc-600 transition-colors"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Proporcao */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">
                    Proporcao
                  </label>
                  <select
                    value={form.proporcao}
                    onChange={(e) => setForm((prev) => ({ ...prev, proporcao: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
                  >
                    <option value="4:5">4:5 (Instagram)</option>
                    <option value="1:1">1:1 (Quadrado)</option>
                    <option value="16:9">16:9 (Widescreen)</option>
                    <option value="9:16">9:16 (Story)</option>
                  </select>
                </div>

                {/* Ordem */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">
                    Ordem
                  </label>
                  <input
                    type="number"
                    value={form.ordem}
                    onChange={(e) => setForm((prev) => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
                    min="0"
                  />
                </div>

                {/* Dark mode */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">
                    Modo Escuro
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, dark_mode: !prev.dark_mode }))}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      form.dark_mode
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    {form.dark_mode ? 'Ativado' : 'Desativado'}
                  </button>
                </div>
              </div>

              {/* Descricao */}
              <div>
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">
                  Descricao
                </label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => setForm((prev) => ({ ...prev, descricao: e.target.value }))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                  rows={2}
                  placeholder="Descricao opcional do template..."
                />
              </div>
            </div>

            {/* Separador */}
            <div className="border-t border-zinc-800" />

            {/* Editor de zonas */}
            <ZoneEditor zones={form.zones} onChange={(zones) => setForm((prev) => ({ ...prev, zones }))} />

            {/* Botoes */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => navigate('/admin/templates')}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{isEditing ? 'Salvar Alteracoes' : 'Criar Template'}</span>
              </button>
            </div>
          </form>

          {/* Coluna direita: preview em tempo real */}
          <div className="lg:w-[420px] shrink-0">
            <div className="lg:sticky lg:top-6">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3 block">
                Preview em Tempo Real
              </label>
              <TemplatePreview
                nome={form.nome}
                familia={form.familia}
                background={form.background}
                darkMode={form.dark_mode}
                proporcao={form.proporcao}
                zones={form.zones}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
