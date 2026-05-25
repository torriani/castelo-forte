# Criar StoryAds

name: create-storyadd
executor: positioning-expert
description: Criar StoryAds de manipulacao subliminar — stories que parecem casuais mas sao projetados para gerar tensao e desejo
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Templates de StoryAds disponiveis em data/storyadds.md
  - Categorias de stories disponiveis em data/stories-categorias.md

---

## 🛑 GATE OBRIGATORIO — FILTRO ANTI-IA (PRE E POS ESCRITA)

**Severidade:** VETO BLOQUEANTE. Esta task NAO entrega output sem passar pelo filtro.

### Antes de comecar (Camada 1 — Pre-escrita)
1. **Ler obrigatorio:** `checklists/filtro-anti-ia.md` (filtro UNIVERSAL anti-IA v3)
2. Internalizar listas proibidas (§1, §2, §3) e regra do inimigo (§8)
3. Aplicar DURANTE a escrita — nunca produzir rascunho sujo pra "limpar depois"

### Antes de entregar (Camada 2 — Auto-validacao)
1. Rodar `§9 TESTE FINAL` do filtro em CADA bloco de texto produzido
2. Se falhar em qualquer item: REESCREVER antes de seguir
3. Se passar: marcar `anti_ia_self_check: PASS` no metadata do output

### Veto Conditions (bloqueiam entrega)
- ❌ Texto contem qualquer item das listas proibidas §1, §2, §3 → REESCREVER
- ❌ Texto sem inimigo claro (§8) → REESCREVER
- ❌ Texto com travessao (— ou –) → REESCREVER (use virgula, ponto, parenteses ou quebra de linha)
- ❌ Frases curtas empilhadas na mesma linha → REESCREVER (separar em paragrafos)
- ❌ Falha no §9 TESTE FINAL em qualquer item → REESCREVER

### Handoff obrigatorio
Apos entrega, @content-validator roda **Layer 0** (filtro anti-IA UNIVERSAL) automaticamente. Se reprovar, volta pra reescrita. Sem aprovacao do Layer 0, nada avanca pra Layer 1 (formato) nem Layer 2 (tom do cliente).

## INPUTS

- **Nicho:** area de atuacao do usuario (obrigatorio)
- **Resultado principal:** o que o usuario entrega aos clientes (obrigatorio)
- **Contexto visual preferido:** cafe, parque, setup, carro, paisagem (opcional)
- **Quantidade:** quantos StoryAds gerar (default: 5)
- **Tom especifico:** se quer mais provocativo, aspiracional ou de prova (opcional)

## STEPS

1. Coletar nicho e resultado principal
2. Identificar templates por nicho em data/storyadds.md
3. Adaptar templates universais para o nicho do usuario
4. Construir cada StoryAd com estrutura de 3 linhas:
   - Linha 1: ANTES (dor/situacao passada)
   - Linha 2: DEPOIS (resultado atual)
   - Linha 3: INSINUACAO (sem explicar como)
5. Sugerir imagem "acidental" para cada StoryAd
6. Validar: concisao (max 3 linhas), naturalidade, tom
7. Entregar batch completo com notas de execucao

## VETO CONDITIONS

- Se StoryAd parece intencional/vendedor → Reescrever mais casual
- Se tem mais de 3 linhas de texto → Reduzir
- Se explica o metodo em vez de insinuar → Reescrever
- Se vende diretamente → Reescrever (StoryAd gera desejo, nao vende)
- Se imagem sugerida nao parece espontanea → Trocar
- Se dois StoryAds tem mesmo contexto visual → Variar

## OUTPUT EXAMPLE

```
STORYAD 1:
[Imagem: foto casual com cafe]
"3 anos atras eu nao conseguia vender nem uma sessao.
Hoje acordo com notificacoes de pagamento.
Nao foi sorte. Foi uma decisao."

STORYAD 2:
[Imagem: print de PIX - parcial]
"Meu aluno vendeu 12k na primeira semana.
E nem precisou de live.
Metodo > esforco."

STORYAD 3:
[Imagem: vista de parque/paisagem]
"Enquanto voce 'se prepara',
alguem com metade do seu talento esta fechando.
Pensa nisso."

NOTAS DE EXECUCAO:
- Postar 1-2 por dia
- Salvar em destaques
- Horario: 10h-12h ou 18h-20h
- Variar imagens (nunca repetir contexto)
- Nunca parecer intencional
```

## COMPLETION CRITERIA

- Quantidade solicitada de StoryAds entregue (default: 5)
- Cada StoryAd com exatamente 3 linhas (antes/depois/insinuacao)
- Sugestao de imagem "acidental" para cada um
- Tom casual e nao-vendedor
- Variedade de contextos visuais
- Notas de execucao incluidas (frequencia, horario, destaques)
- Adaptado ao nicho especifico do usuario

## Output Example

```
## STORYADD — "Casual que Vende"

Tipo: Manipulacao subliminar | Intencao: Gerar tensao e desejo
Nicho: Mentoria digital

STORY 1 (Casual):
[Foto no cafe com notebook aberto]
"Sabado de manha. Revisando os resultados da turma."
[Sem CTA, sem mencao a produto]

STORY 2 (Tensao sutil):
[Print parcial de mensagem — borrado]
"Quando o aluno manda isso depois de 30 dias..."
[Emoji de fogo — sem explicacao]

STORY 3 (Desejo):
[Foto do quadro com post-its]
"Planejando a proxima turma. Cada vaga e escolhida a dedo."
[Sem link, sem CTA — gera escassez percebida]

Frequencia: 2-3x por semana entre conteudo principal
Horario: variar (manha, tarde, noite) para parecer organico
Destaques: nao salvar em destaque (deve parecer efemero)
```

references:
  - data/storyadds.md
  - data/stories-categorias.md
  - data/regras-inviolaveis.md

### Veto Conditions

- id: "CONT_CREATE_STORYADD_001"
  condition: "Nicho e resultado principal nao fornecidos"
  check: "Verificar se nicho e resultado estao presentes nos inputs"
  result: "VETO - BLOCK. Solicitar nicho e resultado antes de gerar StoryAds"
  rationale: "StoryAds sem nicho parecem genericos e perdem efeito de manipulacao subliminar"

- id: "CONT_CREATE_STORYADD_002"
  condition: "StoryAd parece intencional ou vendedor (quebra naturalidade)"
  check: "Verificar se cada StoryAd tem max 3 linhas e tom casual"
  result: "VETO - BLOCK. Reescrever para parecer espontaneo — StoryAd nunca pode parecer planejado"
  rationale: "A forca do StoryAd e parecer casual — se parece venda, perde todo o efeito"

### Completion Criteria

- [ ] Quantidade solicitada entregue com exatamente 3 linhas cada (antes/depois/insinuacao)
- [ ] Sugestao de imagem acidental para cada StoryAd com variedade de contextos visuais
- [ ] Tom casual e nao-vendedor mantido com adaptacao ao nicho do usuario
- [ ] Notas de execucao incluidas (frequencia, horario, destaques)
