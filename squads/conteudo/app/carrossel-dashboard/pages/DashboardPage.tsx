import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, Save, Cloud, CloudOff, Layers } from 'lucide-react';

import {
  BrandProfile,
  ParsedCarousel,
  SlideData,
  Client
} from '../types';
import { fetchBrowseTree, fetchCarouselContent } from '../services/api';
import { parseCarouselMarkdown } from '../services/markdown-parser';
import { TemplateRenderer } from '../components/TemplateRenderer';
import { InputSidebar } from '../components/InputSidebar';
import { CarouselBrowser, NavSection } from '../components/CarouselBrowser';
import { PersonaSelector } from '../components/PersonaSelector';
import { ContentTab, GenerateParams } from '../components/ContentTabs';
import { useTemplates } from '../hooks/useTemplates';
import { useUserImages } from '../hooks/useUserImages';
import { useCarouselProject } from '../hooks/useCarouselProject';
import { useBrands } from '../hooks/useBrands';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { useAutoSave } from '../hooks/useAutoSave';
import { UserImage } from '../services/storage';
import { ExportButton } from '../components/ExportButton';
import { ExportHistory } from '../components/ExportHistory';
import { exportSlidesToZip, getZipFilename, downloadBlob, ExportProgress } from '../services/export';
import { useExports } from '../hooks/useExports';

const PERSONA_STORAGE_KEY = 'carrossel-studio-persona-confirmed';

const DEFAULT_BRAND: BrandProfile = {
  name: 'operador da Castelo Forte',
  handle: 'jcastelo-forte',
  avatarUrl: '',
  isVerified: true,
  marcaNome: 'F2L',
  tagline: 'FAMILIA, LUCRO E LIBERDADE',
  categoria: 'IA FIRST',
  corPrimaria: '#000000',
  corSecundaria: '#666666',
  corAccent: '#d4b995',
};

export const DashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id && id.length > 8;
  const isProjectMode = isEditMode;
  const { user } = useAuth();

  // Persona gate
  const [personaConfirmed, setPersonaConfirmed] = useState(() => {
    return !!localStorage.getItem(PERSONA_STORAGE_KEY);
  });

  // Secao ativa do menu lateral
  const [activeSection, setActiveSection] = useState<NavSection>('carrosseis');

  // Content tab ativa (Criar / Enviar / Selecionar)
  const [contentTab, setContentTab] = useState<ContentTab>('selecionar');
  const [generatingCarousel, setGeneratingCarousel] = useState(false);
  const [oraculoResult, setOraculoResult] = useState<{ approved: boolean; issues: string[]; score: number } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin mode check (B-21)
  useEffect(() => {
    fetch('/api/admin/status')
      .then(r => r.json())
      .then(data => setIsAdmin(data?.isAdmin ?? false))
      .catch(() => setIsAdmin(false));
  }, []);

  // Templates do banco
  const { templates, loading: templatesLoading } = useTemplates();

  // Imagens do usuario
  const {
    images: userImages,
    loading: userImagesLoading,
    uploading: userImagesUploading,
    error: userImagesError,
    upload: uploadUserImage,
    remove: removeUserImage,
    refresh: refreshUserImages,
  } = useUserImages();

  // Hook para modo projeto
  const carouselProject = useCarouselProject();

  // Hook para CRUD de projetos
  const {
    projects,
    loading: projectsLoading,
    createProject: createProjectInDb,
    updateProject,
    deleteProject,
    loadProject,
  } = useProjects();

  // Brands do banco
  const {
    brands,
    loading: brandsLoading,
    selectedBrand,
    selectBrand,
    create: createBrand,
  } = useBrands();

  // Hook para historico de exports
  const { exports: projectExports, loading: exportsLoading, recordExport, loadExports, exportCounts } = useExports();

  // ============ MODO MD (legado) ============
  const [defaultTemplateSlug, setDefaultTemplateSlug] = useState<string>('twitter-branco');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [carousel, setCarousel] = useState<ParsedCarousel | null>(null);
  const [mdBrand, setMdBrand] = useState<BrandProfile>(DEFAULT_BRAND);
  const [selectedHookIndex, setSelectedHookIndex] = useState(0);
  const [mdSlides, setMdSlides] = useState<SlideData[]>([]);
  const [mdCurrentSlideIndex, setMdCurrentSlideIndex] = useState(0);

  // Loading do projeto do banco
  const [projectLoading, setProjectLoading] = useState(false);

  // Export
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Dados ativos (dependendo do modo)
  const slides = isProjectMode ? carouselProject.slides : mdSlides;
  const currentSlideIndex = isProjectMode ? carouselProject.currentSlideIndex : mdCurrentSlideIndex;
  const setCurrentSlideIndex = isProjectMode ? carouselProject.setCurrentSlideIndex : setMdCurrentSlideIndex;
  const brand = isProjectMode ? carouselProject.brand : mdBrand;
  const setBrand = isProjectMode ? carouselProject.setBrand : setMdBrand;
  const activeDefaultTemplateSlug = isProjectMode ? carouselProject.defaultTemplateSlug : defaultTemplateSlug;

  // Tem conteudo para mostrar?
  const hasContent = slides.length > 0;

  // ============ Persona gate ============
  // Auto-confirmar se ja tem brand selecionado e localStorage marcado
  useEffect(() => {
    if (personaConfirmed && !selectedBrand && !brandsLoading && brands.length > 0) {
      // localStorage diz confirmado mas nao tem brand selecionado — manter confirmado, brand sera auto-selecionado pelo hook
    }
  }, [personaConfirmed, selectedBrand, brandsLoading, brands]);

  const handlePersonaSelect = useCallback((brand: BrandProfile) => {
    if (brand.id) {
      selectBrand(brand.id);
    }
    localStorage.setItem(PERSONA_STORAGE_KEY, brand.id || 'true');
    setPersonaConfirmed(true);
  }, [selectBrand]);

  const handleChangePersona = useCallback(() => {
    localStorage.removeItem(PERSONA_STORAGE_KEY);
    setPersonaConfirmed(false);
  }, []);

  // ============ Auto-save ============
  const autoSave = useAutoSave({
    projectId: isProjectMode && carouselProject.project?.id && !carouselProject.project.id.startsWith('proj-')
      ? carouselProject.project.id
      : null,
    getData: useCallback(() => ({
      slides: carouselProject.slides,
      brand: carouselProject.brand,
      default_template_slug: carouselProject.defaultTemplateSlug,
      name: carouselProject.project?.name,
    }), [carouselProject.slides, carouselProject.brand, carouselProject.defaultTemplateSlug, carouselProject.project?.name]),
    onSave: useCallback(async (projectId: string, data: any) => {
      await updateProject(projectId, {
        slides: data.slides,
        brand: data.brand,
        default_template_slug: data.default_template_slug,
        name: data.name,
      });
    }, [updateProject]),
    enabled: isProjectMode,
  });

  // Marcar dirty quando slides/brand/nome mudam
  useEffect(() => {
    if (isProjectMode && carouselProject.project?.id && !carouselProject.project.id.startsWith('proj-')) {
      autoSave.markDirty();
    }
  }, [carouselProject.slides, carouselProject.brand, carouselProject.project?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  // ============ Carregar projeto do banco (modo edit) ============
  useEffect(() => {
    if (isEditMode && id) {
      setProjectLoading(true);
      loadProject(id)
        .then(dbProject => {
          if (dbProject) {
            carouselProject.loadFromDb(dbProject);
            loadExports(dbProject.id);
          } else {
            console.error('Projeto nao encontrado:', id);
            navigate('/editor', { replace: true });
          }
        })
        .catch(err => {
          console.error('Erro ao carregar projeto:', err);
          navigate('/editor', { replace: true });
        })
        .finally(() => setProjectLoading(false));
    }
  }, [id, isEditMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sincronizar brand selecionado do banco com o state local
  useEffect(() => {
    if (selectedBrand) {
      const updatedBrand: BrandProfile = { ...selectedBrand };
      if (isProjectMode) {
        carouselProject.setBrand(updatedBrand);
      } else {
        setMdBrand(updatedBrand);
      }
    }
  }, [selectedBrand]); // eslint-disable-line react-hooks/exhaustive-deps

  // Template do slide atual (resolvido)
  const currentSlideTemplateSlug = slides[currentSlideIndex]?.templateSlug || activeDefaultTemplateSlug;
  const currentSlideTemplate = templates.find(t => t.slug === currentSlideTemplateSlug) || templates[0];

  // Helper: resolver template de um slide
  const getTemplateForSlide = useCallback((slide: SlideData) => {
    return templates.find(t => t.slug === slide.templateSlug) || templates[0];
  }, [templates]);

  // ============ Handlers unificados ============

  const handleSetSlideTemplate = useCallback((slideIndex: number, slug: string) => {
    if (isProjectMode) {
      carouselProject.setSlideTemplate(slideIndex, slug);
    } else {
      const template = templates.find(t => t.slug === slug);
      setMdSlides(prev =>
        prev.map((s, i) => i === slideIndex ? {
          ...s,
          templateSlug: slug,
          darkMode: template?.dark_mode ?? s.darkMode,
        } : s)
      );
    }
  }, [isProjectMode, carouselProject, templates]);

  const handleSetCurrentSlideTemplate = useCallback((slug: string) => {
    handleSetSlideTemplate(currentSlideIndex, slug);
  }, [currentSlideIndex, handleSetSlideTemplate]);

  const handleApplyTemplateToAll = useCallback((slug: string) => {
    if (isProjectMode) {
      carouselProject.applyTemplateToAll(slug);
    } else {
      const template = templates.find(t => t.slug === slug);
      setDefaultTemplateSlug(slug);
      setMdSlides(prev =>
        prev.map(s => ({
          ...s,
          templateSlug: slug,
          darkMode: template?.dark_mode ?? s.darkMode,
        }))
      );
    }
  }, [isProjectMode, carouselProject, templates]);

  const handleUpdateSlide = useCallback((id: string, content: string) => {
    if (isProjectMode) {
      carouselProject.updateSlide(id, content);
    } else {
      setMdSlides(prev =>
        prev.map(s => (s.id === id ? { ...s, content } : s))
      );
    }
  }, [isProjectMode, carouselProject]);

  const handleAIImageUploaded = useCallback((_image: UserImage) => {
    refreshUserImages();
  }, [refreshUserImages]);

  const handleUpdateSlideImage = useCallback((id: string, imageUrl: string | undefined) => {
    if (isProjectMode) {
      carouselProject.updateSlideImage(id, imageUrl);
    } else {
      setMdSlides(prev =>
        prev.map(s => (s.id === id ? { ...s, imageUrl } : s))
      );
    }
  }, [isProjectMode, carouselProject]);

  // ============ Save manual ============
  const handleSaveProject = useCallback(async () => {
    await autoSave.saveNow();
  }, [autoSave]);

  // ============ MODO MD: carregamento ============

  // Carregar arvore de copias (sempre, para o painel esquerdo)
  useEffect(() => {
    fetchBrowseTree()
      .then(data => setClients(data.clients))
      .catch(err => console.error('Erro ao carregar arvore:', err));
  }, []);

  useEffect(() => {
    if (isProjectMode || !selectedPath) return;
    fetchCarouselContent(selectedPath)
      .then(content => {
        const parsed = parseCarouselMarkdown(content, selectedPath);
        setCarousel(parsed);
        setSelectedHookIndex(0);
        setMdCurrentSlideIndex(0);
      })
      .catch(err => console.error('Erro ao carregar carrossel:', err));
  }, [selectedPath, isProjectMode]);

  useEffect(() => {
    if (isProjectMode) return;
    if (!carousel) {
      setMdSlides([]);
      return;
    }

    const defTemplate = templates.find(t => t.slug === defaultTemplateSlug);

    const builtSlides: SlideData[] = carousel.slides.map((s, i) => {
      const isHook = i === 0;
      let content = s.text;
      if (isHook && carousel.hooks.length > 0) {
        const selectedHook = carousel.hooks[selectedHookIndex];
        if (selectedHook) {
          content = selectedHook.text;
        }
      }

      return {
        id: `slide-${i}`,
        content,
        isHook,
        darkMode: defTemplate?.dark_mode ?? false,
        footerText: `${i + 1}/${carousel.slides.length}`,
        templateSlug: defaultTemplateSlug,
      };
    });

    setMdSlides(builtSlides);
    setMdCurrentSlideIndex(0);
  }, [carousel, selectedHookIndex, defaultTemplateSlug, templates, isProjectMode]);

  // ============ Browser handlers ============

  const handleSelectCopy = useCallback((path: string) => {
    if (isProjectMode) {
      navigate('/editor', { replace: true });
    }
    setSelectedPath(path);
  }, [isProjectMode, navigate]);

  const handleOpenProject = useCallback((project: any) => {
    navigate(`/editor/${project.id}`);
  }, [navigate]);

  const handleRenameProject = useCallback(async (projectId: string, name: string) => {
    await updateProject(projectId, { name });
  }, [updateProject]);

  // Criar novo carrossel direto (1 clique, sem wizard)
  const handleNewCarousel = useCallback(async () => {
    if (!user) return;
    try {
      const tmplSlug = 'twitter-branco';
      const defaultSlide = {
        id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        content: '',
        isHook: true,
        darkMode: false,
        footerText: '1/1',
        templateSlug: tmplSlug,
      };

      const dbProject = await createProjectInDb('Novo carrossel', tmplSlug, [defaultSlide], null);
      navigate(`/editor/${dbProject.id}`);
    } catch (err) {
      console.error('Erro ao criar projeto:', err);
    }
  }, [user, createProjectInDb, navigate]);

  // ============ Template Slots (B-10) ============

  const handleApplyTemplateSlots = useCallback((hookSlug: string, internalSlug: string, ctaSlug: string) => {
    if (slides.length === 0) return;

    slides.forEach((slide, i) => {
      const isFirst = i === 0;
      const isLast = i === slides.length - 1;
      const slug = isFirst ? hookSlug : isLast ? ctaSlug : internalSlug;
      handleSetSlideTemplate(i, slug);
    });
  }, [slides, handleSetSlideTemplate]);

  // ============ Slide Style (B-13 a B-18) ============

  const handleUpdateSlideStyle = useCallback((index: number, updates: Partial<SlideData>) => {
    if (isProjectMode) {
      // Modo projeto: usar carouselProject.updateSlide
      const slide = slides[index];
      if (!slide) return;
      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'darkMode') {
          carouselProject.updateSlide(slide.id, slide.content);
          // Precisamos atualizar o slide diretamente
        }
      });
      // Atualizar slide completo no array
      const updatedSlides = [...slides];
      updatedSlides[index] = { ...updatedSlides[index], ...updates };
      carouselProject.setSlides(updatedSlides);
    } else {
      // Modo MD
      setMdSlides(prev => prev.map((s, i) => i === index ? { ...s, ...updates } : s));
    }
  }, [isProjectMode, slides, carouselProject]);

  // ============ Content Tab handlers ============

  // Enviar: parsear texto colado em slides
  const handleSubmitText = useCallback(async (text: string) => {
    if (!user) return;

    const tmplSlug = defaultTemplateSlug || 'twitter-branco';
    const defTemplate = templates.find(t => t.slug === tmplSlug);

    // Separar por dupla quebra de linha ou ---
    const chunks = text.split(/\n{2,}|^---$/m).map(s => s.trim()).filter(Boolean);
    if (chunks.length === 0) return;

    const newSlides: SlideData[] = chunks.map((chunk, i) => ({
      id: `slide-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      content: chunk,
      isHook: i === 0,
      darkMode: defTemplate?.dark_mode ?? false,
      footerText: `${i + 1}/${chunks.length}`,
      templateSlug: tmplSlug,
    }));

    try {
      const dbProject = await createProjectInDb(
        chunks[0].substring(0, 40) || 'Carrossel colado',
        tmplSlug,
        newSlides,
        null,
      );
      navigate(`/editor/${dbProject.id}`);
    } catch (err) {
      console.error('Erro ao criar projeto a partir de texto:', err);
      // Fallback: carregar como MD slides locais
      setMdSlides(newSlides);
      setMdCurrentSlideIndex(0);
      setCarousel(null);
      setSelectedPath(null);
    }
  }, [user, defaultTemplateSlug, templates, createProjectInDb, navigate]);

  // Criar: geracao IA via /api/generate-carousel (B-08)
  const handleGenerateCarousel = useCallback(async (params: GenerateParams) => {
    if (!user) return;
    setGeneratingCarousel(true);

    try {
      const response = await fetch('/api/generate-carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: params.headline,
          fatos: params.fatos,
          cta: params.cta,
          postType: params.postType,
          slideCount: params.slideCount,
          useRag: params.useRag,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('Erro ao gerar carrossel:', errData);
        setGeneratingCarousel(false);
        return;
      }

      const data = await response.json();
      const generatedSlides: string[] = data.slides || [];

      // Oraculo validation (B-20)
      if (data.oraculo) {
        setOraculoResult(data.oraculo);
      }

      if (generatedSlides.length === 0) {
        console.error('Nenhum slide gerado');
        setGeneratingCarousel(false);
        return;
      }

      const tmplSlug = defaultTemplateSlug || 'twitter-branco';
      const defTemplate = templates.find(t => t.slug === tmplSlug);

      const newSlides: SlideData[] = generatedSlides.map((text, i) => ({
        id: `slide-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
        content: text,
        isHook: i === 0,
        darkMode: defTemplate?.dark_mode ?? false,
        footerText: `${i + 1}/${generatedSlides.length}`,
        templateSlug: tmplSlug,
      }));

      const projectName = params.headline.substring(0, 40) || 'Carrossel gerado';
      const dbProject = await createProjectInDb(projectName, tmplSlug, newSlides, null);
      navigate(`/editor/${dbProject.id}`);
    } catch (err) {
      console.error('Erro ao gerar carrossel:', err);
    } finally {
      setGeneratingCarousel(false);
    }
  }, [user, defaultTemplateSlug, templates, createProjectInDb, navigate]);

  // ============ Export ============

  const handleExportZip = async () => {
    if (isExporting || slides.length === 0) return;
    setIsExporting(true);
    setExportProgress({ current: 0, total: slides.length, status: 'idle', message: 'Iniciando export...' });

    try {
      const blob = await exportSlidesToZip(
        exportRefs.current,
        {
          width: 1080,
          height: 1350,
          pixelRatio: 1,
          projectName: isProjectMode
            ? carouselProject.project?.name || 'carrossel'
            : carousel?.id || 'carrossel',
        },
        (progress) => setExportProgress(progress)
      );

      const filename = getZipFilename(
        isProjectMode ? carouselProject.project?.name : undefined,
        !isProjectMode ? carousel?.id : undefined
      );
      downloadBlob(blob, filename);

      if (isProjectMode && carouselProject.project?.id && !carouselProject.project.id.startsWith('proj-')) {
        carouselProject.setProjectStatus('exported');
        updateProject(carouselProject.project.id, { status: 'exported' }).catch(console.error);

        recordExport(
          carouselProject.project.id,
          slides.length,
          blob.size,
        ).catch(err => console.error('Erro ao registrar export:', err));
      }

      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(null);
      }, 2000);
    } catch (error) {
      console.error('Erro na exportacao:', error);
      setExportProgress({
        current: 0,
        total: slides.length,
        status: 'error',
        message: `Falha: ${(error as Error).message}`,
      });
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(null);
      }, 3000);
    }
  };

  const currentSlide = slides[currentSlideIndex];

  // ============ PERSONA GATE ============
  // Mostrar seletor de persona se nao confirmou ainda
  if (!personaConfirmed && !brandsLoading) {
    return (
      <PersonaSelector
        brands={brands}
        brandsLoading={brandsLoading}
        onSelect={handlePersonaSelect}
        onCreate={createBrand}
      />
    );
  }

  // Loading state
  if (templatesLoading || projectLoading || brandsLoading) {
    return (
      <>
        <div className="w-[280px] bg-[#09090b] border-r border-white/5 flex-shrink-0" />
        <div className="flex-1 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-500 text-xs">
              {projectLoading ? 'Carregando projeto...' : 'Carregando templates...'}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Export container (off-screen, 1080x1350 para Instagram) */}
      {templates.length > 0 && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0, display: 'flex' }}>
          {slides.map((slide, index) => {
            const slideTemplate = getTemplateForSlide(slide);
            if (!slideTemplate) return null;
            return (
              <div key={`export-${slide.id}`} style={{ width: '1080px', height: '1350px' }}>
                <TemplateRenderer
                  template={slideTemplate}
                  slide={slide}
                  brand={brand}
                  isActive={true}
                  onUpdate={() => {}}
                  slideRef={(el) => (exportRefs.current[index] = el)}
                  containerStyle={{ width: '100%', height: '100%' }}
                  isExport={true}
                  slideNumber={index + 1}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* 1. NavSidebar (CarouselBrowser com navegacao) */}
      <CarouselBrowser
        clients={clients}
        selectedPath={selectedPath}
        onSelect={handleSelectCopy}
        projects={projects}
        projectsLoading={projectsLoading}
        exportCounts={exportCounts}
        onOpenProject={handleOpenProject}
        onDeleteProject={deleteProject}
        onRenameProject={handleRenameProject}
        onNewCarousel={handleNewCarousel}
        activeProjectId={isEditMode ? id : undefined}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        selectedBrand={selectedBrand}
        onChangePersona={handleChangePersona}
      />

      {/* 2. InputSidebar — SEMPRE visivel */}
      <InputSidebar
        carousel={isProjectMode ? null : carousel}
        brand={brand}
        setBrand={setBrand}
        selectedHookIndex={selectedHookIndex}
        setSelectedHookIndex={setSelectedHookIndex}
        templates={templates}
        selectedTemplateSlug={currentSlideTemplateSlug}
        setSelectedTemplateSlug={handleSetCurrentSlideTemplate}
        onApplyTemplateToAll={handleApplyTemplateToAll}
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        setCurrentSlideIndex={setCurrentSlideIndex}
        onUpdateSlide={handleUpdateSlide}
        onUpdateSlideImage={handleUpdateSlideImage}
        onExport={handleExportZip}
        isExporting={isExporting}
        exportProgress={exportProgress}
        userImages={userImages}
        userImagesLoading={userImagesLoading}
        userImagesUploading={userImagesUploading}
        userImagesError={userImagesError}
        onUploadImage={uploadUserImage}
        onDeleteImage={removeUserImage}
        userId={user?.id}
        onAIImageUploaded={handleAIImageUploaded}
        brands={brands}
        brandsLoading={brandsLoading}
        selectedBrand={selectedBrand}
        onSelectBrand={selectBrand}
        onCreateBrand={createBrand}
        isNewMode={isProjectMode}
        projectName={carouselProject.project?.name}
        onAddSlide={carouselProject.addSlide}
        onRemoveSlide={carouselProject.removeSlide}
        onMoveSlide={carouselProject.moveSlide}
        contentTab={contentTab}
        onContentTabChange={setContentTab}
        onGenerateCarousel={handleGenerateCarousel}
        generatingCarousel={generatingCarousel}
        onSubmitText={handleSubmitText}
        clients={clients}
        selectedPath={selectedPath}
        onSelectCopy={handleSelectCopy}
        onApplyTemplateSlots={handleApplyTemplateSlots}
        onUpdateSlideStyle={handleUpdateSlideStyle}
      />

      {/* 3. Preview (flex-1, SEMPRE visivel) */}
      <main className="flex-1 flex flex-col h-full relative bg-black">

        {/* Oraculo Result Banner (B-20) */}
        {oraculoResult && (
          <div className={`absolute top-0 left-0 right-0 z-[60] px-4 py-2 flex items-center justify-between text-[10px] ${
            oraculoResult.approved
              ? 'bg-emerald-950/80 border-b border-emerald-500/20'
              : 'bg-red-950/80 border-b border-red-500/20'
          }`}>
            <div className="flex items-center space-x-2">
              <span className={`font-bold ${oraculoResult.approved ? 'text-emerald-400' : 'text-red-400'}`}>
                Oráculo: {oraculoResult.score}/100 {oraculoResult.approved ? '✓ Aprovado' : '✗ Reprovado'}
              </span>
              {oraculoResult.issues.length > 0 && (
                <span className="text-zinc-400">
                  — {oraculoResult.issues.slice(0, 2).join(' · ')}
                  {oraculoResult.issues.length > 2 ? ` (+${oraculoResult.issues.length - 2})` : ''}
                </span>
              )}
            </div>
            <button
              onClick={() => setOraculoResult(null)}
              className="text-zinc-500 hover:text-white transition-colors ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Admin mode indicator (B-21) */}
        {isAdmin && (
          <div className="absolute top-0 left-4 z-[55] px-2 py-0.5 bg-amber-500/20 rounded-b text-[8px] text-amber-500 font-bold uppercase tracking-widest">
            Admin Local
          </div>
        )}

        {/* Top bar com acoes */}
        {hasContent && (
          <div className="absolute top-0 right-0 p-5 flex items-center space-x-3 z-50">
            {isProjectMode && carouselProject.project && (
              <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider mr-2">
                {carouselProject.project.name}
              </span>
            )}

            {isProjectMode && (
              <div className="flex items-center space-x-1 mr-2">
                {autoSave.saving ? (
                  <div className="flex items-center space-x-1 text-[9px] text-zinc-500">
                    <div className="w-3 h-3 border border-zinc-500 border-t-white rounded-full animate-spin" />
                    <span>Salvando...</span>
                  </div>
                ) : autoSave.isDirty ? (
                  <div className="flex items-center space-x-1 text-[9px] text-amber-600">
                    <CloudOff className="w-3 h-3" />
                    <span>Nao salvo</span>
                  </div>
                ) : autoSave.lastSavedAt ? (
                  <div className="flex items-center space-x-1 text-[9px] text-green-600">
                    <Cloud className="w-3 h-3" />
                    <span>Salvo</span>
                  </div>
                ) : null}
              </div>
            )}

            {isProjectMode && (
              <button
                onClick={handleSaveProject}
                disabled={autoSave.saving || !autoSave.isDirty}
                className={`flex items-center space-x-1.5 px-3 py-2 border rounded-lg text-xs font-medium transition-colors ${
                  autoSave.isDirty
                    ? 'border-white/20 hover:bg-white/5 text-white'
                    : 'border-white/5 text-zinc-600 cursor-default'
                }`}
                title="Salvar projeto"
              >
                <Save className="w-3 h-3" />
                <span>Salvar</span>
              </button>
            )}

            <ExportButton
              slidesCount={slides.length}
              isExporting={isExporting}
              progress={exportProgress}
              onExport={handleExportZip}
              variant="topbar"
            />
          </div>
        )}

        {/* Carousel viewport */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">

          {/* Preview vazio quando nao tem conteudo */}
          {!hasContent && !isProjectMode && templates.length > 0 && (
            <div className="relative">
              <div className="shadow-2xl shadow-black/80 ring-1 ring-white/10 rounded-[2rem] opacity-30">
                <TemplateRenderer
                  template={templates[0]}
                  slide={{
                    id: 'placeholder',
                    content: 'Selecione uma copia no painel esquerdo',
                    isHook: true,
                    darkMode: false,
                    footerText: '',
                    templateSlug: templates[0]?.slug || 'twitter-branco',
                  }}
                  brand={brand}
                  isActive={false}
                  onUpdate={() => {}}
                  slideNumber={1}
                />
              </div>
            </div>
          )}

          {!hasContent && isProjectMode && (
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-zinc-600 text-sm">Criando projeto...</p>
            </div>
          )}

          {hasContent && currentSlide && currentSlideTemplate && (
            <>
              <div className="relative">
                <button
                  onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                  disabled={currentSlideIndex === 0}
                  className="absolute -left-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-0 text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="shadow-2xl shadow-black/80 ring-1 ring-white/10 rounded-[2rem]">
                  <TemplateRenderer
                    template={currentSlideTemplate}
                    slide={currentSlide}
                    brand={brand}
                    isActive={true}
                    onUpdate={handleUpdateSlide}
                    slideNumber={currentSlideIndex + 1}
                  />
                </div>

                <button
                  onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                  disabled={currentSlideIndex === slides.length - 1}
                  className="absolute -right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-0 text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Indicators */}
              <div className="mt-6 flex items-center space-x-2 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
                <span>Slide {currentSlideIndex + 1}/{slides.length}</span>
                <div className="flex space-x-1 ml-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlideIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === currentSlideIndex ? 'bg-zinc-400' : 'bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Toast + Export history */}
              <div className="absolute bottom-5 right-5 flex flex-col items-end space-y-2">
                {isProjectMode && projectExports.length > 0 && (
                  <div className="bg-[#09090b] border border-white/10 px-4 py-3 rounded-lg shadow-2xl w-64">
                    <ExportHistory exports={projectExports} loading={exportsLoading} />
                  </div>
                )}
                <div className="flex items-center space-x-2 bg-[#09090b] border border-white/10 px-4 py-3 rounded-lg shadow-2xl">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-medium text-white">{slides.length} Slides</span>
                  <span className="text-[9px] text-zinc-600 ml-1">
                    {currentSlideTemplate.nome}
                  </span>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </>
  );
};
