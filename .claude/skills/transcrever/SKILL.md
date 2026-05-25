---
name: transcrever
description: |
  Transcreve vídeos e áudios usando OpenAI Whisper local (sem API paga).
  Otimiza o áudio para mono 16kHz + 2x speed, reduzindo tempo e memória pela metade.
  Suporta português e inglês. Salva em outputs/transcricoes/ do projeto Castelo Forte.

  Use: `/transcrever caminho/do/video.mp4` ou `/transcrever caminho/do/audio.mp3 en large 1`
---

# Transcrever Vídeo/Áudio — Castelo Forte

Versão local da skill `transcrever` adaptada pro projeto. Usa o script Whisper compartilhado do legacy.

## Como executar

```bash
bash /Users/julianotorriani/claude/legacy/copy-clientes/infrastructure/services/transcrever/scripts/transcrever.sh \
  "<arquivo>" "<idioma>" "<modelo>" "<velocidade>"
```

**Defaults:**
- `idioma` = pt
- `modelo` = medium
- `velocidade` = 2

**Argumentos:**
- `<arquivo>`: caminho do MP4/MP3/WAV (absoluto ou relativo)
- `<idioma>`: pt | en
- `<modelo>`: tiny | base | small | medium | large
- `<velocidade>`: 1 | 1.5 | 2 (multiplicador de speed pra acelerar Whisper)

## Output canônico no Castelo Forte

Depois que o script terminar, MOVA o output pra:

```
outputs/transcricoes/{slug}.md
outputs/transcricoes/{slug}.json   # opcional, segments com timestamps
```

Onde `{slug}` é o nome base do arquivo de entrada (sem extensão).

## Casos de uso típicos

| Material | Comando |
|---|---|
| Prédica de domingo | `/transcrever culto-2026-05-25-pastor.mp4` |
| Aula gravada da liderança | `/transcrever aula-lideres-2026-05-23.mp4` |
| Live do Instagram | `/transcrever live-instagram-2026-05-20.mp4` |
| Áudio rápido do pastor | `/transcrever audio-pastor.mp3 pt small 2` |

## Próximo passo recomendado depois de transcrever

Depois de gerar o MD da transcrição, considere:

1. **Rodar `/aula-gravada`** se for prédica/culto pra virar material editorial denso
2. **Passar pro `@content-chief` com `*multiplicar`** pra virar 30+ peças
3. **Validar com `@content-validator`** antes de publicar

## Regras inegociáveis

- Sem travessão (—, –) no MD final
- Português brasileiro completo (acentos preservados)
- Citações bíblicas preservadas no original (não parafrasear)
- Output em `outputs/transcricoes/`, nunca dentro de `squads/`
