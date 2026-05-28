# HANDOFF — IGREJA CASTELO FORTE · Campanha Em Cristo

**Última sessão:** 2026-05-17
**Cliente:** igreja-castelo-forte
**Pastor:** Israel Anijar
**Localização:** Jurerê, Florianópolis - SC
**Tom:** Inspirador, acolhedor, criativo. Forte mas sutil.

---

## 🎯 CAMPANHA EM PRODUÇÃO

**Em Cristo · Antecipação (21 dias)**
- **Início:** Segunda 18/05/2026
- **Fim:** Domingo 07/06/2026 (1º culto da série às 09h30)
- **Objetivo:** Lotar série Em Cristo (Efésios) — 4 cultos
- **Total de peças:** 63 (21 frases literais NVI + 21 frases autorais + 21 carrosséis)

---

## 🌐 SITE NO AR (Vercel)

**URL principal:** `https://castelo-forte-ten.vercel.app/briefing/briefingmaio/`

**Estrutura atual:**
```
/briefing/briefingmaio/
├── /                    → Templates (9 combos + V-D Casa Isabel)
├── /casa-isabel/        → 5 carrosseis + 5 frases (estilo Casa Isabel cinza)
├── /inteligencia/       → 15 relatorios + 480 capas scrapadas + dashboards
└── /cta-finais/         → 6 opcoes de CTA final aprovadas
```

**Conta Vercel:** `castelo-forte`
**Alias atribuído:** `castelo-forte-ten.vercel.app` (o `castelo-forte.vercel.app` puro já está ocupado por outro projeto)

---

## ⏭️ PRÓXIMA TAREFA EM ABERTO (Etapa 1/2/3)

Usuário pediu **NOVA ESTRUTURA** em `/conteudo/maio/` (substituindo `/briefing/briefingmaio/`):

```
castelo-forte-ten.vercel.app/conteudo/maio/
├── /              → Dashboard (visão geral, calendário 21 dias, métricas)
├── /templates     → 9 combos + V-D
├── /inteligencia  → Pesquisa (manter conteúdo atual)
└── /conteudo      → 21 frases literais + 21 autorais + 21 carrosséis
```

**Header novo:** Logo Castelo Forte 3D + menu Dashboard · Templates · Inteligência · Conteúdo

### EXECUÇÃO EM 3 ETAPAS

**Etapa 1 (20min) — Estrutura navegável:**
- Criar `/conteudo/maio/` com header novo + menu fixo
- Dashboard com calendário 21 dias, total peças, status
- Páginas placeholder linkadas

**Etapa 2 (30min) — 42 frases renderizadas:**
- 21 frases literais NVI no estilo Casa Isabel (cinza `#efefef` + serif Playfair Italic + Inter)
- 21 frases autorais no mesmo estilo

**Etapa 3 (1-2h) — 21 carrosséis completos:**
- 21 capas com personagens (face swap nano-banana Pro `gemini-3-pro-image-preview`)
- 7 slides por carrossel (capa + 3 tríades + síntese + verso + CTA)
- Slide final variando entre as 6 opções de CTA aprovadas

---

## 🎭 MAPEAMENTO DE PERSONAGENS DAS 21 CAPAS

**Distribuição:** 9 Jesus · 7 Davi · 5 Mateus

| # | Data | Tema | Personagem |
|---|------|------|------------|
| 01 | 18/05 | Deus não depende de você | Davi |
| 02 | 19/05 | Escolhido antes | Jesus |
| 03 | 20/05 | Graça é o oposto de mérito | **Mateus** |
| 04 | 21/05 | Ressuscitou quem estava morto | Jesus |
| 05 | 22/05 | O muro caiu | Jesus |
| 06 | 23/05 | Você é obra dele | Davi |
| 07 | 24/05 | Estrangeiro virou família | Mateus |
| 08 | 25/05 | Plano oculto desde sempre | Jesus |
| 09 | 26/05 | Amor que excede | Jesus |
| 10 | 27/05 | Unidade não é uniformidade | Mateus |
| 11 | 28/05 | Dons diferentes corpo um | Davi |
| 12 | 29/05 | Maturidade não é idade | Davi |
| 13 | 30/05 | Verdade em amor | Jesus |
| 14 | 31/05 | Tirar velho vestir novo | Mateus |
| 15 | 01/06 | Imitar Deus como filho | Jesus |
| 16 | 02/06 | Andar como filho da luz | Jesus |
| 17 | 03/06 | Casamento espelha Cristo | Jesus |
| 18 | 04/06 | Filho obedece pai não exaspera | Davi |
| 19 | 05/06 | Batalha não é contra carne | Davi |
| 20 | 06/06 | Vista a armadura | Davi |
| 21 | 07/06 | HOJE começa | Jesus |

---

## 📸 REFERÊNCIAS DE PERSONAGENS (salvas)

**Path:** `outputs/multiplicar/efesios-encarnado/assets-visuais/personagens-ref/`

```
personagens-ref/
├── jesus/   → 5 fotos (Jonathan Roumie / The Chosen)
│   ├── jesus-1.png  (close studio)
│   ├── jesus-2.jpg  (corpo inteiro vertical)
│   ├── jesus-3.jpg  (caminhando bastão + mochila)
│   ├── jesus-4.webp (close ao ar livre)
│   └── jesus-5.avif (theaters poster)
├── mateus/  → 4 fotos (Paras Patel / The Chosen)
│   ├── mateus-1.jpg  (rosto preocupado)
│   ├── mateus-2.webp (corpo, túnica amarela)
│   ├── mateus-3.webp (perfil close)
│   └── mateus-4.jpg  (corpo inteiro)
└── davi/    → 4 fotos (House of David série)
    ├── davi-1.jpeg  (com harpa nas rochas)
    ├── davi-2.jpg   (com funda no campo)
    ├── davi-3.jpg   (close dramático luz quente)
    └── davi-4.webp  (com corda + nuvens)
```

**INSTRUÇÃO TÉCNICA pra face swap (nano-banana):**
- Sempre usar `gemini-3-pro-image-preview` (NÃO flash)
- Ordem: PRIMEIRO fotos de identidade do personagem, DEPOIS referência de cena
- Mínimo 2-3 fotos de identidade por personagem
- Aspect ratio 4:5 (1080×1350)
- Template de prompt em `data/face-swap-guide.md` do squad

---

## 🎨 IDENTIDADE VISUAL OFICIAL CASTELO FORTE

**Brand Guide:** `legacy/squads/workspace/businesses/igreja-castelo-forte/brand/brand-guide.yaml`

**Logo PNG oficial:** `brand/logo-castelo-forte.png` (torre estilizada)

**Paleta oficial:**
- `#fe5b06` — Orange Fort (acento marca)
- `#153247` — Midnight Blue (texto principal)
- `#252f38` — Deeper Blue
- `#075057` — Fort Blue (raro)
- `#efefef` — Off White (fundo padrão)

**Paleta nova série "Em Cristo"** (do `brand-guide.html` em Downloads):
- `#0a1628` — Ink (azul-tinta profundo)
- `#c89545` — Glory (dourado glória)
- `#8b3838` — Blood (vinho)
- `#faf6ed` — Parchment (pergaminho)
- `#6b5d4f` — Muted

**Tipografia oficial:**
- Display: Nexa Heavy → substituto web: **Archivo Black**
- Body: Nexa Light → substituto: **Inter** (pesos 300-700)
- Mono: **JetBrains Mono** (metadados, refs bíblicas)
- Série Em Cristo: **Playfair Display Italic** (palavras-chave)

---

## ✅ DECISÕES TRAVADAS NA SESSÃO

1. **Cliente:** igreja-castelo-forte
2. **Templates oficiais no squad** (catálogo):
   - **T10** — `castelo-forte-editorial` (padrão carrossel)
   - **T11** — `castelo-forte-frase` (frase única, 5 variantes)
3. **V-D Casa Isabel** aprovado como template alternativo:
   - Fundo: `#efefef` (cinza oficial — NÃO mais bege papel `#ede6d6`)
   - Tipografia: Inter sans + Playfair Display Italic pra ênfase
   - Logo Castelo Forte canto superior DIREITO (não esquerdo)
   - **Capas COM foto** de personagem (regra: sempre)
   - **Internas SEM foto** (só texto fluido centralizado)
4. **CTA final aprovado** — 6 opções renderizadas em `/cta-finais/`:
   - opt1: CF Light (cinza + azul-marinho, SEM laranja no EM CRISTO)
   - opt3: Pergaminho + Glory dourado
   - opt4: Ink + Glory
   - opt5: Fundo Dourado sólido
   - opt6: Jesus caminhando (The Chosen)
   - opt7: Jesus Jonathan (mesmo layout opt6, foto vertical)
5. **Estrutura CTA final** (regra inviolável):
   - Linha 1: "Tudo que Deus tem pra te dar" (uma linha)
   - Linha 2: "começa em uma única palavra" (outra linha, `<br>` entre elas)
   - Linha 3: **EM CRISTO** grande, UMA LINHA SÓ
   - Data: 07.06 · 09h30
   - Local: Domingo · Igreja Castelo Forte
6. **Tamanhos finais:**
   - EM CRISTO: 128-138px (NÃO 188+)
   - Intro: 40px
   - Eyebrow "Série Em Cristo · 4 Cultos": Inter Bold 14px (NÃO serifado)
   - Data: 64px
   - Local: 24px

---

## 🚫 REGRAS INVIOLÁVEIS (anti-IA)

1. **Acentuação portuguesa COMPLETA** sempre (á é ç ã õ ê í ó ú)
2. **NUNCA usar travessão** (—, –) — substituir por vírgula, ponto, dois pontos
3. **Frase única corrida** — máximo 1 ponto final por frase (não múltiplos pontos = cara de IA)
4. **NÃO usar serifa em "Série Em Cristo · 4 Cultos"** — sempre Inter Bold sans
5. **Quebra de linha do CTA** — "te dar" e "começa" em linhas separadas (`<br>` entre)
6. **EM CRISTO sólido** (sem cor de destaque diferente do resto quando fundo escuro)

---

## 📁 ARQUIVOS-CHAVE

**Workspace cliente:**
```
legacy/squads/workspace/businesses/igreja-castelo-forte/
├── README.md
├── brand/
│   ├── brand-guide.yaml         (paleta + tipografia + tom)
│   ├── templates.yaml           (T10 + T11 mapeados)
│   └── logo-castelo-forte.png   (logo PNG oficial)
└── campaigns/em-cristo-antecipacao/
    └── cronograma-42-pecas.yaml (21 carrosséis + 21 frases mapeados dia a dia)
```

**Outputs:**
```
outputs/
├── HANDOFF.md ← ESTE ARQUIVO
├── inteligencia/                (15 relatórios + 480 capas + datasets JSON)
├── multiplicar/efesios-encarnado/
│   ├── ARSENAL-COMPLETO.md            (24 peças histórias densas)
│   ├── ARSENAL-POPULAR.md             (24 peças histórias mainstream)
│   ├── CAMPANHA-ANTECIPACAO-21-DIAS.md (21 peças TTM)
│   └── assets-visuais/
│       ├── personagens-ref/    (Jesus + Mateus + Davi reference photos)
│       ├── capa-biblica.png    (pergaminho com luz)
│       ├── jesus-chosen-*.* / jesus-jonathan.jpg
│       └── triade-jeremias/davi/maria.png + capa-p02..p20-*.png
├── campanhas/em-cristo-antecipacao/preview/
│   ├── 9-combos-sem-laranja/    (V-A1 a V-C2)
│   ├── V-D-casa-isabel/         (peça #02 demo)
│   ├── V-D-final/, V-D-refinada/
│   ├── casa-isabel-frases/      (5 demos)
│   ├── casa-isabel-carrosseis/  (5 demos: p02, p05, p10, p17, p20)
│   ├── frases-literais/         (21 literais coloridas)
│   ├── frases-literais-branco/  (21 literais brancas)
│   ├── frases-autorais/         (21 autorais coloridas)
│   ├── frases-noite-adoracao/   (21 autorais padrão B)
│   ├── capa-padrao-A/           (3 variações de capa)
│   └── cta-finais/              (6 opções aprovadas)
└── vercel-deploy/                (build pra Vercel)
    ├── vercel.json              (trailingSlash: true)
    ├── index.html               (redirect)
    ├── img/                     (94 PNGs + logo)
    └── briefing/briefingmaio/   (site no ar)
```

**Templates renderizáveis no squad:**
```
legacy/squads/conteudo/templates/carousel/
├── castelo-forte-editorial/     (T10 - 6 arquivos HTML + config.yaml)
├── castelo-forte-frase/         (T11 - 5 variantes)
└── catalog.yaml                 (registra T10 e T11)
```

---

## 🛠️ COMANDOS ÚTEIS

**Renderizar PNG via Playwright:**
```bash
node /tmp/render-*.mjs  # scripts ad-hoc no /tmp
# Playwright: instalar via `npm install playwright` em apps/conteudo/ ou squads/conteudo/app/image-generator/
```

**Deploy Vercel:**
```bash
cd /Users/castelofortefloripa/claude/apps/conteudo
vercel --prod --yes
```

**Gerar imagem nano-banana (Gemini):**
```bash
# .env em legacy/squads/conteudo/.env
# Vars: GEMINI_API_KEY ou GEMINI_API_KEY_2
# Endpoint: gemini-2.5-flash-image (rápido) ou gemini-3-pro-image-preview (face swap)
```

---

## 📋 PRÓXIMOS PASSOS (ordem)

1. **[CONCLUÍDO 17/05]** Etapa 1 — estrutura base no ar (refeita 18/05 com menu único centralizado, zero laranja)
2. **[CONCLUÍDO 18/05]** Etapa 2 — 42 frases (21 literais NVI + 21 autorais) renderizadas estilo Casa Isabel cinza com Playfair Italic dourado na palavra-chave. Saída: `campanhas/em-cristo-antecipacao/preview/cf-frases-literais/` e `cf-frases-autorais/` (frase-01.png a frase-21.png cada). Servidos em https://castelo-forte-ten.vercel.app/conteudo/maio/pecas/literais/ e .../autorais/
3. **[CONCLUÍDO 18/05]** Etapa 3 — 21 carrosséis × 7 slides = 147 PNGs renderizados. Capa: foto duotone do personagem (Jonathan Roumie / Paras Patel / House of David). Internos: triade (3) + síntese + verso + CTA EM CRISTO. Saída: `campanhas/em-cristo-antecipacao/preview/cf-carrosseis/dia-01/...dia-21/`. Servidos em https://castelo-forte-ten.vercel.app/conteudo/maio/conteudo/#dia-NN
4. **[CONCLUÍDO 18/05]** Site refeito: menu único centralizado (Dashboard · Calendário · Peças · Inteligência · Conteúdo), zero laranja (paleta Ink + Glory + Parchment + Off), calendário com tabela 21×3 e deep-link `#dia-NN` / `#p-NN` direto pra cada peça
4. **[PENDENTE]** Aplicar 1 das 6 opções de CTA final em cada carrossel (rotação ou fixo)
5. **[FUTURO]** Integrar com publisher Instagram (já existe em `apps/publisher-instagram-2026/`)
6. **[FUTURO]** Criar pipeline de publicação automática 21 dias

---

## 💡 OBSERVAÇÕES IMPORTANTES

- **Conta Vercel ocupada:** `castelo-forte.vercel.app` puro está em uso por outro projeto. Usando `castelo-forte-ten.vercel.app`.
- **trailingSlash:true** no `vercel.json` é CRÍTICO — sem isso URLs de subpastas dão 404.
- **Imagens em base64 inline** evita falhas de path mas estoura tamanho (60MB+). Sempre copiar PNGs como arquivos separados pra `img/` no deploy.
- **Capa Casa Isabel** SEMPRE tem foto. **Internas Casa Isabel** SEMPRE sem foto.
- **Cor fundo Casa Isabel atual:** `#efefef` (cinza oficial), NÃO `#ede6d6` (bege papel da versão antiga).
- **Logo Castelo Forte** vai sempre no canto superior DIREITO (não esquerdo).
- **Tom de voz:** o tom da igreja é arquétipo Mago (transformação + sobrenatural) + Cuidador (acolhimento + família) + Criador (expressão + inovação).

---

**Última atualização:** Sessão 2026-05-18 — refeitas as 42 frases + 21 carrosséis FIEIS ao template Casa Isabel aprovado (fundo cinza #efefef, Inter Bold #153247, accent Playfair Italic mesma cor, logo lockup CASTELO FORTE canto superior direito, divisor vertical curto, ref bíblica mono espaçada). Capas com foto colorida natural + overlay branco. CTA cinza com EM CRISTO Inter Black grande azul. Site reorganizado: menu único centralizado Dashboard · Calendário · Inteligência · Conteúdo. Tudo de peças dentro de /conteudo/: carrosseis na raiz + /frases-literais/ + /frases-autorais/ (URLs antigas /pecas/ redirecionam).
