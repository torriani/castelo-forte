import type { VercelRequest, VercelResponse } from '@vercel/node';

// Rate limiting simples em memoria (por instancia serverless)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minuto
const RATE_LIMIT_MAX = 5; // max 5 geracoes por minuto

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT_MAX) {
    return false;
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo nao permitido. Use POST.' });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Campo "prompt" obrigatorio.' });
    }

    // Rate limiting por IP
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.socket?.remoteAddress
      || 'unknown';

    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ error: 'Limite de geracoes atingido. Aguarde 1 minuto.' });
    }

    // Verificar API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY nao configurada no servidor.' });
    }

    // Chamar OpenRouter — endpoint de geracao de imagem
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://carrossel-dashboard.vercel.app',
        'X-Title': 'Carrossel Dashboard',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        prompt,
        n: 1,
        size: '1024x1024',
      }),
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('OpenRouter error:', openRouterResponse.status, errorData);

      // Fallback: tentar via chat completions
      const chatResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://carrossel-dashboard.vercel.app',
          'X-Title': 'Carrossel Dashboard',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-exp:free',
          messages: [
            {
              role: 'user',
              content: `Generate an image: ${prompt}. Return ONLY the image, no text.`,
            },
          ],
        }),
      });

      if (!chatResponse.ok) {
        const chatError = await chatResponse.json().catch(() => ({}));
        return res.status(502).json({
          error: `Erro ao gerar imagem: ${(chatError as any)?.error?.message || openRouterResponse.statusText}`,
        });
      }

      const chatData = await chatResponse.json() as any;
      const content = chatData?.choices?.[0]?.message?.content || '';
      const imageUrlMatch = content.match(/https?:\/\/[^\s"'\]]+\.(png|jpg|jpeg|webp|gif)/i);

      if (imageUrlMatch) {
        return res.status(200).json({ imageUrl: imageUrlMatch[0] });
      }

      // Verificar inline image data (base64)
      const parts = chatData?.choices?.[0]?.message?.parts || [];
      for (const part of parts) {
        if (part?.inline_data?.mime_type?.startsWith('image/')) {
          const dataUrl = `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`;
          return res.status(200).json({ imageUrl: dataUrl });
        }
      }

      return res.status(502).json({ error: 'Nao foi possivel gerar a imagem. Tente outro prompt.' });
    }

    const data = await openRouterResponse.json() as any;
    const imageUrl = data?.data?.[0]?.url || data?.data?.[0]?.b64_json;

    if (!imageUrl) {
      return res.status(502).json({ error: 'Nenhuma imagem retornada pela IA.' });
    }

    // Se for base64, converter para data URL
    const finalUrl = imageUrl.startsWith('http')
      ? imageUrl
      : `data:image/png;base64,${imageUrl}`;

    return res.status(200).json({ imageUrl: finalUrl });

  } catch (err: any) {
    console.error('Erro no endpoint /api/generate-image:', err);
    return res.status(500).json({ error: `Erro interno: ${err.message}` });
  }
}
