# Transcrever Conteudo de Concorrentes

name: transcribe-content
executor: competitor-analyst
description: Transcrever videos de concorrentes (Reels, YouTube, TikTok) em texto estruturado para analise de padroes
elicit: true
pre_conditions:
  - URL do video acessivel e valida
  - Ferramentas de transcricao disponiveis (Whisper API ou yt-text)
  - Frameworks de reels disponiveis em data/reels-framework.md para analise estrutural

## INPUTS

- **URL do video:** link do reels, YouTube ou TikTok (obrigatorio)
- **Handle do concorrente:** @usuario (obrigatorio)
- **Plataforma:** Instagram Reels, YouTube, TikTok (obrigatorio)
- **Quantidade:** quantos videos transcrever (default: 1)
- **Contexto:** nicho do concorrente (opcional — melhora a analise)

## STEPS

1. Receber URL(s) e identificar plataforma
2. Extrair audio do video
3. Transcrever audio completo em texto
4. Estruturar transcricao em blocos:
   - Hook (0-3 segundos)
   - Retencao (3-10 segundos)
   - Conteudo (corpo principal)
   - CTA (final)
5. Identificar framework usado (BLAZE, PCS, outro)
6. Anotar: tom, ritmo, edicao, padroes visuais
7. Marcar palavras/frases de gatilho emocional
8. Entregar transcricao estruturada com anotacoes

## VETO CONDITIONS

- Se nao tem URL do video → NAO executar, pedir
- Se transcricao e so texto corrido sem estrutura → Estruturar em blocos
- Se nao identifica hook e CTA → Marcar explicitamente
- Se nao anota padroes (tom, ritmo, framework) → Adicionar
- Se transcricao tem erros grosseiros → Revisar

## OUTPUT EXAMPLE

```
TRANSCRICAO — @handle — [Plataforma]
Video: [URL]
Duracao: [tempo]
Views: [numero]

HOOK (0-3s):
"Pare de criar conteudo se voce quer vender."

RETENCAO (3-10s):
"Eu sei que parece contraintuitivo, mas o maior erro de 90% dos especialistas e..."

CONTEUDO (10s-50s):
"[transcricao completa do corpo]"

CTA (50s-60s):
"Salva esse video e me segue pra mais."

ANALISE:
- Framework: BLAZE (Bold statement + Loop + Action)
- Tom: Provocativo/autoritario
- Ritmo: Rapido, cortes a cada 3-5s
- Edicao: Jump cuts, legendas grandes
- Palavras-gatilho: "pare", "erro", "90%", "contraintuitivo"
- Padrao viral: Afirmacao contraintuitiva + dados + CTA simples
```

## COMPLETION CRITERIA

- Transcricao completa e precisa do audio
- Estruturada em blocos (Hook, Retencao, Conteudo, CTA)
- Framework identificado
- Tom, ritmo e edicao anotados
- Palavras/frases de gatilho marcadas
- Padrao viral identificado
- Formato utilizavel para analise posterior

## Output Example

```
## TRANSCRICAO — Reels @mentorpedro "Pare de dar desconto"

Fonte: Instagram Reels | Duracao: 32s | Idioma: PT-BR

### Transcricao Estruturada
[HOOK 0-3s]
"Se voce da desconto, voce ta dizendo pro cliente que seu preco e mentira."

[DESENVOLVIMENTO 3-25s]
"O problema nao e o cliente pedindo desconto.
E voce aceitando. Toda vez que voce abaixa o preco,
voce abaixa sua autoridade junto."

[CTA 25-32s]
"Da proxima vez que pedirem desconto, fala:
o preco e esse porque o resultado e esse."

### Analise de Padrao
- Hook: Afirmacao polemica (alta retencao)
- Estrutura: Problema → Reframe → Solucao pratica
- Padrao viral: "Se voce faz X, esta fazendo Y" (confronto direto)
- Engajamento: 4.2% (acima do baseline 2.8%)
```

references:
  - data/reels-framework.md
  - data/reels-patterns.md
  - data/competitor-frameworks.md

### Veto Conditions

- id: "CONT_TRANSCRIBE_CONTENT_001"
  condition: "URL do video nao fornecida ou invalida"
  check: "Verificar se URL e acessivel e plataforma e suportada (Instagram, YouTube, TikTok)"
  result: "VETO - BLOCK. Solicitar URL valida antes de iniciar transcricao"
  rationale: "Sem URL valida, nao ha video para transcrever"

- id: "CONT_TRANSCRIBE_CONTENT_002"
  condition: "Transcricao entregue como texto corrido sem estrutura em blocos"
  check: "Verificar se transcricao esta estruturada em blocos (Hook, Retencao, Conteudo, CTA)"
  result: "VETO - BLOCK. Estruturar transcricao em blocos antes de entregar"
  rationale: "Transcricao nao estruturada nao permite analise de padroes de hook e framework"

### Completion Criteria

- [ ] Transcricao completa e precisa do audio estruturada em blocos (Hook, Retencao, Conteudo, CTA)
- [ ] Framework do concorrente identificado (BLAZE, PCS ou outro)
- [ ] Tom, ritmo e edicao anotados com palavras/frases de gatilho marcadas
- [ ] Padrao viral identificado e formato utilizavel para analise posterior
