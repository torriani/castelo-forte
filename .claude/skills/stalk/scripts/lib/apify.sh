#!/usr/bin/env bash
# stalk/scripts/lib/apify.sh
# Wrapper para REST API do Apify com retry e error handling.

set -euo pipefail

APIFY_BASE="https://api.apify.com/v2"
APIFY_MAX_RETRIES=3

# Roda actor sincronamente e retorna dataset items.
# Args:
#   $1 - actor id (ex: apify~instagram-profile-scraper)
#   $2 - input json (string)
#   $3 - output file path
apify_run_actor_sync() {
  local actor="$1"
  local input_json="$2"
  local output_file="$3"
  local timeout="${4:-300}"

  if [[ -z "${APIFY_TOKEN:-}" ]]; then
    echo "❌ APIFY_TOKEN não definido" >&2
    return 1
  fi

  local url="$APIFY_BASE/acts/$actor/run-sync-get-dataset-items?token=$APIFY_TOKEN&timeout=$timeout"
  local attempt=0
  local http_code

  while (( attempt < APIFY_MAX_RETRIES )); do
    attempt=$((attempt + 1))

    http_code=$(curl -s -o "$output_file" -w "%{http_code}" \
      -X POST "$url" \
      -H "Content-Type: application/json" \
      -d "$input_json" 2>/dev/null || echo "000")

    case "$http_code" in
      200|201)
        return 0
        ;;
      401|403)
        echo "❌ Token Apify inválido ou expirado." >&2
        echo "💡 Rode: bash $(dirname "${BASH_SOURCE[0]}")/../bootstrap.sh" >&2
        return 2
        ;;
      404)
        echo "❌ Actor '$actor' não encontrado." >&2
        return 3
        ;;
      429)
        local wait=$((5 * attempt * attempt))
        echo "⏳ Rate limit. Aguardando ${wait}s (tentativa $attempt/$APIFY_MAX_RETRIES)..." >&2
        sleep "$wait"
        ;;
      5*)
        local wait=$((3 * attempt))
        echo "⏳ Erro Apify $http_code. Retry em ${wait}s..." >&2
        sleep "$wait"
        ;;
      *)
        echo "❌ HTTP $http_code inesperado" >&2
        if [[ -s "$output_file" ]]; then
          head -c 500 "$output_file" >&2
          echo "" >&2
        fi
        return 1
        ;;
    esac
  done

  echo "❌ Falhou após $APIFY_MAX_RETRIES tentativas" >&2
  return 1
}

# Versão simplificada para casos com input simples
# Args: $1=actor, $2=output_file, $3..$N = pares key=value para JSON
apify_simple_run() {
  local actor="$1"
  local output="$2"
  shift 2

  local json="{"
  local first=1
  while [[ $# -gt 0 ]]; do
    local pair="$1"
    local key="${pair%%=*}"
    local value="${pair#*=}"

    [[ $first -eq 0 ]] && json+=","
    first=0

    if [[ "$value" =~ ^\[ ]] || [[ "$value" =~ ^\{ ]] || [[ "$value" =~ ^[0-9]+$ ]] || [[ "$value" == "true" ]] || [[ "$value" == "false" ]]; then
      json+="\"$key\":$value"
    else
      json+="\"$key\":\"$value\""
    fi
    shift
  done
  json+="}"

  apify_run_actor_sync "$actor" "$json" "$output"
}

# Verifica créditos restantes
apify_credits() {
  if [[ -z "${APIFY_TOKEN:-}" ]]; then
    echo "Token não configurado"
    return 1
  fi

  curl -s "$APIFY_BASE/users/me?token=$APIFY_TOKEN" 2>/dev/null \
    | grep -o '"monthlyUsageCreditsUsd":[^,]*' | head -1 | cut -d':' -f2
}
