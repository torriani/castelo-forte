import React, { useState, useRef, useEffect } from 'react';
import { SlideData, BrandProfile } from '../types';
import { User, CheckCircle2 } from 'lucide-react';

interface PreviewSlideProps {
  slide: SlideData;
  brand: BrandProfile;
  isActive: boolean;
  onUpdate: (id: string, content: string) => void;
  slideRef?: (el: HTMLDivElement | null) => void;
  containerStyle?: React.CSSProperties;
  isExport?: boolean;
}

export const PreviewSlide: React.FC<PreviewSlideProps> = ({
  slide,
  brand,
  isActive,
  onUpdate,
  slideRef,
  containerStyle,
  isExport = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDark = slide.darkMode;
  const bgClass = isDark ? 'bg-black' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-[#0f1419]';
  const textSecondary = isDark ? 'text-gray-500' : 'text-[#536471]';

  const exportScale = isExport ? 1.3 : 1;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  // Renderiza paragrafos separados por \n
  const renderContent = (text: string) => {
    const paragraphs = text.split('\n').filter(p => p.trim());
    return paragraphs.map((para, i) => (
      <p key={i} className="leading-[1.45]">
        {para}
      </p>
    ));
  };

  const baseFontSize = slide.isHook ? 28 * exportScale : 22 * exportScale;

  return (
    <div
      className={`aspect-[4/5] relative shadow-2xl transition-all duration-300 ${
        isActive ? 'scale-100 z-20' : 'scale-95 opacity-40 z-10'
      } flex-shrink-0`}
      style={containerStyle || { height: 'auto', width: 'min(55vh, 80vw)', maxWidth: '540px' }}
    >
      <div
        ref={slideRef}
        className={`w-full h-full relative overflow-hidden flex flex-col ${bgClass} ${
          isExport ? '' : 'rounded-[2rem]'
        } shadow-xl`}
      >
        {/* Header — avatar + nome + @ */}
        <div className="w-full flex items-center space-x-3 px-8 pt-8 pb-4 shrink-0 z-20">
          <div className="relative shrink-0">
            {brand.avatarUrl ? (
              <img
                src={brand.avatarUrl}
                alt="Avatar"
                className="w-14 h-14 rounded-full object-cover"
                style={isExport ? { width: '4.5rem', height: '4.5rem' } : {}}
              />
            ) : (
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-white/10' : 'bg-black/5'
                }`}
                style={isExport ? { width: '4.5rem', height: '4.5rem' } : {}}
              >
                <User className={`w-7 h-7 ${textClass}`} />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-1.5">
              <span
                className={`font-bold leading-tight ${textClass}`}
                style={{ fontSize: `${16 * exportScale}px` }}
              >
                {brand.name}
              </span>
              {brand.isVerified && (
                <CheckCircle2
                  className="text-[#1D9BF0] fill-[#1D9BF0]"
                  style={{ width: `${18 * exportScale}px`, height: `${18 * exportScale}px` }}
                />
              )}
            </div>
            <span
              className={`${textSecondary} font-normal`}
              style={{ fontSize: `${14 * exportScale}px` }}
            >
              @{brand.handle}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center px-8 pb-8 z-20">
          {isEditing && !isExport ? (
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
              className={`bg-transparent outline-none resize-none overflow-hidden w-full ${textClass} ${
                slide.isHook ? 'font-bold' : 'font-normal'
              }`}
              style={{ fontSize: `${baseFontSize}px`, lineHeight: '1.45' }}
            />
          ) : (
            <div
              onClick={() => !isExport && setIsEditing(true)}
              className={`cursor-text flex flex-col gap-4 w-full ${textClass} ${
                slide.isHook ? 'font-bold' : 'font-normal'
              }`}
              style={{ fontSize: `${baseFontSize}px` }}
            >
              {renderContent(slide.content)}
            </div>
          )}
        </div>

        {/* Footer — paginacao */}
        {slide.footerText && (
          <div className={`px-8 pb-6 shrink-0 z-20 ${textSecondary}`}>
            <span style={{ fontSize: `${12 * exportScale}px` }}>{slide.footerText}</span>
          </div>
        )}
      </div>
    </div>
  );
};
