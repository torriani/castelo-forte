import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, Tag } from 'lucide-react';
import { CarouselTemplate, SlideData, BrandProfile } from '../../types';
import { TemplateRenderer } from '../TemplateRenderer';
import { ZoneDefinition } from './ZoneEditor';

// Dados de exemplo em pt-BR para preview
const MOCK_DATA: Record<string, string> = {
  titulo: 'O segredo que ninguem conta sobre crescimento organico',
  subtitulo: '3 passos para transformar seu negocio digital',
  body: 'A maioria dos empreendedores gasta tempo demais tentando hackear o algoritmo.\n\nA verdade e que conteudo de qualidade, publicado com consistencia, supera qualquer truque.',
  header: 'Joao Silva',
  header_bar: 'MARCA',
  footer_bar: 'Salve para depois',
  imagem: '',
};

const MOCK_BRAND: BrandProfile = {
  name: 'Joao Silva',
  handle: 'joaosilva',
  avatarUrl: '',
  isVerified: true,
  marcaNome: 'STUDIO JS',
  tagline: 'Conteudo que converte',
  categoria: 'Marketing Digital',
  corAccent: '#3b82f6',
};

interface TemplatePreviewProps {
  nome: string;
  familia: 'twitter' | 'editorial';
  background: string;
  darkMode: boolean;
  proporcao: string;
  zones: ZoneDefinition[];
}

// Converte ZoneDefinition[] para formato CarouselTemplate parcial (zonas)
function zonesToTemplateFormat(zones: ZoneDefinition[]): Partial<CarouselTemplate> {
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
    if (zone.key === 'header' || (zone.key.startsWith('header') && zone.type === 'avatar-row')) {
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

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  nome,
  familia,
  background,
  darkMode,
  proporcao,
  zones,
}) => {
  const [showMockData, setShowMockData] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Montar template completo a partir das props do formulario
  const template = useMemo<CarouselTemplate>(() => {
    const zonesFormatted = zonesToTemplateFormat(zones);
    return {
      id: 'preview',
      slug: 'preview',
      nome: nome || 'Preview',
      familia,
      descricao: null,
      background,
      proporcao,
      dark_mode: darkMode,
      ordem: 0,
      ...zonesFormatted,
    } as CarouselTemplate;
  }, [nome, familia, background, darkMode, proporcao, zones]);

  // Montar slide com dados mock ou vazios
  const slide = useMemo<SlideData>(() => {
    const content = showMockData
      ? MOCK_DATA.titulo
      : '';

    return {
      id: 'preview-slide',
      content,
      isHook: true,
      darkMode,
      footerText: '1 / 8',
      templateSlug: 'preview',
    };
  }, [showMockData, darkMode]);

  // Brand mock
  const brand = useMemo<BrandProfile>(() => {
    if (!showMockData) {
      return {
        name: '',
        handle: '',
        avatarUrl: '',
        isVerified: false,
        marcaNome: '',
        tagline: '',
      };
    }
    return MOCK_BRAND;
  }, [showMockData]);

  // Zonas ativas para labels
  const activeZones = zones.filter((z) => z.key);

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Controles do preview */}
      <div className="flex items-center space-x-2 w-full">
        <button
          type="button"
          onClick={() => setShowMockData(!showMockData)}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
            showMockData
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
          }`}
          title={showMockData ? 'Mostrar campos vazios' : 'Mostrar dados de exemplo'}
        >
          {showMockData ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{showMockData ? 'Dados de exemplo' : 'Campos vazios'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowLabels(!showLabels)}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
            showLabels
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
          }`}
          title={showLabels ? 'Ocultar labels das zonas' : 'Mostrar labels das zonas'}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Labels</span>
        </button>
      </div>

      {/* Preview container com aspect ratio 4:5 */}
      <div className="relative w-full max-w-[360px]">
        {/* Labels overlay */}
        {showLabels && activeZones.length > 0 && (
          <div className="absolute -left-2 top-0 bottom-0 z-30 flex flex-col justify-center pointer-events-none">
            {activeZones.map((zone, i) => (
              <div
                key={`${zone.key}-${i}`}
                className="flex items-center space-x-1 mb-1"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      zone.type === 'text'
                        ? '#3b82f6'
                        : zone.type === 'image'
                        ? '#10b981'
                        : zone.type === 'bar'
                        ? '#f59e0b'
                        : '#8b5cf6',
                  }}
                />
                <span className="text-[9px] font-mono text-zinc-500 whitespace-nowrap bg-zinc-950/80 px-1 rounded">
                  {zone.key}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Renderizador de template */}
        {zones.length > 0 ? (
          <TemplateRenderer
            template={template}
            slide={slide}
            brand={brand}
            isActive={true}
            onUpdate={() => {}}
            containerStyle={{
              width: '100%',
              height: 'auto',
              maxWidth: '360px',
            }}
          />
        ) : (
          <div
            className="aspect-[4/5] w-full rounded-2xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center space-y-3"
            style={{ backgroundColor: background }}
          >
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
              <Eye className="w-6 h-6 text-zinc-600" />
            </div>
            <div className="text-center px-6">
              <p className="text-zinc-500 text-xs font-medium">Nenhuma zona definida</p>
              <p className="text-zinc-600 text-[10px] mt-1">
                Adicione zonas no formulario para visualizar o preview
              </p>
            </div>
          </div>
        )}

        {/* Indicador de zonas sem conteudo (quando dados vazios) */}
        {!showMockData && zones.length > 0 && (
          <div className="absolute inset-0 pointer-events-none rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-zinc-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-zinc-700">
                <p className="text-zinc-400 text-[10px] text-center">
                  Campos vazios — ative "Dados de exemplo" para visualizar
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info do template */}
      <div className="w-full max-w-[360px] flex items-center justify-between text-[10px] text-zinc-600">
        <span>
          {familia} / {proporcao} / {darkMode ? 'dark' : 'light'}
        </span>
        <span>{zones.length} zona{zones.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
};
