#!/usr/bin/env bash
# stalk.sh — router principal da skill stalk
# Uso: bash stalk.sh <comando> [args]

set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS_DIR="$SKILL_DIR/scripts"
COMMANDS_DIR="$SCRIPTS_DIR/commands"

source "$SCRIPTS_DIR/lib/env.sh"

# Garante token (3 camadas: shell > .env.global > bootstrap)
ensure_token() {
  if stalk_load_env; then
    return 0
  fi
  # Bootstrap interativo
  bash "$SCRIPTS_DIR/bootstrap.sh" || return 1
  # Recarrega após bootstrap
  stalk_load_env
}

print_usage() {
  bash "$COMMANDS_DIR/help.sh"
}

main() {
  local cmd="${1:-help}"
  [[ $# -gt 0 ]] && shift

  case "$cmd" in
    # ========== CONSOLIDADOS ==========
    profile)
      ensure_token || return 1
      bash "$COMMANDS_DIR/profile.sh" "$@"
      ;;
    search)
      ensure_token || return 1
      bash "$COMMANDS_DIR/search.sh" "$@"
      ;;
    dossie)
      ensure_token || return 1
      bash "$COMMANDS_DIR/dossie.sh" "$@"
      ;;
    comments)
      ensure_token || return 1
      bash "$COMMANDS_DIR/comments.sh" "$@"
      ;;
    help|--help|-h)
      bash "$COMMANDS_DIR/help.sh"
      ;;
    config)
      bash "$COMMANDS_DIR/config.sh" "$@"
      ;;

    # ========== ATALHOS — search ==========
    keyword)
      ensure_token || return 1
      bash "$COMMANDS_DIR/search.sh" "$@"
      ;;
    hashtag)
      ensure_token || return 1
      local tag="${1:-}"
      shift || true
      [[ "$tag" != \#* ]] && tag="#$tag"
      bash "$COMMANDS_DIR/search.sh" "$tag" "$@"
      ;;
    hooks)
      ensure_token || return 1
      bash "$COMMANDS_DIR/search.sh" "$1" --hooks "${@:2}"
      ;;
    angles)
      ensure_token || return 1
      bash "$COMMANDS_DIR/search.sh" "$1" --angles "${@:2}"
      ;;
    swipe)
      ensure_token || return 1
      bash "$COMMANDS_DIR/search.sh" "$1" --swipe "${@:2}"
      ;;
    competitors)
      ensure_token || return 1
      bash "$COMMANDS_DIR/search.sh" "$1" --find-perfis "${@:2}"
      ;;

    # ========== ATALHOS — profile ==========
    reels)
      ensure_token || return 1
      bash "$COMMANDS_DIR/profile.sh" "$1" --reels "${@:2}"
      ;;
    top)
      ensure_token || return 1
      bash "$COMMANDS_DIR/profile.sh" "$1" --top "${@:2}"
      ;;
    stories)
      ensure_token || return 1
      bash "$COMMANDS_DIR/profile.sh" "$1" --stories "${@:2}"
      ;;
    track)
      ensure_token || return 1
      bash "$COMMANDS_DIR/profile.sh" "$1" --snapshot "${@:2}"
      ;;
    mine)
      ensure_token || return 1
      bash "$COMMANDS_DIR/profile.sh" --me "$@"
      ;;

    # ========== ATALHOS — dossie ==========
    compare)
      ensure_token || return 1
      local primary="${1:-}"
      shift || true
      bash "$COMMANDS_DIR/dossie.sh" "$primary" --vs "$@"
      ;;

    *)
      echo "❌ Comando desconhecido: $cmd" >&2
      echo "" >&2
      print_usage >&2
      return 1
      ;;
  esac
}

main "$@"
