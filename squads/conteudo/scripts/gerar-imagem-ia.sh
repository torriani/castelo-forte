#!/usr/bin/env bash
# Gerar imagens com IA via OpenRouter API
# Usage: ./gerar-imagem-ia.sh --prompt "descricao" --output path/imagem.png [--reference path/logo.png] [--mode test|production]
#        ./gerar-imagem-ia.sh --batch path/batch.json [--mode test|production]
#        ./gerar-imagem-ia.sh --help

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SQUAD_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── Defaults ──────────────────────────────────────────────────
MODE="test"
PROMPT=""
OUTPUT=""
REFERENCE=""
BATCH=""

# ── Modelos por modo ──────────────────────────────────────────
MODEL_TEST="sourceful/riverflow-v2-fast"
MODEL_PROD="google/gemini-3.1-flash-image-preview"

# ── Carregar .env ─────────────────────────────────────────────
load_env() {
  local env_file="$SQUAD_ROOT/.env"
  if [[ -f "$env_file" ]]; then
    while IFS= read -r line || [[ -n "$line" ]]; do
      line="$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
      [[ -z "$line" || "$line" == \#* ]] && continue
      if [[ "$line" == *=* ]]; then
        local key="${line%%=*}"
        local value="${line#*=}"
        # Remove aspas
        value="$(echo "$value" | sed "s/^['\"]//;s/['\"]$//")"
        if [[ -z "${!key:-}" ]]; then
          export "$key=$value"
        fi
      fi
    done < "$env_file"
  fi
}

# ── Ajuda ─────────────────────────────────────────────────────
show_help() {
  cat <<'HELP'
Gerar Imagem com IA — OpenRouter API

USO:
  ./gerar-imagem-ia.sh --prompt "descricao da imagem" --output caminho/imagem.png [opcoes]
  ./gerar-imagem-ia.sh --batch caminho/batch.json [opcoes]
  ./gerar-imagem-ia.sh --help

OPCOES:
  --prompt TEXT       Descricao da imagem a ser gerada
  --output PATH       Caminho de saida para a imagem PNG
  --reference PATH    Imagem de referencia (ex: logo, estilo visual)
  --batch PATH        Arquivo JSON com array de objetos {prompt, output, reference?}
  --mode MODE         Modo de geracao: test (padrao) ou production
                      test:       sourceful/riverflow-v2-fast (rapido, barato)
                      production: google/gemini-3.1-flash-image-preview (alta qualidade)
  --help              Mostrar esta ajuda

VARIAVEIS DE AMBIENTE:
  OPENROUTER_API_KEY  Chave da API OpenRouter (obrigatoria)
                      Obtenha em: https://openrouter.ai/

EXEMPLOS:
  # Imagem simples (modo teste)
  ./gerar-imagem-ia.sh --prompt "logo minimalista azul" --output logo.png

  # Imagem com referencia (modo producao)
  ./gerar-imagem-ia.sh --prompt "variacao do logo" --output logo-v2.png --reference logo.png --mode production

  # Batch de imagens
  ./gerar-imagem-ia.sh --batch slides.json --mode production

FORMATO DO BATCH JSON:
  [
    {"prompt": "slide 1 - titulo", "output": "slides/01.png"},
    {"prompt": "slide 2 - conteudo", "output": "slides/02.png", "reference": "base.png"}
  ]
HELP
}

# ── Parse args ────────────────────────────────────────────────
parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --prompt)    PROMPT="$2"; shift 2 ;;
      --output)    OUTPUT="$2"; shift 2 ;;
      --reference) REFERENCE="$2"; shift 2 ;;
      --batch)     BATCH="$2"; shift 2 ;;
      --mode)      MODE="$2"; shift 2 ;;
      --help)      show_help; exit 0 ;;
      *)           echo "Erro: parametro desconhecido '$1'"; echo "Use --help para ver opcoes."; exit 1 ;;
    esac
  done
}

# ── Selecionar modelo ─────────────────────────────────────────
get_model() {
  if [[ "$MODE" == "production" ]]; then
    echo "$MODEL_PROD"
  else
    echo "$MODEL_TEST"
  fi
}

# ── Gerar imagem unica ───────────────────────────────────────
generate_single() {
  local prompt="$1"
  local output="$2"
  local reference="${3:-}"
  local model
  model="$(get_model)"

  echo "Gerando: $output"
  echo "  Modelo: $model"
  echo "  Prompt: ${prompt:0:80}..."

  # Criar diretorio de saida se nao existir
  local output_dir
  output_dir="$(dirname "$output")"
  mkdir -p "$output_dir"

  # Montar conteudo da mensagem
  local content
  if [[ -n "$reference" ]]; then
    if [[ ! -f "$reference" ]]; then
      echo "Erro: imagem de referencia nao encontrada: $reference"
      return 1
    fi
    local ref_base64
    ref_base64="$(base64 < "$reference" | tr -d '\n')"
    local mime_type="image/png"
    if [[ "$reference" == *.jpg ]] || [[ "$reference" == *.jpeg ]]; then
      mime_type="image/jpeg"
    fi
    content="$(cat <<ENDJSON
[
  {"type": "text", "text": "Gere uma imagem baseada nesta descricao: $prompt"},
  {"type": "image_url", "image_url": {"url": "data:${mime_type};base64,${ref_base64}"}}
]
ENDJSON
)"
  else
    content="\"Gere uma imagem baseada nesta descricao: $prompt\""
  fi

  # Chamar API
  local response
  response="$(curl -s -w "\n%{http_code}" \
    -X POST "https://openrouter.ai/api/v1/chat/completions" \
    -H "Authorization: Bearer $OPENROUTER_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"model\": \"$model\",
      \"messages\": [{
        \"role\": \"user\",
        \"content\": $content
      }]
    }" 2>&1)"

  local http_code
  http_code="$(echo "$response" | tail -1)"
  local body
  body="$(echo "$response" | sed '$d')"

  if [[ "$http_code" -ne 200 ]]; then
    echo "Erro: API retornou HTTP $http_code"
    echo "  Resposta: ${body:0:200}"
    return 1
  fi

  # Extrair base64 da resposta
  # A resposta pode conter a imagem em diferentes formatos dependendo do modelo
  local image_data
  image_data="$(echo "$body" | python3 -c "
import sys, json
data = json.load(sys.stdin)
choices = data.get('choices', [])
if not choices:
    sys.exit(1)
msg = choices[0].get('message', {})
content = msg.get('content', '')
# Tentar extrair base64 de diferentes formatos
if isinstance(content, list):
    for part in content:
        if isinstance(part, dict) and part.get('type') == 'image_url':
            url = part.get('image_url', {}).get('url', '')
            if url.startswith('data:'):
                print(url.split(',', 1)[1])
                sys.exit(0)
# Se content eh string, pode ser base64 direto ou ter markdown
import re
match = re.search(r'data:image/[^;]+;base64,([A-Za-z0-9+/=]+)', str(content))
if match:
    print(match.group(1))
    sys.exit(0)
# Tentar como base64 puro
match = re.search(r'([A-Za-z0-9+/=]{100,})', str(content))
if match:
    print(match.group(1))
    sys.exit(0)
sys.exit(1)
" 2>/dev/null)" || {
    echo "Erro: nao foi possivel extrair imagem da resposta da API"
    echo "  Resposta: ${body:0:300}"
    return 1
  }

  # Salvar imagem
  echo "$image_data" | base64 -d > "$output" 2>/dev/null || {
    echo "Erro: falha ao decodificar imagem base64"
    return 1
  }

  local size
  size="$(wc -c < "$output" | tr -d ' ')"
  echo "  Salvo: $output ($size bytes)"
}

# ── Gerar batch ───────────────────────────────────────────────
generate_batch() {
  local batch_file="$1"
  if [[ ! -f "$batch_file" ]]; then
    echo "Erro: arquivo batch nao encontrado: $batch_file"
    exit 1
  fi

  local count
  count="$(python3 -c "import json; data=json.load(open('$batch_file')); print(len(data))")"
  echo "Processando batch com $count imagem(ns)..."
  echo ""

  local i=0
  python3 -c "
import json, sys
data = json.load(open('$batch_file'))
for item in data:
    print(item.get('prompt','') + '|||' + item.get('output','') + '|||' + item.get('reference',''))
" | while IFS='|||' read -r prompt output reference; do
    i=$((i + 1))
    echo "[$i/$count]"
    generate_single "$prompt" "$output" "$reference"
    echo ""
    if [[ "$i" -lt "$count" ]]; then
      sleep 1
    fi
  done
}

# ── Main ──────────────────────────────────────────────────────
main() {
  load_env
  parse_args "$@"

  # Validar API key
  if [[ -z "${OPENROUTER_API_KEY:-}" ]]; then
    echo "Erro: OPENROUTER_API_KEY nao configurada."
    echo "Obtenha sua chave em: https://openrouter.ai/"
    echo "Configure no arquivo .env ou exporte: export OPENROUTER_API_KEY=sk-..."
    exit 1
  fi

  # Modo batch
  if [[ -n "$BATCH" ]]; then
    generate_batch "$BATCH"
    exit 0
  fi

  # Modo single
  if [[ -z "$PROMPT" ]]; then
    echo "Erro: parametro --prompt obrigatorio (ou use --batch para processar multiplas imagens)"
    echo "Use --help para ver opcoes."
    exit 1
  fi
  if [[ -z "$OUTPUT" ]]; then
    echo "Erro: parametro --output obrigatorio"
    echo "Use --help para ver opcoes."
    exit 1
  fi

  generate_single "$PROMPT" "$OUTPUT" "$REFERENCE"
}

main "$@"
