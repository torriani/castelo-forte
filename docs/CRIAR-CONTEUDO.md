# CRIAR CONTEÚDO — Fluxos Passo a Passo

Como criar cada tipo de peça neste squad. Todos os fluxos passam pelo **Content Chief**.

---

## Antes de começar (sempre)

1. `cd ~/clientes/castelo-forte/squad`
2. `claude` (abre Claude Code dentro do squad)
3. `@content-chief` (ativa o orquestrador)

O Chief carrega automaticamente:
- Voice DNA da Castelo Forte (`workspace/businesses/igreja-castelo-forte/brand/voice/`)
- Regras inviolaveis (`squads/conteudo/data/regras-inviolaveis.md`)
- Filtro Anti-IA (`squads/conteudo/checklists/filtro-anti-ia.md`)

---

## Fluxo 1: Carrossel

### Caminho rápido (recomendado)
```
@content-chief
*briefing
```

O Chief vai te perguntar (no máximo 2 perguntas):
- **"Para qual objetivo?"** → atrair / mudar percepção / esquentar quem segue / vender
- **"Sobre o que?"** → tema/conceito

Com base na resposta, ele prescreve:
- Tipo de post (Imperial, Polêmico, Crença, Problema, História, Oferta)
- Framework de copy (Abertura Curiosa, Autoridade, Problema/Solução, etc)
- Quantidade de slides (1, 3, 5, 7 ou 10)
- Tipo de abertura
- Template visual

Você aprova → o `@carousel-creator` escreve → o `@content-validator` valida → PNG renderizado.

### Caminho direto (se você já sabe o que quer)
```
@content-chief
*carrossel
```

Te pede o briefing direto e vai criar.

### Onde o resultado fica
```
outputs/campanhas/{campanha}/carrosseis/{slug}/
├── post.md          # texto fonte (cada slide)
├── post.json        # dados estruturados pro gerador
├── slide-01.png     # ... até slide-10.png
└── legenda.md       # caption do Instagram
```

### Checklist antes de marcar pronto
- [ ] Voice DNA aplicado (tom Castelo Forte, não genérico)
- [ ] Passou pelo filtro Anti-IA (`bash squads/conteudo/scripts/validate-anti-ia.sh post.md`)
- [ ] Passou pelo Oráculo (score >= 80%, faz parte do `@content-validator`)
- [ ] PNGs renderizados corretamente (abrir e olhar)
- [ ] Legenda escrita (não é só copiar slides)

---

## Fluxo 2: Reels

### Comando
```
@content-chief
*reels
```

Vai pedir:
- Tema/mensagem central
- Duração alvo (15s / 30s / 60s / 90s)
- Tipo (educativo / inspiracional / convocação / depoimento)

O `@reels-creator` entrega:
- Roteiro com timestamps
- Texto na tela (frase por frase)
- Sugestão de B-roll / cortes
- Música/áudio sugerido (livre de copyright quando possível)
- Hook das primeiras 2 segundos (crítico)
- Legenda do post

### Onde fica
```
outputs/reels/{slug}/
├── roteiro.md
├── timestamps.md
└── legenda.md
```

---

## Fluxo 3: Stories

### Comando
```
@content-chief
*stories
```

Vai pedir:
- Objetivo (engajamento / convocação / quebra de objeção / venda / aquecimento)
- Quantidade de stories (3, 5, 7, ou sequência maior)

O `@stories-strategist` entrega uma **sequência** (não stories soltos):
- Story 1: gancho (PAS, Curiosidade, ou Pergunta)
- Stories 2-N: desenvolvimento + interação (enquetes, caixinhas, sliders)
- Story final: CTA claro (link, DM, próximo passo)

### Onde fica
```
outputs/stories/{slug}/
├── sequencia.md     # cada story numerado
├── interacoes.md    # quais enquetes/caixinhas usar
└── visuais.md       # descrição do que vai no fundo de cada story
```

---

## Fluxo 4: Campanha multi-formato (E1-E8)

Use quando for um **lançamento ou tema integrado** (não 1 post solto).

### Comando
```
@content-chief
*campanha
```

O Chief delega pro `@strategist` que monta uma das 8 estratégias:
- **E1** — Lançamento de Pressão (5 dias, urgência crescente)
- **E2** — Aquecimento Suave (10-14 dias, baixa pressão)
- **E3** — Doutrina Silenciosa (sem oferta, só constrói autoridade)
- **E4** — Quebra de Objeção (foco em destruir 1-3 crenças)
- **E5** — Lançamento Híbrido (E1 + E4 combinados)
- **E6** — Reativação de Lista (foca em quem já é da casa)
- **E7** — Manifesto / Posicionamento (declara identidade)
- **E8** — Convocação para evento (presencial ou online)

Cada campanha distribui peças entre feed + stories + reels ao longo dos dias.

### Onde fica
```
outputs/campanhas/{slug-campanha}/
├── PLANO.md                # estratégia + cronograma dia a dia
├── dia-01/
│   ├── carrossel.md
│   ├── stories.md
│   └── reels.md (se houver)
├── dia-02/
├── ...
└── arsenais/
    ├── headlines.md
    └── angulos.md
```

---

## Fluxo 5: Multiplicar conteúdo longo (live, aula, podcast)

Use quando tem 1 conteúdo grande e quer gerar **30+ peças** a partir dele.

### Comando
```
@content-chief
*multiplicar
```

Vai te perguntar a fonte:
- URL YouTube
- Arquivo de áudio/vídeo local
- Texto/transcrição já feita

Pipeline:
1. **Transcrever** (Whisper local se for áudio/vídeo)
2. **Limpar transcrição** (Sonnet)
3. **Extrair átomos** (1 átomo = 1 ideia isolada com potencial viral)
4. **Planejar formatos** (Chief decide quais átomos viram quais formatos)
5. **Pedir aprovação do plano**
6. **Criar peças** (cada formato com seu agente especializado)
7. **Validar** (Anti-IA + Oráculo)
8. **Distribuir no calendário**

### Onde fica
```
outputs/multiplicar/{nome-conteudo}/
├── transcricao.md
├── atomos/
│   └── {N}-{tema}.md
├── carrosseis/
├── reels/
├── stories/
├── frases/
├── tela-dividida/
└── emails/                  # briefs pra Squad Copywriters (se houver)
```

---

## Fluxo 6: Print Tweet (frase de reflexão)

Use quando é uma reflexão de 3-12 linhas em fundo branco estilo tweet/X.

### Comando
```
@content-chief
*briefing
# Indica que é um print-tweet
```

Ou direto:
```
@print-tweet-creator
```

### Como funciona
Gera o JSON e roda o gerador:
```bash
cd squads/conteudo/app/image-generator
node generate.mjs --batch ../../../outputs/{slug}/post.json --output ../../../outputs/{slug}/
```

Template padrão: `twitter-branco` (1080x1350, header com avatar + nome + tick).

---

## Fluxo 7: Validar peça pronta (texto que já existe)

Se você recebeu um texto de fora (de alguém da equipe, parceiro, IA gringa) e quer validar antes de usar:

```bash
bash squads/conteudo/scripts/validate-anti-ia.sh /caminho/para/texto.md
```

Exit code 0 = passou. Exit 1 = reprovado, lê o output, corrige, roda de novo.

Pelo Claude Code:
```
@content-validator
# Cola o texto, ele roda Anti-IA + Oráculo + valida tom Castelo Forte
```

---

## Regras inegociáveis (NUNCA violar)

1. **Filtro Anti-IA** é Layer 0, bloqueante. Sem aprovação, não publica.
2. **NUNCA travessão (—, –)** em texto gerado. Substituir por vírgula, ponto, dois pontos, parênteses, ou quebra de linha.
3. **Português brasileiro com acentuação completa** (á, é, ç, ã, õ, ê, í, ó, ú).
4. **Voice DNA da Castelo Forte SEMPRE** carregado antes de criar (não é genérico).
5. **Outputs vão pra `outputs/`**, nunca dentro de `squads/conteudo/`.

---

## Próximos manuais

- Para publicar o que criou: `docs/PUBLICAR.md`
- Para alterar voice DNA, brand, templates: `docs/ALTERAR.md`
- Para baixar carrosseis antigos pra referência: `docs/ARCHIVE.md`
