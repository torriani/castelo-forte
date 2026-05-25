#!/usr/bin/env bash
#
# validate-anti-ia.sh — Validador deterministico do Filtro Anti-IA v3.7
#
# Uso:
#   ./validate-anti-ia.sh <arquivo>
#   ./validate-anti-ia.sh <arquivo> --html      # extrai apenas conteudo de slides
#   ./validate-anti-ia.sh <arquivo> --json      # extrai body de slides.json
#   ./validate-anti-ia.sh <arquivo> --strict    # falha (exit 1) na primeira violacao
#
# Faz grep mecanico das regras OBJETIVAS do filtro (sem LLM):
#   - Travessao (— ou –)
#   - Lista negra §1 (frases proibidas)
#   - Padroes §2 (fingerprints IA PT-BR detectaveis por regex)
#
# Exit codes:
#   0 = passou (zero violacoes)
#   1 = reprovado (1+ violacoes)
#   2 = erro de uso/arquivo
#
# Setup: chmod +x scripts/validate-anti-ia.sh

set -e

# ─── cores ─────────────────────────────────────────────────────────────────
if [ -t 1 ]; then
  RED='\033[0;31m'; YEL='\033[0;33m'; GRN='\033[0;32m'; BLU='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'
else
  RED=''; YEL=''; GRN=''; BLU=''; BOLD=''; NC=''
fi

# ─── args ──────────────────────────────────────────────────────────────────
ARQUIVO="${1:-}"
MODO="${2:-}"
STRICT=""
[[ "$MODO" == "--strict" || "$3" == "--strict" ]] && STRICT=1

if [ -z "$ARQUIVO" ] || [ ! -f "$ARQUIVO" ]; then
  echo "Uso: $0 <arquivo> [--html|--json|--strict]"
  echo "Erro: arquivo nao encontrado: $ARQUIVO" >&2
  exit 2
fi

# ─── extracao de conteudo (modo-dependente) ─────────────────────────────────
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

case "$MODO" in
  --html)
    # Extrai APENAS panes .after (o output final que importa). Ignora .before.
    python3 -c "
import re
html = open('$ARQUIVO').read()
# Pega <div class=\"pane after\">...</div> (output final)
after_panes = re.findall(r'<div class=\"pane after\">(.*?)</div>\s*<div class=\"(?:reasoning|violations)\"', html, re.DOTALL)
out = []
for pane in after_panes:
    # Dentro do pane, pega pane-title e pane-body
    blocks = re.findall(r'<div class=\"pane-(?:body|title)\">(.*?)</div>', pane, re.DOTALL)
    for b in blocks:
        txt = re.sub(r'<[^>]+>', '', b).strip()
        if txt and txt != '(vazio)':
            out.append(txt)
print('\n'.join(out))
" > "$TMP"
    ;;
  --json)
    # Extrai apenas 'body' e 'title' de slides.json
    python3 -c "
import json, sys
data = json.load(open('$ARQUIVO'))
slides = data.get('slides', [])
for s in slides:
    if s.get('title'): print(s['title'])
    if s.get('body'):  print(s['body'])
" > "$TMP"
    ;;
  *)
    # Arquivo cru — para .md, remove headings (que nao vao pro output final do Instagram)
    if [[ "$ARQUIVO" == *.md ]]; then
      grep -vE "^#" "$ARQUIVO" > "$TMP"
    else
      cat "$ARQUIVO" > "$TMP"
    fi
    ;;
esac

CONTEUDO="$TMP"
TOTAL_VIOLACOES=0

# ─── helper ────────────────────────────────────────────────────────────────
report() {
  local categoria="$1"; local descricao="$2"; local pattern="$3"
  local count
  # Conta linhas distintas que casam; tr/wc evita problema do grep -c em multilinhas
  count=$(grep -cE "$pattern" "$CONTEUDO" 2>/dev/null | tr -d '\n' || true)
  count=${count:-0}
  # Garante numero (caso volte vazio ou multilinhas)
  [[ "$count" =~ ^[0-9]+$ ]] || count=0
  if [ "$count" -gt 0 ]; then
    TOTAL_VIOLACOES=$((TOTAL_VIOLACOES + count))
    echo -e "${RED}${BOLD}❌ ${categoria}${NC} ${RED}(${count}x):${NC} ${descricao}"
    grep -nE "$pattern" "$CONTEUDO" 2>/dev/null | head -5 | sed "s/^/    ${YEL}→${NC} /"
    [ "$count" -gt 5 ] && echo -e "    ${YEL}...${NC} (mais $((count - 5)) ocorrencias)"
    echo ""
    [ -n "$STRICT" ] && exit 1
  fi
}

# ─── HEADER ────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║  Filtro Anti-IA v3.7 — Validacao Deterministica           ║${NC}"
echo -e "${BOLD}╚════════════════════════════════════════════════════════════╝${NC}"
echo -e "Arquivo: ${BLU}$ARQUIVO${NC}"
[ -n "$MODO" ] && echo -e "Modo:    ${BLU}$MODO${NC}"
echo -e "Linhas analisadas: $(wc -l < "$CONTEUDO" | tr -d ' ')"
echo ""

# ═══ §2.1 — TRAVESSAO (a regra mais critica, fingerprint #1 de IA PT-BR) ═══
report "§2.1 TRAVESSAO" \
  "Brasileiro usa virgula/parenteses/ponto. Travessao denuncia IA." \
  "—|–"

# ═══ §1 — LISTA NEGRA DE FRASES PROIBIDAS ═══════════════════════════════════
report "§1 FRASE PROIBIDA" \
  "Frases batidas (aberturas/fechamentos/jargao corporativo)" \
  "verdade que ninguem te conta|verdade que ninguém te conta|nao e sobre|não é sobre|chegou ate aqui|chegou até aqui|hoje quero falar|vamos falar sobre|imagine so|imagine só|imagina comigo|ja se pegou pensando|já se pegou pensando|no final do dia|no final das contas|em resumo|isso muda tudo|faz toda a diferenca|faz toda a diferença|pense nisso|fica a reflexao|fica a reflexão|alta performance|novos patamares|transformar resultados|potencial maximo|potencial máximo|desbloquear|proximo nivel|próximo nível|revolucionario|revolucionário|transformador|mindset|acredite em voce|acredite em você|saia da zona de conforto"

# ═══ §2.2 — FRASE CURTA EMPILHADA NA MESMA LINHA ═══════════════════════════
# Heuristica: 3+ frases muito curtas (2-5 palavras) com ponto seguido na mesma linha
report "§2.2 FRASE CURTA EMPILHADA (3+ curtas)" \
  "3+ frases curtas com ponto seguido na mesma linha (fingerprint classico)" \
  "([A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ]+){1,4}\.\s+[A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ]+){1,4}\.\s+[A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ]+){1,4}\.)"

# ═══ §2.8 — PARALELISMO SIMETRICO (heuristicas comuns) ═════════════════════
# "Mais X, mais Y" / "Menos X, menos Y" repetido 2+ vezes na mesma linha
report "§2.8 PARALELISMO SIMETRICO" \
  "Construcoes 'Mais/Menos X. Mais/Menos Y.' coladas (fingerprint IA)" \
  "(Mais|Menos)\s+\w+\.\s+(Mais|Menos)\s+\w+\."

# ═══ §2.8 — PARALELISMO SE/THEN ════════════════════════════════════════════
report "§2.8 PARALELISMO SE/NAO" \
  "'Se nao X, nao Y' / 'Quem X, quem Y' simetricos demais" \
  "[Ss]e nao [a-zA-ZÀ-ÿ]+ no [a-zA-ZÀ-ÿ]+, nao vai [a-zA-ZÀ-ÿ]+ no [a-zA-ZÀ-ÿ]+|[Ss]em [a-zA-ZÀ-ÿ]+, sem [a-zA-ZÀ-ÿ]+\."

# ═══ §2.4 — PONTO E VIRGULA EM TEXTO CASUAL ═══════════════════════════════
report "§2.4 PONTO E VIRGULA" \
  "IA usa muito ponto e virgula; brasileiro casual quase nunca" \
  ";"

# ═══ §2.7 — ANAFORA FORCADA ═══════════════════════════════════════════════
report "§2.7 ANAFORA FORCADA" \
  "Mesma palavra iniciando 3 oracoes consecutivas (E sobre. E sobre. E sobre.)" \
  "(E sobre|É sobre)\b.*\1.*\1"

# ═══ §2.13 — IMAGINE COMO ENGAJAMENTO ═══════════════════════════════════
report "§2.13 IMAGINE-COACH" \
  "Abrir com 'Imagine...' como recurso de engajamento" \
  "^[Ii]magine\s"

# ═══ §3 — TRIADE DIDATICA / PARENTESE EXPLICATIVO ═══════════════════════
report "§3 PARENTESE DIDATICO" \
  "'(ou seja...)' ou '(em outras palavras...)' didatico" \
  "\(ou seja|\(em outras palavras"

# ═══ §3 — GERUNDIO EM CTA ═══════════════════════════════════════════════════
report "§3 GERUNDIO CTA" \
  "'vou estar te enviando', 'estarei aguardando' — fingerprint corporativo BR" \
  "vou estar [a-z]+ndo|estarei [a-z]+ndo|estaremos [a-z]+ndo"

# ═══ §2.10 — CONECTIVO SOLTO INICIANDO FRASE ═══════════════════════════════
# Heuristica simples: linha comecando com "Mas " ou "E " ou "Porque "
report "§2.10 CONECTIVO SOLTO" \
  "Frase iniciando com 'Mas/E/Porque' isolado (fragmenta texto)" \
  "^(Mas|E|Porque)\s+[a-zA-ZáéíóúâêîôûãõàçÁÉÍÓÚÂÊÎÔÛÃÕÀÇ]"

# ═══ FINAL ════════════════════════════════════════════════════════════════════
echo -e "${BOLD}────────────────────────────────────────────────────────────${NC}"
if [ "$TOTAL_VIOLACOES" -eq 0 ]; then
  echo -e "${GRN}${BOLD}✅ APROVADO${NC} — zero violacoes detectadas pelo filtro deterministico"
  echo -e "${YEL}Nota:${NC} este script cobre regras OBJETIVAS. Regras subjetivas (§8 inimigo claro,"
  echo -e "      §2.8 paralelismo, §5 ritmo) precisam de validacao humana ou LLM."
  exit 0
else
  echo -e "${RED}${BOLD}❌ REPROVADO${NC} — ${RED}${TOTAL_VIOLACOES} violacao(es) detectada(s)${NC}"
  echo -e "${YEL}Acao:${NC} reescrever os trechos marcados antes de entregar."
  exit 1
fi
