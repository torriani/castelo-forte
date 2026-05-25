#!/usr/bin/env bash
# fetch-photos.sh — Buscar fotos pra carrossel via Unsplash API (fallback Pexels)
#
# Uso:
#   ./fetch-photos.sh <output-dir> <queries.tsv>
#
# Formato do queries.tsv (1 linha por slide):
#   01	dna helix dark
#   02	mentor teaching
#   ...
#
# Saida: <output-dir>/photo-NN.jpg (1080x1350)

set -euo pipefail

OUT_DIR="${1:?usage: $0 <output-dir> <queries.tsv>}"
QUERIES_FILE="${2:?usage: $0 <output-dir> <queries.tsv>}"

mkdir -p "$OUT_DIR"

# Load keys from ~/claude/.env (tolerant parser — skip lines with special chars in values)
if [[ -f "$HOME/claude/.env" ]]; then
  UNSPLASH_ACCESS_KEY="$(grep '^UNSPLASH_ACCESS_KEY=' "$HOME/claude/.env" | head -1 | cut -d= -f2-)"
  PEXELS_API_KEY="$(grep '^PEXELS_API_KEY=' "$HOME/claude/.env" | head -1 | cut -d= -f2-)"
fi

: "${UNSPLASH_ACCESS_KEY:?UNSPLASH_ACCESS_KEY nao configurada}"

fetch_unsplash() {
  local query="$1" idx="$2" out="$3"
  local encoded url
  encoded="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$query")"
  # Get 5 candidates, pick one deterministically by idx (mod 5) so same query+idx = same photo
  local json
  json="$(curl -s -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY" \
    "https://api.unsplash.com/search/photos?query=$encoded&per_page=5&orientation=portrait")"
  url="$(echo "$json" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    results = d.get('results', [])
    if not results:
        sys.exit(1)
    pick = int('$idx') % len(results)
    raw = results[pick]['urls']['raw']
    # Request sized version: 1080x1350 fit crop quality 85
    print(raw + '&w=1080&h=1350&fit=crop&q=85&fm=jpg')
except Exception as e:
    sys.stderr.write(f'parse error: {e}\n')
    sys.exit(1)
")" || return 1
  [[ -z "$url" ]] && return 1
  curl -sL -A "Mozilla/5.0" -o "$out" "$url"
  local size
  size=$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out" 2>/dev/null)
  [[ "$size" -gt 30000 ]] || return 1
  return 0
}

fetch_pexels() {
  local query="$1" idx="$2" out="$3"
  [[ -z "${PEXELS_API_KEY:-}" ]] && return 1
  local encoded
  encoded="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$query")"
  local json url
  json="$(curl -s -H "Authorization: $PEXELS_API_KEY" \
    "https://api.pexels.com/v1/search?query=$encoded&per_page=5&orientation=portrait")"
  url="$(echo "$json" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    photos = d.get('photos', [])
    if not photos:
        sys.exit(1)
    pick = int('$idx') % len(photos)
    print(photos[pick]['src']['large2x'])
except Exception:
    sys.exit(1)
")" || return 1
  [[ -z "$url" ]] && return 1
  curl -sL -o "$out" "$url"
  local size
  size=$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out" 2>/dev/null)
  [[ "$size" -gt 30000 ]] || return 1
  return 0
}

# Process queries file
while IFS=$'\t' read -r num query; do
  [[ -z "$num" ]] && continue
  out_path="$OUT_DIR/photo-${num}.jpg"
  if [[ -f "$out_path" ]] && [[ $(stat -f%z "$out_path" 2>/dev/null || stat -c%s "$out_path" 2>/dev/null) -gt 30000 ]]; then
    echo "  photo-${num}.jpg  CACHED  ($query)"
    continue
  fi
  printf "  photo-%s.jpg  " "$num"
  if fetch_unsplash "$query" "$num" "$out_path" 2>/dev/null; then
    echo "UNSPLASH  ($query)"
  elif fetch_pexels "$query" "$num" "$out_path" 2>/dev/null; then
    echo "PEXELS    ($query)"
  else
    echo "FAILED    ($query)"
  fi
done < "$QUERIES_FILE"

echo ""
echo "Done. Photos in: $OUT_DIR"
