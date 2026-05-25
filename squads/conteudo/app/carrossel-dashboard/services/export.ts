import { toPng } from 'html-to-image';
import JSZip from 'jszip';

export interface ExportProgress {
  current: number;
  total: number;
  status: 'idle' | 'rendering' | 'zipping' | 'done' | 'error';
  message: string;
}

export interface ExportOptions {
  width: number;
  height: number;
  pixelRatio: number;
  projectName: string;
}

const DEFAULT_OPTIONS: ExportOptions = {
  width: 1080,
  height: 1350,
  pixelRatio: 1,
  projectName: 'carrossel',
};

/**
 * Renderiza um node DOM como PNG blob (base64)
 */
async function renderSlideAsPng(
  node: HTMLDivElement,
  options: Pick<ExportOptions, 'width' | 'height' | 'pixelRatio'>
): Promise<string> {
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: options.pixelRatio,
    width: options.width,
    height: options.height,
    // Garantir qualidade consistente com fontes e imagens
    skipAutoScale: true,
    includeQueryParams: true,
  });

  // Extrair base64 do data URL
  const base64Data = dataUrl.split(',')[1];
  if (!base64Data) {
    throw new Error('Falha ao gerar PNG: data URL invalido');
  }
  return base64Data;
}

/**
 * Exporta todos os slides como ZIP com PNGs individuais.
 * Cada slide e renderizado com seu template individual via refs do DOM.
 *
 * @param exportRefs - Array de refs para os nodes DOM dos slides (ja renderizados com TemplateRenderer)
 * @param options - Configuracoes de export (dimensoes, nome do projeto)
 * @param onProgress - Callback para atualizar progresso na UI
 * @returns Blob do ZIP pronto para download
 */
export async function exportSlidesToZip(
  exportRefs: (HTMLDivElement | null)[],
  options: Partial<ExportOptions> = {},
  onProgress?: (progress: ExportProgress) => void
): Promise<Blob> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const zip = new JSZip();
  const total = exportRefs.filter(Boolean).length;

  if (total === 0) {
    throw new Error('Nenhum slide para exportar');
  }

  // Renderizar cada slide
  for (let i = 0; i < exportRefs.length; i++) {
    const node = exportRefs[i];
    if (!node) continue;

    onProgress?.({
      current: i + 1,
      total,
      status: 'rendering',
      message: `Renderizando slide ${i + 1} de ${total}...`,
    });

    try {
      const base64Data = await renderSlideAsPng(node, {
        width: opts.width,
        height: opts.height,
        pixelRatio: opts.pixelRatio,
      });

      const filename = `slide-${String(i + 1).padStart(2, '0')}.png`;
      zip.file(filename, base64Data, { base64: true });
    } catch (error) {
      console.error(`Erro ao renderizar slide ${i + 1}:`, error);
      throw new Error(`Falha ao renderizar slide ${i + 1}: ${(error as Error).message}`);
    }
  }

  // Compactar ZIP
  onProgress?.({
    current: total,
    total,
    status: 'zipping',
    message: 'Compactando ZIP...',
  });

  const blob = await zip.generateAsync({ type: 'blob' });

  onProgress?.({
    current: total,
    total,
    status: 'done',
    message: 'Export concluido!',
  });

  return blob;
}

/**
 * Gera o nome do arquivo ZIP baseado no projeto
 */
export function getZipFilename(projectName?: string, carouselId?: string): string {
  if (projectName) {
    // Sanitizar nome do projeto para uso como filename
    const sanitized = projectName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `${sanitized || 'carrossel'}.zip`;
  }
  if (carouselId) {
    return `${carouselId}-carrossel.zip`;
  }
  return 'carrossel.zip';
}

/**
 * Faz download de um Blob como arquivo
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Limpar URL apos pequeno delay para garantir download
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
