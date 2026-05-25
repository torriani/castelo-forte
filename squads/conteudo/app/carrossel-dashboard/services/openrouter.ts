// Service para comunicacao com o backend de geracao de imagens via OpenRouter
// A API key fica no backend (vite middleware) — nunca exposta no frontend

export interface GenerateImageResult {
  imageUrl: string;
  error: null;
}

export interface GenerateImageError {
  imageUrl: null;
  error: string;
}

export type GenerateImageResponse = GenerateImageResult | GenerateImageError;

// Gerar imagem via backend endpoint
export async function generateImage(prompt: string): Promise<GenerateImageResponse> {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Erro desconhecido' }));

      if (response.status === 429) {
        return { imageUrl: null, error: 'Limite de geracoes atingido. Aguarde 1 minuto.' };
      }

      return { imageUrl: null, error: data.error || `Erro ${response.status}` };
    }

    const data = await response.json();

    if (!data.imageUrl) {
      return { imageUrl: null, error: 'Nenhuma imagem retornada pela IA.' };
    }

    return { imageUrl: data.imageUrl, error: null };
  } catch (err: any) {
    return { imageUrl: null, error: `Erro de conexao: ${err.message}` };
  }
}
