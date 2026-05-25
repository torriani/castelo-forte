import React from 'react';
import { CarouselTemplate, SlideData, BrandProfile } from '../../types';
import { ZoneHeaderBar, ZoneText, ZoneImage, ZoneFooterBar } from './ZoneRenderer';

interface EditorialTemplateProps {
  template: CarouselTemplate;
  slide: SlideData;
  brand: BrandProfile;
  slideNumber?: number;
  isExport?: boolean;
  exportScale?: number;
  onStartEdit?: () => void;
}

export const EditorialTemplate: React.FC<EditorialTemplateProps> = ({
  template,
  slide,
  brand,
  slideNumber,
  isExport = false,
  exportScale = 1,
  onStartEdit,
}) => {
  const isDark = slide.darkMode ?? template.dark_mode;
  const isCapa = template.slug === 'post-imagem-capa';
  const customFontSize = slide.fontSize;

  // Separar conteudo em titulo e body
  // Primeira linha = titulo, resto = body
  const contentLines = slide.content.split('\n').filter(l => l.trim());
  const titleContent = contentLines[0] || '';
  const bodyContent = contentLines.slice(1).join('\n');

  return (
    <>
      {/* Imagem fullscreen (post-imagem-capa) */}
      {template.zona_imagem && isCapa && (
        <ZoneImage
          config={template.zona_imagem}
          imageUrl={slide.imageUrl}
          exportScale={exportScale}
        />
      )}

      {/* Header bar */}
      {template.zona_header_bar && (
        <ZoneHeaderBar
          config={template.zona_header_bar}
          brand={brand}
          isDark={isDark}
          exportScale={exportScale}
        />
      )}

      {/* Imagem top (post-imagem-interna-foto) */}
      {template.zona_imagem && !isCapa && template.zona_imagem.posicao === 'top' && (
        <ZoneImage
          config={template.zona_imagem}
          imageUrl={slide.imageUrl}
          exportScale={exportScale}
        />
      )}

      {/* Conteudo central */}
      <div className={`flex-1 flex flex-col ${isCapa ? 'justify-end' : 'justify-center'} px-8 z-20 gap-4`}>
        {/* Titulo */}
        {template.zona_titulo && (
          <ZoneText
            config={{ ...template.zona_titulo, tamanho: customFontSize || template.zona_titulo.tamanho }}
            content={titleContent}
            slideNumber={slideNumber}
            exportScale={exportScale}
            isExport={isExport}
            onStartEdit={onStartEdit}
          />
        )}

        {/* Subtitulo */}
        {template.zona_subtitulo && (
          <ZoneText
            config={template.zona_subtitulo}
            content={isCapa ? bodyContent : ''}
            exportScale={exportScale}
            isExport={isExport}
          />
        )}

        {/* Body (nao-capa) */}
        {template.zona_body && !isCapa && (
          <ZoneText
            config={template.zona_body}
            content={bodyContent}
            exportScale={exportScale}
            isExport={isExport}
          />
        )}
      </div>

      {/* Imagem bottom */}
      {template.zona_imagem && !isCapa && template.zona_imagem.posicao === 'bottom' && (
        <ZoneImage
          config={template.zona_imagem}
          imageUrl={slide.imageUrl}
          exportScale={exportScale}
        />
      )}

      {/* Footer bar */}
      {template.zona_footer_bar && (
        <ZoneFooterBar
          config={template.zona_footer_bar}
          brand={brand}
          isDark={isDark}
          footerText={slide.footerText}
          exportScale={exportScale}
        />
      )}

      {/* Se nao tem footer_bar, mostrar paginacao simples */}
      {!template.zona_footer_bar && slide.footerText && (
        <div className="px-8 pb-6 shrink-0 z-20">
          <span
            className="text-center block"
            style={{
              fontSize: `${10 * exportScale}px`,
              color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            }}
          >
            {slide.footerText}
          </span>
        </div>
      )}
    </>
  );
};
