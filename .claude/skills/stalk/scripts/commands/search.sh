#!/usr/bin/env bash
# stalk/scripts/commands/search.sh
# /stalk search "termo" [flags]

set -euo pipefail

CMD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$CMD_DIR/../.." && pwd)"
source "$SKILL_DIR/scripts/lib/env.sh"
source "$SKILL_DIR/scripts/lib/apify.sh"
source "$SKILL_DIR/scripts/lib/output.sh"

stalk_cmd_search() {
  local termo=""
  local mode="default"
  local lang=""
  local top=30
  local period="90d"
  local min_followers=""
  local cliente=""

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --hooks) mode="hooks"; shift ;;
      --angles) mode="angles"; shift ;;
      --swipe) mode="swipe"; shift ;;
      --find-perfis) mode="find-perfis"; shift ;;
      --lang) lang="$2"; shift 2 ;;
      --top) top="$2"; shift 2 ;;
      --period) period="$2"; shift 2 ;;
      --min-followers) min_followers="$2"; shift 2 ;;
      --client) cliente="$2"; shift 2 ;;
      *) termo="$1"; shift ;;
    esac
  done

  if [[ -z "$termo" ]]; then
    echo "❌ Uso: /stalk search \"termo\" [flags]" >&2
    return 1
  fi

  local slug actor input search_type
  slug="$(stalk_slugify "$termo")"

  # Detecta hashtag automaticamente
  if [[ "$termo" == \#* ]]; then
    search_type="hashtag"
    actor="apify~instagram-hashtag-scraper"
    local clean_tag="${termo#\#}"
    input="hashtags=[\"$clean_tag\"]&resultsLimit=$top"
  else
    search_type="keyword"
    actor="apify~instagram-search-scraper"
    input="search=\"$termo\"&searchType=hashtag&resultsLimit=$top"
  fi

  local outdir
  outdir="$(stalk_output_dir search "${search_type}-${slug}" "$cliente")"
  local data_file="$outdir/data.json"

  stalk_print_header "stalk search \"$termo\" (modo: $mode)"
  echo "🔍 Tipo: $search_type | Top: $top | Período: $period"
  [[ -n "$lang" ]] && echo "🌐 Idioma: $lang"
  echo "📂 Output: $outdir"
  echo ""

  if [[ "$search_type" == "hashtag" ]]; then
    apify_simple_run "$actor" "$data_file" \
      "hashtags=[\"${termo#\#}\"]" \
      "resultsLimit=$top" \
      || return $?
  else
    apify_simple_run "$actor" "$data_file" \
      "search=$termo" \
      "searchType=hashtag" \
      "resultsLimit=$top" \
      || return $?
  fi

  if [[ ! -s "$data_file" ]]; then
    echo "❌ Scrape retornou vazio." >&2
    return 1
  fi

  echo "✅ Dados crus salvos: $data_file"
  echo ""
  echo "📝 Próximo passo: análise pelo Claude com modo \"$mode\""
  echo "  - data: $data_file"
  echo "  - prompt: $SKILL_DIR/prompts/analyze-search.md"
  echo "  - modo solicitado: $mode"
  echo ""
  echo "Output esperado: $outdir/RELATORIO.md"
  return 0
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  stalk_cmd_search "$@"
fi
