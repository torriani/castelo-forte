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

  // ─── Captions (modo edit — cinema-style subtitles) ─────
  captionsEdit: {
    /** Modo: "cinema" = frases completas estilo filme, "karaoke" = palavra a palavra */
    mode: "cinema" as const,
    fontSize: 20,
    fontSizeEmphasis: 20,
    gap: "4px 6px",
    maxWidth: "82%",
    padding: "0px",
    backgroundColor: "transparent",
    borderRadius: 0,
    activeColor: "#FFFFFF",
    emphasisColor: "#FFFFFF",
    pastColor: "#FFFFFF",
    futureColor: "#FFFFFF",
    activeScale: 1.0,
    shadow: "none",
    /** Karaoke-only: quantas palavras aparecem por vez */
    windowSize: 3,
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
    sizeTopRight: 0.50,
    sizeCenter: 0.7,
    sizeBottom: 0.7,
  },
} as const;
