#!/usr/bin/env bash
# stalk/scripts/commands/config.sh
# /stalk config — configura defaults

set -euo pipefail

CMD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$CMD_DIR/../.." && pwd)"
source "$SKILL_DIR/scripts/lib/output.sh"

stalk_cmd_config() {
  local key="${1:-}"
  local value="${2:-}"

  if [[ -z "$key" ]]; then
    echo ""
    echo "🛠  Configuração atual"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "default_handle: $(stalk_config_get default_handle '(não configurado)')"
    echo "default_lang:   $(stalk_config_get default_lang 'pt')"
    echo "default_client: $(stalk_config_get default_client 'default')"
    echo ""
    echo "Para alterar:"
    echo "  /stalk config default_handle juliano.torriani"
    echo "  /stalk config default_lang pt"
    echo "  /stalk config default_client bergesh-advogados"
    echo ""
    return 0
  fi

  if [[ -z "$value" ]]; then
    echo "❌ Valor obrigatório. Ex: /stalk config $key <valor>" >&2
    return 1
  fi

  case "$key" in
    default_handle|default_lang|default_client)
      # Remove @ se presente em handle
      [[ "$key" == "default_handle" ]] && value="${value#@}"
      stalk_config_set "$key" "$value"
      echo "✅ $key = $value"
      ;;
    *)
      echo "❌ Chave desconhecida: $key" >&2
      echo "Chaves válidas: default_handle, default_lang, default_client" >&2
      return 1
      ;;
  esac
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  stalk_cmd_config "$@"
fi
