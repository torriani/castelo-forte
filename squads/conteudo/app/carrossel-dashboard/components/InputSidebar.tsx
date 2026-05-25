import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  User,
  Type as TypeIcon,
  Layout,
  Eye,
  ImageIcon,
  X,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  FileText,
  Zap,
  Sun,
  Moon,
  Sliders,
} from 'lucide-react';
import { ParsedCarousel, SlideData, BrandProfile, CarouselTemplate, Client, LayoutPreset } from '../types';
import { UserImage } from '../services/storage';
import { ExportProgress } from '../services/export';
import { ImageUploader } from './ImageUploader';
import { ImageGallery } from './ImageGallery';
import { AIImageGenerator } from './AIImageGenerator';
import { BrandPicker } from './BrandPicker';
import { ExportButton } from './ExportButton';
import { ContentTabs, ContentTab, GenerateParams } from './ContentTabs';
import { NewBrandData } from '../hooks/useBrands';

interface InputSidebarProps {
  carousel: ParsedCarousel | null;
  brand: BrandProfile;
  setBrand: React.Dispatch<React.SetStateAction<BrandProfile>>;
  selectedHookIndex: number;
  setSelectedHookIndex: (i: number) => void;
  templates: CarouselTemplate[];
  selectedTemplateSlug: string;
  setSelectedTemplateSlug: (slug: string) => void;
  onApplyTemplateToAll: (slug: string) => void;
  slides: SlideData[];
  currentSlideIndex: number;
  setCurrentSlideIndex: (i: number) => void;
  onUpdateSlide: (id: string, content: string) => void;
  onUpdateSlideImage: (id: string, imageUrl: string | undefined) => void;
  onExport: () => void;
  isExporting: boolean;
  exportProgress: ExportProgress | null;
  // Imagens do usuario
  userImages: UserImage[];
  userImagesLoading: boolean;
  userImagesUploading: boolean;
  userImagesError: string | null;
  onUploadImage: (file: File) => Promise<any>;
  onDeleteImage: (image: UserImage) => Promise<boolean>;
  // Brands
  brands: BrandProfile[];
  brandsLoading: boolean;
  selectedBrand: BrandProfile | null;
  onSelectBrand: (id: string) => void;
  onCreateBrand: (data: NewBrandData) => Promise<BrandProfile | null>;
  // IA imagens
  userId?: string;
  onAIImageUploaded?: (image: UserImage) => void;
  // Props modo novo
  isNewMode?: boolean;
  projectName?: string;
  onAddSlide?: () => void;
  onRemoveSlide?: (index: number) => boolean;
  onMoveSlide?: (fromIndex: number, direction: 'up' | 'down') => void;
  // Content tabs
  contentTab: ContentTab;
  onContentTabChange: (tab: ContentTab) => void;
  onGenerateCarousel: (params: GenerateParams) => void;
  generatingCarousel: boolean;
  onSubmitText: (text: string) => void;
  clients: Client[];
  selectedPath: string | null;
  onSelectCopy: (path: string) => void;
  // Template slots (B-10)
  onApplyTemplateSlots: (hookSlug: string, internalSlug: string, ctaSlug: string) => void;
  // Estética (B-13 a B-18)
  onUpdateSlideStyle: (index: number, updates: Partial<SlideData>) => void;
}

export const InputSidebar: React.FC<InputSidebarProps> = ({
  carousel,
  brand,
  setBrand,
  selectedHookIndex,
  setSelectedHookIndex,
  templates,
  selectedTemplateSlug,
  setSelectedTemplateSlug,
  onApplyTemplateToAll,
  slides,
  currentSlideIndex,
  setCurrentSlideIndex,
  onUpdateSlide,
  onUpdateSlideImage,
  onExport,
  isExporting,
  exportProgress,
  userImages,
  userImagesLoading,
  userImagesUploading,
  userImagesError,
  onUploadImage,
  onDeleteImage,
  brands,
  brandsLoading,
  selectedBrand,
  onSelectBrand,
  onCreateBrand,
  userId,
  onAIImageUploaded,
  isNewMode = false,
  projectName,
  onAddSlide,
  onRemoveSlide,
  onMoveSlide,
  contentTab,
  onContentTabChange,
  onGenerateCarousel,
  generatingCarousel,
  onSubmitText,
  clients,
  selectedPath,
  onSelectCopy,
  onApplyTemplateSlots,
  onUpdateSlideStyle,
}) => {
  const [localText, setLocalText] = useState('');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<number | null>(null);

  const currentSlide = slides[currentSlideIndex];

  useEffect(() => {
    if (currentSlide) {
      setLocalText(currentSlide.content || '');
    }
  }, [currentSlideIndex, currentSlide?.content]);

  // Fechar confirmacao ao mudar de slide
  useEffect(() => {
    setShowRemoveConfirm(null);
  }, [currentSlideIndex]);

  const handleRemoveSlide = (index: number) => {
    if (!onRemoveSlide) return;
    const slide = slides[index];
    const slideHasContent = !!(slide?.content?.trim() || slide?.imageUrl);

    if (slideHasContent && showRemoveConfirm !== index) {
      setShowRemoveConfirm(index);
      return;
    }

    onRemoveSlide(index);
    setShowRemoveConfirm(null);
  };

  const handleTextChange = (text: string) => {
    setLocalText(text);
    if (currentSlide) {
      onUpdateSlide(currentSlide.id, text);
    }
  };

  const handleSelectImage = (url: string) => {
    if (!currentSlide) return;
    if (currentSlide.imageUrl === url) {
      onUpdateSlideImage(currentSlide.id, undefined);
    } else {
      onUpdateSlideImage(currentSlide.id, url);
    }
  };

  const handleRemoveImage = () => {
    if (currentSlide) {
      onUpdateSlideImage(currentSlide.id, undefined);
    }
  };

  // Template slots (B-10)
  const [hookSlug, setHookSlug] = useState(selectedTemplateSlug);
  const [internalSlug, setInternalSlug] = useState(selectedTemplateSlug);
  const [ctaSlug, setCtaSlug] = useState(selectedTemplateSlug);
  const [showSlots, setShowSlots] = useState(false);

  const handleApplySlots = () => {
    onApplyTemplateSlots(hookSlug, internalSlug, ctaSlug);
  };

  // Agrupar templates por familia
  const twitterTemplates = templates.filter(t => t.familia === 'twitter');
  const editorialTemplates = templates.filter(t => t.familia === 'editorial');

  // Zone count helper (B-09)
  const getZoneCount = (tmpl: CarouselTemplate) => {
    let count = 0;
    if (tmpl.zona_header?.ativo) count++;
    if (tmpl.zona_header_bar?.ativo) count++;
    if (tmpl.zona_titulo?.ativo) count++;
    if (tmpl.zona_subtitulo?.ativo) count++;
    if (tmpl.zona_body?.ativo) count++;
    if (tmpl.zona_imagem?.ativo) count++;
    if (tmpl.zona_footer_bar?.ativo) count++;
    return count;
  };

  return (
    <div className="w-[380px] bg-[#09090b] border-r border-white/5 h-full flex flex-col flex-shrink-0">

      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 shrink-0">
        {isNewMode ? (
          <>
            <div className="flex items-center space-x-2">
              <FileText className="w-3 h-3 text-emerald-500" />
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Novo carrossel</p>
            </div>
            <p className="text-xs text-white font-medium mt-1">{projectName || 'Sem nome'}</p>
            <p className="text-[9px] text-zinc-600 mt-1">
              {slides.length} slide{slides.length !== 1 ? 's' : ''} · modo criacao
            </p>
          </>
        ) : carousel ? (
          <>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{carousel.id}</p>
            <p className="text-xs text-white font-medium mt-1 line-clamp-2">{carousel.title}</p>
            {carousel.metadata['Tipo'] && (
              <p className="text-[9px] text-zinc-600 mt-1">
                {carousel.metadata['Tipo']} · {carousel.metadata['Framework']} · {carousel.metadata['Slides']} slides
              </p>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3 h-3 text-zinc-500" />
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Conteudo</p>
            </div>
            <p className="text-xs text-zinc-400 font-medium mt-1">Crie, envie ou selecione uma copia</p>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">

        {/* 1. CONTENT TABS (Criar / Enviar / Selecionar) */}
        {!carousel && !isNewMode && (
          <ContentTabs
            activeTab={contentTab}
            onTabChange={onContentTabChange}
            onGenerate={onGenerateCarousel}
            generating={generatingCarousel}
            onSubmitText={onSubmitText}
            clients={clients}
            selectedPath={selectedPath}
            onSelectCopy={onSelectCopy}
          />
        )}

        {/* 2. BRAND PICKER */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <User className="w-3 h-3 text-zinc-500" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Brand</span>
          </div>

          <BrandPicker
            brands={brands}
            selectedBrand={selectedBrand}
            loading={brandsLoading}
            onSelect={onSelectBrand}
            onCreate={onCreateBrand}
          />
        </section>

        {/* 3. HOOK (apenas modo MD, quando tem carousel) */}
        {!isNewMode && carousel && carousel.hooks.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3 h-3 text-zinc-500" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Hook do S1</span>
            </div>

            <div className="space-y-2">
              {carousel.hooks.map((hook, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedHookIndex(i)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-[11px] leading-relaxed transition-all ${
                    selectedHookIndex === i
                      ? 'bg-white/5 border-white/20 text-white'
                      : 'bg-[#121214] border-transparent text-zinc-500 hover:text-zinc-300 hover:border-white/10'
                  }`}
                >
                  <span className={`text-[8px] font-bold uppercase tracking-wider mr-2 ${
                    hook.type.includes('IMPERIAL') ? 'text-amber-500' : 'text-blue-400'
                  }`}>
                    [{hook.type}]
                  </span>
                  <span>{hook.text}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 4. TEMPLATE POR SLIDE */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layout className="w-3 h-3 text-zinc-500" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                Template {slides.length > 0 ? `· Slide ${currentSlideIndex + 1}` : ''}
              </span>
            </div>
            {slides.length > 1 && (
              <button
                onClick={() => onApplyTemplateToAll(selectedTemplateSlug)}
                className="text-[8px] text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-wider font-bold"
                title="Aplicar este template a todos os slides"
              >
                Aplicar a todos
              </button>
            )}
          </div>

          {/* Twitter templates */}
          {twitterTemplates.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Twitter</span>
              <div className="grid grid-cols-2 gap-2">
                {twitterTemplates.map(tmpl => (
                  <button
                    key={tmpl.slug}
                    onClick={() => setSelectedTemplateSlug(tmpl.slug)}
                    className={`px-3 py-2.5 rounded-lg border text-center transition-all ${
                      selectedTemplateSlug === tmpl.slug
                        ? 'bg-white/5 border-white/20 text-white'
                        : 'bg-[#121214] border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1.5 mb-1">
                      <div
                        className="w-3 h-3 rounded-sm border border-white/10"
                        style={{ backgroundColor: tmpl.background }}
                      />
                      <span className="text-[10px] font-bold">{tmpl.nome}</span>
                    </div>
                    <span className="text-[8px] text-zinc-600 block">{tmpl.dark_mode ? 'Escuro' : 'Claro'} · {getZoneCount(tmpl)}z</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Editorial templates */}
          {editorialTemplates.length > 0 && (
            <div className="space-y-1.5 mt-3">
              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Editorial</span>
              <div className="grid grid-cols-2 gap-2">
                {editorialTemplates.map(tmpl => (
                  <button
                    key={tmpl.slug}
                    onClick={() => setSelectedTemplateSlug(tmpl.slug)}
                    className={`px-3 py-2.5 rounded-lg border text-left transition-all ${
                      selectedTemplateSlug === tmpl.slug
                        ? 'bg-white/5 border-white/20 text-white'
                        : 'bg-[#121214] border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold block">{tmpl.nome}</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[8px] text-zinc-600 line-clamp-1">
                        {tmpl.descricao || ''}
                      </span>
                      <span className="text-[8px] text-zinc-700 shrink-0 ml-1">{getZoneCount(tmpl)}z</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Template Slots — Auto S1/Interno/CTA (B-10) */}
          {slides.length > 2 && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <button
                onClick={() => setShowSlots(!showSlots)}
                className="flex items-center space-x-1.5 text-[8px] font-bold text-zinc-600 uppercase tracking-wider hover:text-zinc-400 transition-colors"
              >
                <Zap className="w-2.5 h-2.5" />
                <span>Auto-templates (S1 / Interno / CTA)</span>
              </button>

              {showSlots && (
                <div className="mt-2 space-y-2">
                  {/* Hook template */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] text-amber-500 font-bold w-10 shrink-0">S1</span>
                    <select
                      value={hookSlug}
                      onChange={e => setHookSlug(e.target.value)}
                      className="flex-1 bg-[#18181b] border border-white/10 rounded px-2 py-1 text-[10px] text-white outline-none"
                    >
                      {templates.map(t => (
                        <option key={t.slug} value={t.slug}>{t.nome}</option>
                      ))}
                    </select>
                  </div>
                  {/* Internal template */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] text-zinc-500 font-bold w-10 shrink-0">Int.</span>
                    <select
                      value={internalSlug}
                      onChange={e => setInternalSlug(e.target.value)}
                      className="flex-1 bg-[#18181b] border border-white/10 rounded px-2 py-1 text-[10px] text-white outline-none"
                    >
                      {templates.map(t => (
                        <option key={t.slug} value={t.slug}>{t.nome}</option>
                      ))}
                    </select>
                  </div>
                  {/* CTA template */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] text-emerald-500 font-bold w-10 shrink-0">CTA</span>
                    <select
                      value={ctaSlug}
                      onChange={e => setCtaSlug(e.target.value)}
                      className="flex-1 bg-[#18181b] border border-white/10 rounded px-2 py-1 text-[10px] text-white outline-none"
                    >
                      {templates.map(t => (
                        <option key={t.slug} value={t.slug}>{t.nome}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleApplySlots}
                    className="w-full py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[9px] text-white font-bold uppercase tracking-wider transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 5. SLIDES */}
        {slides.length > 0 && (
          <section className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TypeIcon className="w-3 h-3 text-zinc-500" />
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  Slide {currentSlideIndex + 1}/{slides.length}
                </span>
              </div>

              {/* Controles de reordenacao (modo novo) */}
              {isNewMode && onMoveSlide && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onMoveSlide(currentSlideIndex, 'up')}
                    disabled={currentSlideIndex === 0}
                    className="w-5 h-5 rounded flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    title="Mover para cima"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onMoveSlide(currentSlideIndex, 'down')}
                    disabled={currentSlideIndex === slides.length - 1}
                    className="w-5 h-5 rounded flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    title="Mover para baixo"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Slide tabs com indicador de template */}
            <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar items-center">
              {slides.map((slide, i) => {
                const slideTemplate = templates.find(t => t.slug === slide.templateSlug);
                const slideHasContent = !!(slide.content?.trim() || slide.imageUrl);
                return (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlideIndex(i)}
                    className={`flex-shrink-0 w-7 h-7 rounded-md flex flex-col items-center justify-center text-[10px] font-bold border transition-all relative ${
                      currentSlideIndex === i
                        ? 'bg-white text-black border-white'
                        : slideHasContent
                          ? 'bg-[#18181b] text-zinc-400 border-transparent hover:border-zinc-700'
                          : 'bg-[#18181b] text-zinc-600 border-dashed border-zinc-800 hover:border-zinc-700'
                    }`}
                    title={slideTemplate ? `Template: ${slideTemplate.nome}` : ''}
                  >
                    {i + 1}
                    {slideTemplate && (
                      <div
                        className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full border border-black/30"
                        style={{ backgroundColor: slideTemplate.background === '#ffffff' ? '#999' : slideTemplate.background }}
                      />
                    )}
                  </button>
                );
              })}

              {/* Botao adicionar slide (modo novo) */}
              {isNewMode && onAddSlide && (
                <button
                  onClick={onAddSlide}
                  className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-zinc-600 border border-dashed border-zinc-800 hover:border-zinc-500 hover:text-zinc-400 transition-all"
                  title="Adicionar slide"
                >
                  <Plus className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Placeholder para slide vazio (modo novo) */}
            {isNewMode && currentSlide && !currentSlide.content?.trim() && !currentSlide.imageUrl && (
              <div className="bg-[#121214] border border-dashed border-white/10 rounded-lg px-4 py-3">
                <p className="text-[10px] text-zinc-600 text-center">
                  {currentSlide.isHook
                    ? 'Escreva o hook (gancho) do seu carrossel'
                    : `Slide ${currentSlideIndex + 1} — adicione texto ou imagem`
                  }
                </p>
              </div>
            )}

            {/* Text editor */}
            <textarea
              value={localText}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full h-36 bg-[#18181b] border border-transparent focus:border-white/10 rounded-xl px-4 py-3 text-xs text-zinc-300 focus:outline-none resize-none leading-relaxed custom-scrollbar"
              placeholder={
                isNewMode && currentSlide?.isHook
                  ? 'Escreva o hook do S1...'
                  : 'Conteudo do slide...'
              }
            />

            {/* Controles de Estética (B-13 a B-18) */}
            {currentSlide && (
              <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-3 h-3 text-zinc-500" />
                  <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Estilo</span>
                </div>

                {/* B-13: Light/Dark toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-zinc-500">Tema</span>
                  <button
                    onClick={() => onUpdateSlideStyle(currentSlideIndex, { darkMode: !currentSlide.darkMode })}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold transition-all ${
                      currentSlide.darkMode
                        ? 'bg-zinc-800 text-white border border-white/10'
                        : 'bg-zinc-200 text-black border border-black/10'
                    }`}
                  >
                    {currentSlide.darkMode ? <Moon className="w-2.5 h-2.5" /> : <Sun className="w-2.5 h-2.5" />}
                    <span>{currentSlide.darkMode ? 'Dark' : 'Light'}</span>
                  </button>
                </div>

                {/* B-14: Font selector */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-zinc-500">Fonte</span>
                  <select
                    value={currentSlide.fontFamily || 'system'}
                    onChange={e => onUpdateSlideStyle(currentSlideIndex, { fontFamily: e.target.value })}
                    className="bg-[#18181b] border border-white/10 rounded px-2 py-1 text-[10px] text-white outline-none"
                  >
                    <option value="system">System (padrão)</option>
                    <option value="chirp">Chirp (Twitter)</option>
                    <option value="jakarta">Plus Jakarta Sans</option>
                    <option value="montserrat">Montserrat</option>
                    <option value="poppins">Poppins</option>
                    <option value="serif">Playfair Display</option>
                    <option value="ubuntu">Ubuntu</option>
                    <option value="roboto">Roboto</option>
                    <option value="arial">Arial</option>
                  </select>
                </div>

                {/* B-15: Font size slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-zinc-500">Tamanho texto</span>
                    <span className="text-[9px] text-zinc-600">{currentSlide.fontSize || 22}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="48"
                    step="1"
                    value={currentSlide.fontSize || 22}
                    onChange={e => onUpdateSlideStyle(currentSlideIndex, { fontSize: Number(e.target.value) })}
                    className="w-full accent-white h-1"
                  />
                </div>

                {/* B-17: Respiro visual (padding %) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-zinc-500">Respiro</span>
                    <span className="text-[9px] text-zinc-600">{currentSlide.paddingPct || 8}%</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="1"
                    value={currentSlide.paddingPct || 8}
                    onChange={e => onUpdateSlideStyle(currentSlideIndex, { paddingPct: Number(e.target.value) })}
                    className="w-full accent-white h-1"
                  />
                </div>

                {/* B-18: Layout presets */}
                <div>
                  <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest block mb-1.5">Layout</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      { id: 'padrao', label: 'Padrão' },
                      { id: 'impacto', label: 'Impacto' },
                      { id: 'texto-top', label: 'Texto Top' },
                      { id: 'imagem-top', label: 'Img Top' },
                      { id: 'balao-baixo', label: 'Balão ↓' },
                      { id: 'lista', label: 'Lista' },
                    ] as { id: LayoutPreset; label: string }[]).map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => onUpdateSlideStyle(currentSlideIndex, { layoutPreset: preset.id })}
                        className={`px-2 py-1.5 rounded text-[9px] font-bold transition-all ${
                          (currentSlide.layoutPreset || 'padrao') === preset.id
                            ? 'bg-white/10 text-white border border-white/20'
                            : 'bg-[#121214] text-zinc-600 border border-transparent hover:text-zinc-400'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Botao remover slide (modo novo) */}
            {isNewMode && onRemoveSlide && slides.length > 1 && (
              <div className="flex items-center justify-end">
                {showRemoveConfirm === currentSlideIndex ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] text-amber-500">Tem conteudo. Remover?</span>
                    <button
                      onClick={() => handleRemoveSlide(currentSlideIndex)}
                      className="text-[9px] text-red-500 hover:text-red-400 font-bold uppercase tracking-wider"
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setShowRemoveConfirm(null)}
                      className="text-[9px] text-zinc-500 hover:text-zinc-400 font-bold uppercase tracking-wider"
                    >
                      Nao
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRemoveSlide(currentSlideIndex)}
                    className="flex items-center space-x-1 text-[9px] text-zinc-700 hover:text-red-500 transition-colors uppercase tracking-wider font-bold"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remover slide</span>
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {/* 6. IMAGEM DO SLIDE */}
        {slides.length > 0 && currentSlide && (
          <section className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-3 h-3 text-zinc-500" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                Imagem · Slide {currentSlideIndex + 1}
              </span>
            </div>

            {currentSlide.imageUrl && (
              <div className="relative rounded-lg overflow-hidden border border-white/10">
                <img
                  src={currentSlide.imageUrl}
                  alt="Imagem do slide"
                  className="w-full h-24 object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center hover:bg-red-600/80 transition-colors"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1">
                  <p className="text-[8px] text-white/80">Imagem aplicada</p>
                </div>
              </div>
            )}

            <ImageUploader
              onUpload={onUploadImage}
              uploading={userImagesUploading}
              error={userImagesError}
            />

            {userId && (
              <AIImageGenerator
                userId={userId}
                onApplyImage={(url) => handleSelectImage(url)}
                onImageUploaded={(image) => onAIImageUploaded?.(image)}
              />
            )}

            <ImageGallery
              images={userImages}
              loading={userImagesLoading}
              selectedUrl={currentSlide.imageUrl}
              onSelect={handleSelectImage}
              onDelete={onDeleteImage}
            />
          </section>
        )}

        {/* 7. EXPORT */}
        <ExportButton
          slidesCount={slides.length}
          isExporting={isExporting}
          progress={exportProgress}
          onExport={onExport}
          variant="sidebar"
        />

      </div>
    </div>
  );
};
