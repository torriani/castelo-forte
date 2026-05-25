import React, { useState, useRef, useEffect } from 'react';
import { CarouselTemplate, SlideData, BrandProfile } from '../types';
import { TwitterTemplate } from './templates/TwitterTemplate';
import { EditorialTemplate } from './templates/EditorialTemplate';

interface TemplateRendererProps {
  template: CarouselTemplate;
  slide: SlideData;
  brand: BrandProfile;
  isActive: boolean;
  onUpdate: (id: string, content: string) => void;
  slideRef?: (el: HTMLDivElement | null) => void;
  containerStyle?: React.CSSProperties;
  isExport?: boolean;
  slideNumber?: number;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  slide,
  brand,
  isActive,
  onUpdate,
  slideRef,
  containerStyle,
  isExport = false,
  slideNumber,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Container de export e 1080x1350 (2x do preview 540x675)
  const exportScale = isExport ? 2.0 : 1;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    if (!isExport) {
      setIsEditing(true);
    }
  };

  const isDark = slide.darkMode ?? template.dark_mode;
  const textClass = isDark ? 'text-white' : 'text-[#0f1419]';

  // Estética do slide (B-13 a B-18)
  const FONT_MAP: Record<string, string> = {
    system: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    chirp: '"Chirp", -apple-system, sans-serif',
    jakarta: '"Plus Jakarta Sans", sans-serif',
    montserrat: '"Montserrat", sans-serif',
    poppins: '"Poppins", sans-serif',
    serif: '"Playfair Display", Georgia, serif',
    ubuntu: '"Ubuntu", sans-serif',
    roboto: '"Roboto", sans-serif',
    arial: 'Arial, Helvetica, sans-serif',
  };
  const fontFamily = FONT_MAP[slide.fontFamily || 'system'] || FONT_MAP.system;
  const paddingPct = slide.paddingPct || 8;

  // Renderizar familia correta
  const renderTemplate = () => {
    if (isEditing && !isExport) {
      // Modo edicao inline
      const baseFontSize = slide.isHook ? 28 * exportScale : (slide.fontSize || template.zona_titulo?.tamanho || 22) * exportScale;
      return (
        <div className="flex-1 flex flex-col justify-center px-8 py-4 z-20">
          <textarea
            ref={textareaRef}
            value={slide.content}
            onChange={(e) => {
              onUpdate(slide.id, e.target.value);
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }
            }}
            onBlur={() => setIsEditing(false)}
            className={`bg-transparent outline-none resize-none overflow-hidden w-full ${textClass}`}
            style={{ fontSize: `${baseFontSize}px`, lineHeight: '1.45' }}
          />
        </div>
      );
    }

    switch (template.familia) {
      case 'twitter':
        return (
          <TwitterTemplate
            template={template}
            slide={slide}
            brand={brand}
            isExport={isExport}
            exportScale={exportScale}
            onStartEdit={handleStartEdit}
          />
        );

      case 'editorial':
        return (
          <EditorialTemplate
            template={template}
            slide={slide}
            brand={brand}
            slideNumber={slideNumber}
            isExport={isExport}
            exportScale={exportScale}
            onStartEdit={handleStartEdit}
          />
        );

      default:
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <p className="text-sm opacity-50">Template desconhecido: {template.familia}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`aspect-[4/5] relative shadow-2xl transition-all duration-300 ${
        isActive ? 'scale-100 z-20' : 'scale-95 opacity-40 z-10'
      } flex-shrink-0`}
      style={containerStyle || { height: 'auto', width: 'min(55vh, 80vw)', maxWidth: '540px' }}
    >
      <div
        ref={slideRef}
        className={`w-full h-full relative overflow-hidden flex flex-col ${
          isExport ? '' : 'rounded-[2rem]'
        } shadow-xl`}
        style={{
          backgroundColor: isDark
            ? (template.dark_mode ? template.background : '#000000')
            : (template.dark_mode ? '#ffffff' : template.background),
          fontFamily,
          padding: `${paddingPct}%`,
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};
