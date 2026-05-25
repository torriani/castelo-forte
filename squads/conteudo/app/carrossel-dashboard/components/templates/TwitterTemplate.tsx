import React from 'react';
import { CarouselTemplate, SlideData, BrandProfile } from '../../types';
import { ZoneAvatar, ZoneText, ZoneImage, ZoneFooterSimple } from './ZoneRenderer';

interface TwitterTemplateProps {
  template: CarouselTemplate;
  slide: SlideData;
  brand: BrandProfile;
  isExport?: boolean;
  exportScale?: number;
  onStartEdit?: () => void;
}

export const TwitterTemplate: React.FC<TwitterTemplateProps> = ({
  template,
  slide,
  brand,
  isExport = false,
  exportScale = 1,
  onStartEdit,
}) => {
  const isDark = slide.darkMode ?? template.dark_mode;
  const customFontSize = slide.fontSize;

  return (
    <>
      {/* Header: avatar row */}
      {template.zona_header && (
        <ZoneAvatar
          config={template.zona_header}
          brand={brand}
          isDark={isDark}
          exportScale={exportScale}
        />
      )}

      {/* Content area */}
      <div className="flex-1 flex flex-col justify-center px-8 pb-4 z-20">
        {/* Titulo (conteudo principal no twitter) */}
        {template.zona_titulo && (
          <ZoneText
            config={{
              ...template.zona_titulo,
              // Hook slides usam tamanho maior, custom fontSize tem prioridade
              tamanho: customFontSize || (slide.isHook ? 28 : template.zona_titulo.tamanho),
              peso: slide.isHook ? 'bold' : template.zona_titulo.peso,
            }}
            content={slide.content}
            exportScale={exportScale}
            isExport={isExport}
            onStartEdit={onStartEdit}
          />
        )}

        {/* Subtitulo (nao usado nos slides de conteudo, mas disponivel) */}
      </div>

      {/* Imagem (se tiver) */}
      {template.zona_imagem && slide.imageUrl && (
        <ZoneImage
          config={template.zona_imagem}
          imageUrl={slide.imageUrl}
          exportScale={exportScale}
        />
      )}

      {/* Footer: paginacao simples */}
      <ZoneFooterSimple
        footerText={slide.footerText}
        isDark={isDark}
        exportScale={exportScale}
      />
    </>
  );
};
