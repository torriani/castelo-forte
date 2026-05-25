import { useState, useCallback } from 'react';
import { SlideData, BrandProfile, CarouselProject } from '../types';
import { DbProject } from '../services/supabase';

const DEFAULT_BRAND: BrandProfile = {
  name: 'Seu Nome',
  handle: 'handle',
  avatarUrl: '',
  isVerified: false,
  marcaNome: '',
  tagline: '',
  categoria: '',
  corAccent: '#d4b995',
};

function generateId(): string {
  return `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function createEmptySlide(templateSlug: string, index: number, total: number, isHook = false): SlideData {
  return {
    id: generateId(),
    content: '',
    isHook,
    darkMode: false,
    footerText: `${index + 1}/${total}`,
    templateSlug,
  };
}

interface UseCarouselProjectReturn {
  project: CarouselProject | null;
  slides: SlideData[];
  brand: BrandProfile;
  setBrand: React.Dispatch<React.SetStateAction<BrandProfile>>;
  currentSlideIndex: number;
  setCurrentSlideIndex: (i: number) => void;
  createProject: (name: string, templateSlug: string) => void;
  loadFromDb: (dbProject: DbProject) => void;
  addSlide: () => void;
  removeSlide: (index: number) => boolean;
  moveSlide: (fromIndex: number, direction: 'up' | 'down') => void;
  updateSlide: (id: string, content: string) => void;
  updateSlideImage: (id: string, imageUrl: string | undefined) => void;
  setSlideTemplate: (slideIndex: number, slug: string) => void;
  applyTemplateToAll: (slug: string) => void;
  defaultTemplateSlug: string;
  setDefaultTemplateSlug: (slug: string) => void;
  setProjectId: (id: string) => void;
  setProjectName: (name: string) => void;
  setProjectStatus: (status: 'draft' | 'exported') => void;
}

export function useCarouselProject(): UseCarouselProjectReturn {
  const [project, setProject] = useState<CarouselProject | null>(null);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [brand, setBrand] = useState<BrandProfile>(DEFAULT_BRAND);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [defaultTemplateSlug, setDefaultTemplateSlug] = useState('twitter-branco');

  // Recalcula footerText de todos os slides
  const recalcFooters = useCallback((slideList: SlideData[]): SlideData[] => {
    return slideList.map((s, i) => ({
      ...s,
      footerText: `${i + 1}/${slideList.length}`,
      isHook: i === 0,
    }));
  }, []);

  const createProject = useCallback((name: string, templateSlug: string) => {
    const now = new Date().toISOString();
    const firstSlide = createEmptySlide(templateSlug, 0, 1, true);

    const newProject: CarouselProject = {
      id: `proj-${Date.now()}`,
      name,
      defaultTemplateSlug: templateSlug,
      slides: [firstSlide],
      brand: DEFAULT_BRAND,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };

    setProject(newProject);
    setSlides([firstSlide]);
    setDefaultTemplateSlug(templateSlug);
    setBrand(DEFAULT_BRAND);
    setCurrentSlideIndex(0);
  }, []);

  // Carregar projeto do banco de dados
  const loadFromDb = useCallback((dbProject: DbProject) => {
    const loadedSlides: SlideData[] = Array.isArray(dbProject.slides) ? dbProject.slides : [];
    const loadedBrand: BrandProfile = dbProject.brand || DEFAULT_BRAND;

    const proj: CarouselProject = {
      id: dbProject.id,
      name: dbProject.name,
      defaultTemplateSlug: dbProject.default_template_slug,
      slides: loadedSlides,
      brand: loadedBrand,
      status: dbProject.status,
      createdAt: dbProject.created_at,
      updatedAt: dbProject.updated_at,
    };

    setProject(proj);
    setSlides(loadedSlides);
    setBrand(loadedBrand);
    setDefaultTemplateSlug(dbProject.default_template_slug);
    setCurrentSlideIndex(0);
  }, []);

  const setProjectId = useCallback((id: string) => {
    setProject(prev => prev ? { ...prev, id } : prev);
  }, []);

  const setProjectName = useCallback((name: string) => {
    setProject(prev => prev ? { ...prev, name } : prev);
  }, []);

  const setProjectStatus = useCallback((status: 'draft' | 'exported') => {
    setProject(prev => prev ? { ...prev, status } : prev);
  }, []);

  const addSlide = useCallback(() => {
    setSlides(prev => {
      const newSlide = createEmptySlide(defaultTemplateSlug, prev.length, prev.length + 1);
      const updated = [...prev, newSlide];
      return recalcFooters(updated);
    });
    // Navegar para o novo slide
    setSlides(prev => {
      setCurrentSlideIndex(prev.length - 1);
      return prev;
    });
  }, [defaultTemplateSlug, recalcFooters]);

  const removeSlide = useCallback((index: number): boolean => {
    let removed = false;
    setSlides(prev => {
      if (prev.length <= 1) return prev; // nao remover o ultimo
      const updated = prev.filter((_, i) => i !== index);
      removed = true;
      return recalcFooters(updated);
    });
    if (removed) {
      setCurrentSlideIndex(prev => {
        if (prev >= index && prev > 0) return prev - 1;
        return prev;
      });
    }
    return removed;
  }, [recalcFooters]);

  const moveSlide = useCallback((fromIndex: number, direction: 'up' | 'down') => {
    setSlides(prev => {
      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
      if (toIndex < 0 || toIndex >= prev.length) return prev;

      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setCurrentSlideIndex(toIndex);
      return recalcFooters(updated);
    });
  }, [recalcFooters]);

  const updateSlide = useCallback((id: string, content: string) => {
    setSlides(prev => prev.map(s => (s.id === id ? { ...s, content } : s)));
  }, []);

  const updateSlideImage = useCallback((id: string, imageUrl: string | undefined) => {
    setSlides(prev => prev.map(s => (s.id === id ? { ...s, imageUrl } : s)));
  }, []);

  const setSlideTemplate = useCallback((slideIndex: number, slug: string) => {
    setSlides(prev =>
      prev.map((s, i) => i === slideIndex ? { ...s, templateSlug: slug } : s)
    );
  }, []);

  const applyTemplateToAll = useCallback((slug: string) => {
    setDefaultTemplateSlug(slug);
    setSlides(prev => prev.map(s => ({ ...s, templateSlug: slug })));
  }, []);

  return {
    project,
    slides,
    brand,
    setBrand,
    currentSlideIndex,
    setCurrentSlideIndex,
    createProject,
    loadFromDb,
    addSlide,
    removeSlide,
    moveSlide,
    updateSlide,
    updateSlideImage,
    setSlideTemplate,
    applyTemplateToAll,
    defaultTemplateSlug,
    setSlides,
    setDefaultTemplateSlug,
    setProjectId,
    setProjectName,
    setProjectStatus,
  };
}
