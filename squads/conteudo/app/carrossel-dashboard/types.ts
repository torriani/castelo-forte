
// === Dados parseados do markdown ===

export interface ParsedHook {
  type: string; // VIRAL, IMPERIAL
  text: string;
}

export interface ParsedSlide {
  number: number;
  label: string; // "HOOK", "CONTEXTO DO SEGREDO", etc.
  text: string;  // conteudo do slide (sem notas de producao)
}

export interface ParsedCarousel {
  id: string;
  title: string;
  hooks: ParsedHook[];
  slides: ParsedSlide[];
  caption: string;
  metadata: Record<string, string>;
  filePath: string;
  hasImages: boolean;
}

// === Dados para preview ===

export type LayoutStyle = 'twitter' | 'twitter-black' | 'twitter-branco';

export type LayoutPreset = 'padrao' | 'impacto' | 'texto-top' | 'imagem-top' | 'balao-baixo' | 'lista' | 'balao-top';

export interface SlideData {
  id: string;
  content: string;
  isHook: boolean;
  darkMode: boolean;
  footerText: string;
  templateSlug: string;
  imageUrl?: string;
  fontFamily?: string;
  fontSize?: number;
  layoutPreset?: LayoutPreset;
  paddingPct?: number;
}

export interface BrandProfile {
  id?: string;
  name: string;
  handle: string;
  avatarUrl: string;
  isVerified: boolean;
  // Campos extras para editorial (do banco)
  marcaNome?: string;
  marcaIconeUrl?: string;
  tagline?: string;
  categoria?: string;
  // Cores
  corPrimaria?: string;
  corSecundaria?: string;
  corAccent?: string;
}

// === Templates do banco ===

export interface ZonaHeader {
  tipo: string;
  ativo: boolean;
  posicao: string;
}

export interface ZonaHeaderBar {
  ativo: boolean;
  marca_posicao: string;
  linha_separadora?: boolean;
  categoria_posicao?: string | null;
}

export interface ZonaTexto {
  cor: string;
  peso: string;
  ativo: boolean;
  fonte: string;
  tamanho: number;
  alinhamento: string;
  posicao?: string;
  numerado?: boolean;
  bold_parcial?: boolean;
}

export interface ZonaImagem {
  ativo: boolean;
  formato: string;
  overlay: boolean;
  posicao: string;
  quantidade: number;
  layout_fotos?: string;
  overlay_gradient?: string;
}

export interface ZonaFooterBar {
  ativo: boolean;
  icone_posicao: string;
  marca_posicao: string;
}

export interface CarouselTemplate {
  id: string;
  slug: string;
  nome: string;
  familia: 'twitter' | 'editorial';
  descricao: string | null;
  background: string;
  proporcao: string;
  dark_mode: boolean;
  zona_header: ZonaHeader | null;
  zona_header_bar: ZonaHeaderBar | null;
  zona_titulo: ZonaTexto | null;
  zona_subtitulo: ZonaTexto | null;
  zona_body: ZonaTexto | null;
  zona_imagem: ZonaImagem | null;
  zona_footer_bar: ZonaFooterBar | null;
  ordem: number;
  ativo?: boolean;
}

// === Arvore de navegacao ===

export interface CarouselFile {
  name: string;
  file: string;
  path: string;
  hasImages: boolean;
}

export interface Campaign {
  name: string;
  carousels: CarouselFile[];
}

export interface Client {
  name: string;
  campaigns: Campaign[];
}

export interface BrowseResponse {
  clients: Client[];
}

// === Projeto de carrossel (modo novo, sem MD) ===

export interface CarouselProject {
  id: string;
  name: string;
  defaultTemplateSlug: string;
  slides: SlideData[];
  brand: BrandProfile;
  status: 'draft' | 'exported';
  createdAt: string;
  updatedAt: string;
}
