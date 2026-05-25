import React from 'react';
import { ZonaTexto, ZonaImagem, ZonaHeader, ZonaHeaderBar, ZonaFooterBar, BrandProfile } from '../../types';

// Fallback visual quando zona nao tem conteudo
const ZoneFallback: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center justify-center py-3 opacity-30">
    <span className="text-xs italic text-current">{label}</span>
  </div>
);

// Zona: Avatar row (twitter)
export const ZoneAvatar: React.FC<{
  config: ZonaHeader;
  brand: BrandProfile;
  isDark: boolean;
  exportScale?: number;
}> = ({ config, brand, isDark, exportScale = 1 }) => {
  if (!config.ativo) return null;

  const textClass = isDark ? 'text-white' : 'text-[#0f1419]';
  const textSecondary = isDark ? 'text-gray-500' : 'text-[#536471]';

  return (
    <div className="w-full flex items-center space-x-3 px-8 pt-8 pb-4 shrink-0 z-20">
      <div className="relative shrink-0">
        {brand.avatarUrl ? (
          <img
            src={brand.avatarUrl}
            alt="Avatar"
            className="rounded-full object-cover"
            style={{
              width: `${3.5 * exportScale}rem`,
              height: `${3.5 * exportScale}rem`,
            }}
          />
        ) : (
          <div
            className={`rounded-full flex items-center justify-center ${
              isDark ? 'bg-white/10' : 'bg-black/5'
            }`}
            style={{
              width: `${3.5 * exportScale}rem`,
              height: `${3.5 * exportScale}rem`,
            }}
          >
            <svg
              className={textClass}
              style={{ width: `${1.75 * exportScale}rem`, height: `${1.75 * exportScale}rem` }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
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
            <svg
              className="text-[#1D9BF0] fill-[#1D9BF0]"
              style={{ width: `${18 * exportScale}px`, height: `${18 * exportScale}px` }}
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
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
  );
};

// Zona: Header Bar (editorial)
export const ZoneHeaderBar: React.FC<{
  config: ZonaHeaderBar;
  brand: BrandProfile;
  isDark: boolean;
  exportScale?: number;
}> = ({ config, brand, isDark, exportScale = 1 }) => {
  if (!config.ativo) return null;

  const textColor = isDark ? '#FFFFFF' : '#1a1a1a';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <div className="px-8 pt-6 pb-4 shrink-0 z-20">
      <div
        className="flex items-center justify-between pb-3"
        style={{ borderBottom: config.linha_separadora ? `1px solid ${borderColor}` : 'none' }}
      >
        <div className="flex items-center space-x-2">
          {brand.marcaIconeUrl ? (
            <img
              src={brand.marcaIconeUrl}
              alt="marca"
              className="object-contain"
              style={{ height: `${20 * exportScale}px` }}
            />
          ) : (
            <span
              className="font-bold uppercase tracking-wider"
              style={{
                fontSize: `${12 * exportScale}px`,
                color: brand.corAccent || textColor,
              }}
            >
              {brand.marcaNome || brand.name}
            </span>
          )}
        </div>
        {config.categoria_posicao && brand.categoria && (
          <span
            className="font-bold uppercase tracking-wider"
            style={{
              fontSize: `${10 * exportScale}px`,
              color: brand.corAccent || textColor,
              opacity: 0.7,
            }}
          >
            {brand.categoria}
          </span>
        )}
      </div>
    </div>
  );
};

// Zona: Texto (titulo, subtitulo, body)
export const ZoneText: React.FC<{
  config: ZonaTexto;
  content: string;
  slideNumber?: number;
  exportScale?: number;
  isEditing?: boolean;
  onStartEdit?: () => void;
  isExport?: boolean;
}> = ({ config, content, slideNumber, exportScale = 1, isEditing, onStartEdit, isExport }) => {
  if (!config.ativo) return null;

  if (!content) {
    return <ZoneFallback label="texto" />;
  }

  const fontFamily = config.fonte === 'PT Serif' ? "'PT Serif', serif" : "'Inter', sans-serif";
  const fontWeight = config.peso === 'bold' ? 700 : 400;
  const fontSize = config.tamanho * exportScale;
  const textAlign = config.alinhamento as any;

  const renderContent = (text: string) => {
    const paragraphs = text.split('\n').filter(p => p.trim());
    return paragraphs.map((para, i) => {
      // Suportar bold parcial: texto entre ** **
      if (config.bold_parcial) {
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="leading-[1.45]">
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      }
      return <p key={i} className="leading-[1.45]">{para}</p>;
    });
  };

  return (
    <div
      onClick={() => !isExport && onStartEdit?.()}
      className={`flex flex-col gap-2 w-full ${!isExport ? 'cursor-text' : ''}`}
      style={{
        fontFamily,
        fontWeight,
        fontSize: `${fontSize}px`,
        color: config.cor,
        textAlign,
      }}
    >
      {config.numerado && slideNumber !== undefined && slideNumber > 0 && (
        <span
          className="block opacity-40 mb-1"
          style={{ fontSize: `${fontSize * 0.5}px`, fontFamily: "'Inter', sans-serif" }}
        >
          {String(slideNumber).padStart(2, '0')}
        </span>
      )}
      {renderContent(content)}
    </div>
  );
};

// Zona: Imagem
export const ZoneImage: React.FC<{
  config: ZonaImagem;
  imageUrl?: string;
  overlayGradient?: string;
  exportScale?: number;
}> = ({ config, imageUrl, exportScale = 1 }) => {
  if (!config.ativo) return null;

  if (!imageUrl) {
    // Fallback: placeholder visual para imagem
    return (
      <div
        className={`flex items-center justify-center bg-current/5 ${
          config.formato === 'rounded-lg' ? 'rounded-lg' : ''
        } ${config.posicao === 'fullscreen' ? 'absolute inset-0 z-0' : 'mx-8 mb-4'}`}
        style={{
          height: config.posicao === 'fullscreen' ? '100%' : `${120 * exportScale}px`,
          opacity: 0.1,
        }}
      >
        <svg
          className="text-current"
          style={{ width: `${32 * exportScale}px`, height: `${32 * exportScale}px` }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  if (config.posicao === 'fullscreen') {
    return (
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
        {config.overlay && config.overlay_gradient && (
          <div
            className="absolute inset-0"
            style={{ background: config.overlay_gradient }}
          />
        )}
      </div>
    );
  }

  // Posicao top ou bottom
  return (
    <div className={`px-8 ${config.posicao === 'top' ? 'pt-2 pb-4' : 'pt-4 pb-2'}`}>
      <img
        src={imageUrl}
        alt=""
        className={`w-full object-cover ${config.formato === 'rounded-lg' ? 'rounded-lg' : ''}`}
        style={{ maxHeight: `${200 * exportScale}px` }}
      />
    </div>
  );
};

// Zona: Footer Bar (editorial)
export const ZoneFooterBar: React.FC<{
  config: ZonaFooterBar;
  brand: BrandProfile;
  isDark: boolean;
  footerText?: string;
  exportScale?: number;
}> = ({ config, brand, isDark, footerText, exportScale = 1 }) => {
  if (!config.ativo) return null;

  const textColor = isDark ? '#FFFFFF' : '#1a1a1a';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <div className="px-8 pb-6 shrink-0 z-20">
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: `1px solid ${borderColor}` }}
      >
        {/* Lado esquerdo: tagline ou icone */}
        <div className="flex items-center space-x-2">
          {brand.tagline && (
            <span
              className="font-bold uppercase tracking-wider"
              style={{
                fontSize: `${9 * exportScale}px`,
                color: brand.corAccent || textColor,
                opacity: 0.6,
              }}
            >
              {brand.tagline}
            </span>
          )}
        </div>
        {/* Lado direito: marca */}
        <div className="flex items-center space-x-2">
          <span
            className="font-bold uppercase tracking-wider"
            style={{
              fontSize: `${10 * exportScale}px`,
              color: brand.corAccent || textColor,
              opacity: 0.5,
            }}
          >
            {brand.marcaNome || brand.name}
          </span>
        </div>
      </div>
      {/* Paginacao */}
      {footerText && (
        <div className="mt-2 text-center">
          <span
            style={{
              fontSize: `${10 * exportScale}px`,
              color: textColor,
              opacity: 0.3,
            }}
          >
            {footerText}
          </span>
        </div>
      )}
    </div>
  );
};

// Zona: Footer simples (paginacao para twitter)
export const ZoneFooterSimple: React.FC<{
  footerText: string;
  isDark: boolean;
  exportScale?: number;
}> = ({ footerText, isDark, exportScale = 1 }) => {
  if (!footerText) return null;

  const textSecondary = isDark ? 'text-gray-500' : 'text-[#536471]';

  return (
    <div className={`px-8 pb-6 shrink-0 z-20 ${textSecondary}`}>
      <span style={{ fontSize: `${12 * exportScale}px` }}>{footerText}</span>
    </div>
  );
};
