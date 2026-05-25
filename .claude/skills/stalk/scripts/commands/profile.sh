#!/usr/bin/env bash
# stalk/scripts/commands/profile.sh
# /stalk profile @handle [--reels|--top|--stories|--snapshot|--me]

set -euo pipefail

CMD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$CMD_DIR/../.." && pwd)"
source "$SKILL_DIR/scripts/lib/env.sh"
source "$SKILL_DIR/scripts/lib/apify.sh"
source "$SKILL_DIR/scripts/lib/output.sh"

stalk_cmd_profile() {
  local handle=""
  local mode="full"
  local period="90d"
  local cliente=""

  # Parse
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --reels) mode="reels"; shift ;;
      --top) mode="top"; shift ;;
      --stories) mode="stories"; shift ;;
      --snapshot) mode="snapshot"; shift ;;
      --me)
        handle="$(stalk_config_get default_handle)"
        if [[ -z "$handle" ]]; then
          echo "❌ Handle padrão não configurado. Rode: /stalk config" >&2
          return 1
        fi
        shift ;;
      --period) period="$2"; shift 2 ;;
      --client) cliente="$2"; shift 2 ;;
      @*) handle="${1#@}"; shift ;;
      *) handle="$1"; shift ;;
    esac
  done

  if [[ -z "$handle" ]]; then
    echo "❌ Uso: /stalk profile @handle [--reels|--top|--stories|--snapshot|--me]" >&2
    return 1
  fi

  handle="${handle#@}"
  local slug
  slug="$(stalk_slugify "$handle")"
  local outdir
  outdir="$(stalk_output_dir profile "$slug" "$cliente")"
  local data_file="$outdir/data.json"

  stalk_print_header "stalk profile @$handle (modo: $mode)"
  echo "📂 Output: $outdir"
  echo "🔍 Scrape via Apify..."
  echo ""

  case "$mode" in
    reels)
      apify_simple_run "apify~instagram-reel-scraper" "$data_file" \
        "username=[\"$handle\"]" \
        "resultsLimit=20" \
        || return $?
      ;;
    stories)
      apify_simple_run "apify~instagram-scraper" "$data_file" \
        "directUrls=[\"https://www.instagram.com/stories/$handle/\"]" \
        "resultsType=stories" \
        || return $?
      ;;
    *)
      # full, top, snapshot — mesmo scrape, análise diferente
      apify_simple_run "apify~instagram-profile-scraper" "$data_file" \
        "usernames=[\"$handle\"]" \
        || return $?
      ;;
  esac

  if [[ ! -s "$data_file" ]]; then
    echo "❌ Scrape retornou vazio. Perfil pode estar privado ou não existir." >&2
    return 1
  fi

  echo "✅ Dados crus salvos: $data_file"
  echo ""
  echo "📝 Próximo passo: análise pelo Claude usando prompts/analyze-profile.md"
  echo ""
  echo "Para análise completa, lê o arquivo data.json e o prompt de análise:"
  echo "  - data: $data_file"
  echo "  - prompt: $SKILL_DIR/prompts/analyze-profile.md"
  echo ""
  echo "Output esperado: $outdir/RELATORIO.md"

  # Snapshot mode: salva timestamp para diff futuro
  if [[ "$mode" == "snapshot" ]]; then
    cp "$data_file" "$outdir/snapshot-$(date +%Y%m%d-%H%M%S).json"
    echo "📸 Snapshot arquivado para diff futuro."
  fi

  return 0
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  stalk_cmd_profile "$@"
fi
