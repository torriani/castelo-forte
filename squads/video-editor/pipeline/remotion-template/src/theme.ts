/**
 * Theme — Estilo padrao para todos os templates do video editor.
 *
 * Altere os valores aqui e abra o Remotion Studio (`npm start`)
 * para pre-visualizar em tempo real.
 */

export const theme = {
  // ─── Fontes ──────────────────────────────────────────────
  font: {
    family: "Inter, system-ui, -apple-system, sans-serif",
    weight: 900 as const,
    textTransform: "uppercase" as const,
    lineHeight: 1.15,
  },

  // ─── Captions (modo clip — top half) ─────────────────────
  captionsClip: {
    fontSize: 72,
    fontSizeEmphasis: 88,
    gap: "16px 24px",
    activeColor: "#FFFFFF",
    emphasisColor: "#FFE600",
    pastColor: "#AAAAAA",
    pastOpacity: 0.45,
    futureColor: "#AAAAAA",
    futureOpacity: 0.7,
    activeScale: 1.15,
    activeShadow: "0 4px 24px rgba(0,0,0,0.8)",
    inactiveShadow: "0 2px 8px rgba(0,0,0,0.5)",
  },

  // ─── Captions (modo edit — bottom third) ─────────────────
  captionsEdit: {
    fontSize: 48,
    fontSizeEmphasis: 56,
    gap: "12px 20px",
    maxWidth: "85%",
    padding: "20px 40px",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 16,
    activeColor: "#FFFFFF",
    emphasisColor: "#FFE600",
    pastColor: "rgba(255,255,255,0.5)",
    futureColor: "rgba(255,255,255,0.75)",
    activeScale: 1.1,
    shadow: "0 2px 12px rgba(0,0,0,0.8)",
  },

  // ─── Background ──────────────────────────────────────────
  background: "#0a0a0a",

  // ─── Overlay ─────────────────────────────────────────────
  overlay: {
    fadeDuration: 0.3,
    borderRadius: 12,
    shadow: "0 20px 60px rgba(0,0,0,0.6)",
    fullscreenBg: "rgba(0,0,0,0.85)",
    /** Tamanho relativo da imagem por posicao (fracao da largura) */
    sizeTopRight: 0.35,
    sizeCenter: 0.7,
    sizeBottom: 0.7,
  },
} as const;
