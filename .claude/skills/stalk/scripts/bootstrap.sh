#!/usr/bin/env bash
# stalk/scripts/bootstrap.sh
# Primeiro setup: pede token Apify, valida, salva.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/env.sh"

stalk_bootstrap() {
  cat <<'EOF'

⚠️  Token Apify não encontrado.

Pra usar /stalk, você precisa de um token Apify (gratuito em conta nova).

📝 PASSO A PASSO (3 minutos):
  1. Acesse: https://console.apify.com/sign-up
  2. Crie conta (Google login OK)
  3. Vá em: https://console.apify.com/account/integrations
  4. Copie o "Personal API token" (começa com apify_api_...)

EOF

  # Lê token (suporta TTY e stdin pipe)
  local token
  if [[ -t 0 ]]; then
    read -r -p "Cole o token aqui: " token
  else
    read -r token
  fi

  # Trim whitespace
  token="$(echo "$token" | xargs)"

  if [[ -z "$token" ]]; then
    echo "❌ Token vazio. Abortando." >&2
    return 1
  fi

  if [[ ! "$token" =~ ^apify_api_ ]]; then
    echo "⚠️  Aviso: token não começa com 'apify_api_'. Continuando validação assim mesmo..."
  fi

  echo ""
  echo "🔍 Validando token..."

  if ! stalk_validate_token "$token"; then
    echo "❌ Token inválido. Verifica se copiou correto e tenta de novo." >&2
    return 1
  fi

  local username
  username="$(stalk_get_username "$token")"

  stalk_save_token "$token"

  echo "✅ Token válido. Bem-vindo, $username."
  echo "💾 Salvo em $STALK_ENV_FILE (chmod 600)"
  echo ""
}

# Permite chamar standalone
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  stalk_bootstrap
fi
