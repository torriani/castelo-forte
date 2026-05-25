#!/usr/bin/env bash
# stalk/scripts/commands/comments.sh
# /stalk comments <url-do-post>

set -euo pipefail

CMD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$CMD_DIR/../.." && pwd)"
source "$SKILL_DIR/scripts/lib/env.sh"
source "$SKILL_DIR/scripts/lib/apify.sh"
source "$SKILL_DIR/scripts/lib/output.sh"

stalk_cmd_comments() {
  local url=""
  local cliente=""
  local limit=200

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --client) cliente="$2"; shift 2 ;;
      --limit) limit="$2"; shift 2 ;;
      *) url="$1"; shift ;;
    esac
  done

  if [[ -z "$url" || ! "$url" =~ instagram\.com ]]; then
    echo "❌ Uso: /stalk comments <url-do-post-instagram>" >&2
    return 1
  fi

  local slug
  slug="$(echo "$url" | sed -E 's|.*/p/([^/]+).*|\1|' | head -c 30)"
  [[ -z "$slug" ]] && slug="$(date +%s)"

  local outdir
  outdir="$(stalk_output_dir comments "$slug" "$cliente")"
  local data_file="$outdir/data.json"

  stalk_print_header "stalk comments"
  echo "🔗 URL: $url"
  echo "📂 Output: $outdir"
  echo "📊 Limite: $limit comentários"
  echo ""

  apify_simple_run "apify~instagram-comment-scraper" "$data_file" \
    "directUrls=[\"$url\"]" \
    "resultsLimit=$limit" \
    || return $?

  echo "✅ Comentários salvos: $data_file"
  echo ""
  echo "📝 Próximo passo: análise de vocabulário pelo Claude"
  echo "  - data: $data_file"
  echo "  - prompt: $SKILL_DIR/prompts/analyze-comments.md"
  echo ""
  echo "Output esperado: $outdir/RELATORIO.md"
  return 0
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  stalk_cmd_comments "$@"
fi
