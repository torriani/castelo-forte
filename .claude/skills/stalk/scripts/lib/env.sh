#!/usr/bin/env bash
# stalk/scripts/lib/env.sh
# Carrega APIFY_TOKEN com 3 camadas de lookup:
# 1. $APIFY_TOKEN no shell (override temporário)
# 2. ~/.claude/.env.global
# 3. Bootstrap interativo

set -euo pipefail

STALK_ENV_FILE="${STALK_ENV_FILE:-$HOME/.claude/.env.global}"

stalk_load_env() {
  # Camada 1: já tá no shell?
  if [[ -n "${APIFY_TOKEN:-}" ]]; then
    return 0
  fi

  # Camada 2: arquivo .env.global
  if [[ -f "$STALK_ENV_FILE" ]]; then
    # Lê APIFY_TOKEN sem source (segurança)
    local token
    token=$(grep -E '^APIFY_TOKEN=' "$STALK_ENV_FILE" 2>/dev/null | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    if [[ -n "$token" ]]; then
      export APIFY_TOKEN="$token"
      return 0
    fi
  fi

  # Camada 3: bootstrap
  return 1
}

stalk_save_token() {
  local token="$1"

  # Garante que ~/.claude/ existe
  mkdir -p "$(dirname "$STALK_ENV_FILE")"

  # Safety: se ~/.claude/ é git repo, garante .gitignore
  local claude_dir="$HOME/.claude"
  if [[ -d "$claude_dir/.git" ]]; then
    local gitignore="$claude_dir/.gitignore"
    if ! grep -qF ".env.global" "$gitignore" 2>/dev/null; then
      echo ".env.global" >> "$gitignore"
    fi
  fi

  # Cria arquivo se não existir
  if [[ ! -f "$STALK_ENV_FILE" ]]; then
    touch "$STALK_ENV_FILE"
    chmod 600 "$STALK_ENV_FILE"
  fi

  # Remove APIFY_TOKEN antigo se existir e adiciona novo
  if grep -q '^APIFY_TOKEN=' "$STALK_ENV_FILE" 2>/dev/null; then
    # macOS sed precisa de '' depois do -i
    sed -i '' "/^APIFY_TOKEN=/d" "$STALK_ENV_FILE"
  fi
  echo "APIFY_TOKEN=$token" >> "$STALK_ENV_FILE"

  chmod 600 "$STALK_ENV_FILE"
  export APIFY_TOKEN="$token"
}

stalk_validate_token() {
  local token="${1:-${APIFY_TOKEN:-}}"
  [[ -z "$token" ]] && return 1

  local response
  response=$(curl -s -o /dev/null -w "%{http_code}" \
    "https://api.apify.com/v2/users/me?token=$token" 2>/dev/null || echo "000")

  [[ "$response" == "200" ]]
}

stalk_get_username() {
  local token="${1:-${APIFY_TOKEN:-}}"
  if [[ -z "$token" ]]; then
    echo "?"
    return 0
  fi
  local response
  response=$(curl -s "https://api.apify.com/v2/users/me?token=$token" 2>/dev/null || echo "")
  if [[ -z "$response" ]]; then
    echo "?"
    return 0
  fi
  # Extrai username do JSON response.data.username
  local username
  username=$(printf '%s' "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('username','?'))" 2>/dev/null || echo "?")
  echo "${username:-?}"
}
