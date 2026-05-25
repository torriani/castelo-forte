#!/usr/bin/env bash
# Servidor local para preview de templates de carrossel
# Usage: ./criar-template-visual.sh [--port 8765] [--templates-dir ../templates/carousel]
#        ./criar-template-visual.sh --stop
#        ./criar-template-visual.sh --help

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SQUAD_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── Defaults ──────────────────────────────────────────────────
PORT=8765
TEMPLATES_DIR="$SQUAD_ROOT/templates/carousel"
PID_FILE="/tmp/criar-template-visual-$PORT.pid"

# ── Ajuda ─────────────────────────────────────────────────────
show_help() {
  cat <<'HELP'
Servidor Local para Preview de Templates de Carrossel

USO:
  ./criar-template-visual.sh [opcoes]       Iniciar servidor
  ./criar-template-visual.sh --stop         Parar servidor
  ./criar-template-visual.sh --help         Mostrar esta ajuda

OPCOES:
  --port NUM            Porta do servidor (padrao: 8765)
  --templates-dir PATH  Diretorio dos templates (padrao: templates/carousel/)
  --stop                Parar o servidor em execucao

FLUXO DE TRABALHO:
  1. Execute este script para iniciar o servidor
  2. Abra o navegador na URL exibida
  3. Edite os templates HTML no editor
  4. Recarregue o navegador para ver as mudancas
  5. Use --stop quando terminar

EXEMPLOS:
  # Iniciar com defaults
  ./criar-template-visual.sh

  # Porta customizada
  ./criar-template-visual.sh --port 9000

  # Diretorio customizado
  ./criar-template-visual.sh --templates-dir ./meus-templates

  # Parar servidor
  ./criar-template-visual.sh --stop
HELP
}

# ── Parse args ────────────────────────────────────────────────
ACTION="start"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --port)           PORT="$2"; shift 2 ;;
    --templates-dir)  TEMPLATES_DIR="$2"; shift 2 ;;
    --stop)           ACTION="stop"; shift ;;
    --help)           show_help; exit 0 ;;
    *)                echo "Erro: parametro desconhecido '$1'"; echo "Use --help para ver opcoes."; exit 1 ;;
  esac
done

PID_FILE="/tmp/criar-template-visual-$PORT.pid"

# ── Stop ──────────────────────────────────────────────────────
stop_server() {
  if [[ -f "$PID_FILE" ]]; then
    local pid
    pid="$(cat "$PID_FILE")"
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid"
      rm -f "$PID_FILE"
      echo "Servidor parado (PID $pid)."
    else
      rm -f "$PID_FILE"
      echo "Servidor ja nao estava em execucao (PID $pid stale). Arquivo PID removido."
    fi
  else
    echo "Nenhum servidor encontrado na porta $PORT."
    echo "Se o servidor ainda esta rodando, mate manualmente: lsof -ti:$PORT | xargs kill"
  fi
}

# ── Start ─────────────────────────────────────────────────────
start_server() {
  # Verificar python3
  if ! command -v python3 &>/dev/null; then
    echo "Erro: python3 nao encontrado. Instale Python 3 para continuar."
    exit 1
  fi

  # Resolver caminho absoluto
  TEMPLATES_DIR="$(cd "$TEMPLATES_DIR" 2>/dev/null && pwd)" || {
    echo "Erro: diretorio de templates nao encontrado: $TEMPLATES_DIR"
    echo "Crie o diretorio ou use --templates-dir para apontar para outro local."
    exit 1
  }

  # Verificar se porta ja esta em uso
  if lsof -ti:"$PORT" &>/dev/null; then
    echo "Erro: porta $PORT ja esta em uso."
    echo "Use --port para escolher outra porta ou --stop para parar o servidor existente."
    exit 1
  fi

  # Verificar se ja tem servidor rodando via PID file
  if [[ -f "$PID_FILE" ]]; then
    local old_pid
    old_pid="$(cat "$PID_FILE")"
    if kill -0 "$old_pid" 2>/dev/null; then
      echo "Servidor ja esta rodando (PID $old_pid)."
      echo "Use --stop para parar antes de iniciar novamente."
      exit 1
    else
      rm -f "$PID_FILE"
    fi
  fi

  # Listar templates disponiveis
  echo "Diretorio: $TEMPLATES_DIR"
  echo ""

  local templates
  templates="$(find "$TEMPLATES_DIR" -maxdepth 1 -name '*.html' -type f 2>/dev/null | sort)"
  if [[ -n "$templates" ]]; then
    echo "Templates disponiveis:"
    while IFS= read -r t; do
      echo "  - $(basename "$t")"
    done <<< "$templates"
  else
    echo "Nenhum template .html encontrado no diretorio."
    echo "Crie arquivos .html em: $TEMPLATES_DIR"
  fi

  echo ""

  # Iniciar servidor em background
  python3 -m http.server "$PORT" --directory "$TEMPLATES_DIR" &>/dev/null &
  local pid=$!
  echo "$pid" > "$PID_FILE"

  echo "Servidor iniciado (PID $pid)"
  echo ""
  echo "Abra no navegador: http://localhost:$PORT"
  echo ""
  echo "Para parar: ./criar-template-visual.sh --stop"
}

# ── Main ──────────────────────────────────────────────────────
if [[ "$ACTION" == "stop" ]]; then
  stop_server
else
  start_server
fi
