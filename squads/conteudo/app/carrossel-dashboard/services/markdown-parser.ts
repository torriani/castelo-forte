import { ParsedCarousel, ParsedHook, ParsedSlide } from '../types';

/**
 * Parseia um markdown de carrossel no formato padrao do squad conteudo.
 * Extrai hooks, slides, caption e metadados.
 */
export function parseCarouselMarkdown(content: string, filePath: string): ParsedCarousel {
  const lines = content.split('\n');

  // Extrair titulo (primeiro # header)
  const titleLine = lines.find(l => l.startsWith('# '));
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : 'Sem titulo';

  // Extrair hooks
  const hooks = extractHooks(lines);

  // Extrair slides
  const slides = extractSlides(lines);

  // Extrair caption
  const caption = extractCaption(lines);

  // Extrair metadados
  const metadata = extractMetadata(lines);

  // ID do carrossel (ex: A04)
  const id = metadata['ID'] || filePath.split('/').pop()?.replace('.md', '') || '';

  return {
    id,
    title,
    hooks,
    slides,
    caption,
    metadata,
    filePath,
    hasImages: false
  };
}

function extractHooks(lines: string[]): ParsedHook[] {
  const hooks: ParsedHook[] = [];
  let inHooksSection = false;

  for (const line of lines) {
    if (line.includes('S1_HOOKS:')) {
      inHooksSection = true;
      continue;
    }

    if (inHooksSection) {
      if (line.trim() === '' || line.startsWith('#')) {
        break;
      }

      // Formato: - [VIRAL] "texto" ou - [IMPERIAL] "texto"
      const match = line.match(/^-\s*\[(\w+(?:\s*\d*)?)\]\s*"(.+)"/);
      if (match) {
        hooks.push({
          type: match[1].trim(),
          text: match[2].trim()
        });
      }
    }
  }

  return hooks;
}

function extractSlides(lines: string[]): ParsedSlide[] {
  const slides: ParsedSlide[] = [];
  let inCarouselSection = false;
  let currentSlide: Partial<ParsedSlide> | null = null;
  let currentText: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detectar inicio da secao de carrossel
    if (line.includes('Carrossel Completo') || line.includes('Carrossel completo')) {
      inCarouselSection = true;
      continue;
    }

    // Parar na secao Caption ou Repurpose ou Metadados
    if (inCarouselSection && /^##\s+(Caption|Repurpose|Metadados|Checklist)/.test(line)) {
      // Salvar slide atual antes de sair
      if (currentSlide && currentText.length > 0) {
        currentSlide.text = cleanSlideText(currentText);
        slides.push(currentSlide as ParsedSlide);
      }
      currentSlide = null;
      currentText = [];
      break;
    }

    if (!inCarouselSection) continue;

    // Detectar header de slide: **S1 — HOOK** ou **S2 — CONTEXTO**
    const slideMatch = line.match(/^\*\*S(\d+)\s*[—–-]\s*(.+?)\*\*/);
    if (slideMatch) {
      // Salvar slide anterior
      if (currentSlide && currentText.length > 0) {
        currentSlide.text = cleanSlideText(currentText);
        slides.push(currentSlide as ParsedSlide);
      }

      currentSlide = {
        number: parseInt(slideMatch[1]),
        label: slideMatch[2].trim(),
      };
      currentText = [];
      continue;
    }

    // Separador --- entre slides
    if (line.trim() === '---') continue;

    // Acumular texto do slide (ignorar linhas vazias no inicio)
    if (currentSlide) {
      // Ignorar notas de producao [entre colchetes]
      if (line.trim().startsWith('[') && line.trim().endsWith(']')) continue;

      // Ignorar linhas vazias
      if (line.trim() === '' && currentText.length === 0) continue;

      currentText.push(line);
    }
  }

  // Ultimo slide
  if (currentSlide && currentText.length > 0) {
    currentSlide.text = cleanSlideText(currentText);
    slides.push(currentSlide as ParsedSlide);
  }

  return slides;
}

function cleanSlideText(lines: string[]): string {
  return lines
    .map(l => l.trim())
    .filter(l => l !== '')
    // Remover aspas envolventes de linhas unicas
    .map(l => {
      if (l.startsWith('"') && l.endsWith('"')) {
        return l.slice(1, -1);
      }
      return l;
    })
    .join('\n');
}

function extractCaption(lines: string[]): string {
  let inCaption = false;
  const captionLines: string[] = [];

  for (const line of lines) {
    if (line.match(/^##\s+Caption/)) {
      inCaption = true;
      continue;
    }

    if (inCaption) {
      if (line.startsWith('##')) break;
      if (line.trim()) {
        // Remover aspas envolventes
        let cleaned = line.trim();
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
          cleaned = cleaned.slice(1, -1);
        }
        captionLines.push(cleaned);
      }
    }
  }

  return captionLines.join('\n');
}

function extractMetadata(lines: string[]): Record<string, string> {
  const metadata: Record<string, string> = {};
  let inMetadata = false;

  for (const line of lines) {
    if (line.match(/^##\s+Metadados/i)) {
      inMetadata = true;
      continue;
    }

    if (inMetadata) {
      if (line.startsWith('##')) break;

      // Formato: - **Key:** Value
      const match = line.match(/^-\s*\*\*(.+?):\*\*\s*(.+)/);
      if (match) {
        metadata[match[1].trim()] = match[2].trim();
      }
    }
  }

  return metadata;
}
