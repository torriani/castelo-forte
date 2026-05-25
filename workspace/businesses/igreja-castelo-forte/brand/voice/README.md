# Voice — DNA Verbal Castelo Forte

Pasta com a identidade de linguagem da Igreja Castelo Forte. Carregada automaticamente pelos agentes do squad conteudo quando `cliente=igreja-castelo-forte`.

## Arquivos

| Arquivo | Funcao |
|---------|--------|
| `nucleo.md` | Tom de voz, arquetipos (Mago/Cuidador/Criador), pilares de linguagem, teologia do reino |
| `expression.md` | Biblioteca de frases por intencao (identidade, chamado, confronto pastoral, acolhimento, sobrenatural, convite, formacao) |
| `anti-padroes.md` | O que a Castelo Forte NUNCA diz — jargao banido, cliches gospel, hooks proibidos |

## Como o squad usa

Todo agente do squad conteudo, ao receber `cliente=igreja-castelo-forte`, DEVE carregar os 3 arquivos acima ANTES de criar qualquer peca.

## Hierarquia em caso de conflito

`voice/` (cliente) > `data/` (squad). DNA da Castelo Forte sempre vence sobre default do squad (que e cliente-específico).

## Relacao com outros arquivos

- `../brand-guide.yaml` — paleta, tipografia, regras visuais (fonte primaria)
- `../templates.yaml` — templates de carrossel aprovados (T-CF-EDITORIAL, T-CF-FRASE)
- `../../README.md` — contexto geral da igreja

## Aviso

Este arquivo trata APENAS de DNA verbal (linguagem, tom, palavras). Para regras visuais (cores, tipografia, fotografia), consultar `../brand-guide.yaml`.
