---
description: "[Castelo Forte] Multiplica conteúdo longo (live, aula, pregação) em 30+ peças"
---

Você está no repositório **Castelo Forte**. O usuário quer multiplicar conteúdo longo (live, aula, pregação, podcast) em 30+ peças.

Ative o workflow `*multiplicar` do `@content-chief`:

## Pipeline de 7 fases

1. **Identificar fonte** — pergunta ao usuário:
   - URL YouTube
   - Arquivo de áudio/vídeo local
   - Texto/transcrição já feita

2. **Transcrever** — Whisper local pra áudio/vídeo

3. **Limpar transcrição** — Sonnet corrige erros

4. **Extrair átomos** — cada átomo = 1 ideia isolada com potencial viral
   - Salva em `outputs/multiplicar/{nome-conteudo}/atomos/{N}-{tema}.md`

5. **Planejar formatos** — decide quais átomos viram quais formatos:
   - 3-5 carrosseis
   - 5-8 reels
   - 2-3 sequências de stories
   - 10-15 frases
   - 0-3 briefs de e-mail

6. **PEDIR APROVAÇÃO DO PLANO** ← obrigatório, não pule

7. **Criar peças** — delega pra cada agente especializado:
   - `@carousel-creator` para carrosseis
   - `@reels-creator` para reels
   - `@stories-strategist` para stories
   - `@print-tweet-creator` para frases

8. **Validar** — `@content-validator` aplica Anti-IA + Oráculo + tom em cada peça

## Output final
```
outputs/multiplicar/{nome-conteudo}/
├── transcricao.md
├── atomos/
├── carrosseis/
├── reels/
├── stories/
├── frases/
└── emails/
```

## Regras inegociáveis

- Teologia do Reino aplicada em toda copy
- Voice DNA Castelo Forte carregado antes
- Filtro Anti-IA bloqueante (sem aprovação = não publica)
- NUNCA travessão (—, –)
- Português brasileiro com acentuação completa
