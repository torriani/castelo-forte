#!/usr/bin/env bash
# stalk/scripts/commands/dossie.sh
# /stalk dossie @handle [--vs @x @y] [--client slug]

set -euo pipefail

CMD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$CMD_DIR/../.." && pwd)"
source "$SKILL_DIR/scripts/lib/env.sh"
source "$SKILL_DIR/scripts/lib/apify.sh"
source "$SKILL_DIR/scripts/lib/output.sh"

stalk_cmd_dossie() {
  local primary=""
  local extras=()
  local cliente=""
  local mode="single"

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --vs)
        mode="compare"
        shift
        while [[ $# -gt 0 && "$1" != --* ]]; do
          extras+=("${1#@}")
          shift
        done
        ;;
      --client) cliente="$2"; shift 2 ;;
      @*) [[ -z "$primary" ]] && primary="${1#@}" || extras+=("${1#@}"); shift ;;
      *) [[ -z "$primary" ]] && primary="$1" || extras+=("$1"); shift ;;
    esac
  done

  if [[ -z "$primary" ]]; then
    echo "❌ Uso: /stalk dossie @handle [--vs @x @y] [--client slug]" >&2
    return 1
  fi

  primary="${primary#@}"
  local slug
  slug="$(stalk_slugify "$primary")"
  local subdir="dossie"
  [[ "$mode" == "compare" ]] && subdir="compare"
  local outdir
  outdir="$(stalk_output_dir "$subdir" "$slug" "$cliente")"

  stalk_print_header "stalk dossie @$primary (modo: $mode)"
  echo "📂 Output: $outdir"
  echo ""

  # Junta primary + extras pra scrape em batch
  local all_handles=("$primary")
  [[ ${#extras[@]} -gt 0 ]] && all_handles+=("${extras[@]}")

  local handles_json="["
  local first=1
  for h in "${all_handles[@]}"; do
    [[ $first -eq 0 ]] && handles_json+=","
    first=0
    handles_json+="\"$h\""
  done
  handles_json+="]"

  local data_file="$outdir/data.json"
  echo "🔍 Scrape de ${#all_handles[@]} perfil(s)..."
  apify_simple_run "apify~instagram-profile-scraper" "$data_file" \
    "usernames=$handles_json" \
    || return $?

  if [[ ! -s "$data_file" ]]; then
    echo "❌ Scrape retornou vazio." >&2
    return 1
  fi

  echo "✅ Dados crus salvos: $data_file"
  echo ""
  echo "📝 Próximo passo: relatório imperial completo pelo Claude"
  echo "  - data: $data_file"
  echo "  - prompt: $SKILL_DIR/prompts/analyze-dossie.md"
  echo "  - modo: $mode"
  [[ "$mode" == "compare" ]] && echo "  - perfis: ${all_handles[*]}"
  echo ""
  echo "Output esperado: $outdir/RELATORIO.md"
  return 0
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  stalk_cmd_dossie "$@"
fi
