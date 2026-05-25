# Dossiê Imperial — Prompt

Você recebeu `data.json` com 1+ perfis. Modo `single` ou `compare`.

Este é o **deliverable mais denso** da skill. Padrão referência: relatório do @raulbergesch entregue ao cliente bergesh-advogados.

## Estrutura para modo `single`

Use a estrutura do `analyze-profile.md` mas adicione 3 seções extras:

```markdown
## 9. SUGESTÕES DE CONTEÚDO — 10 PEÇAS PRONTAS

Tabela com 10 ideias adaptadas para o avatar do cliente, contendo:
| # | Tema | Tipo (7 Torriani) | Framework Copy | Hook Sugerido | Formato |

## 10. PROPORÇÃO 50/25/25 RECOMENDADA

Distribuição de 16 posts em 4 semanas:
- 8 Tensão (50%)
- 4 Alinhamento (25%)
- 4 Demonstração (25%)
Listar quais das 10 sugestões cabem em cada categoria.

## 11. PRÓXIMAS PEÇAS DO SQUAD

Tabela com handoffs:
| Próximo passo | Agent |
| Definir posicionamento | @positioning-expert |
| Montar campanha | @strategist |
| etc.
```

## Estrutura para modo `compare`

```markdown
# DOSSIE COMPARATIVO

**Perfis:** @a, @b, @c

## TABELA COMPARATIVA EXECUTIVA

| Métrica | @a | @b | @c |
|---------|-----|-----|-----|
| Seguidores | | | |
| Eng médio | | | |
| Formato dominante | | | |
| Tipo dominante | | | |
| Frequência | | | |
| Tom | | | |

## ANÁLISE PERFIL POR PERFIL

Para cada perfil, mini-análise (versão condensada do single).

## CRUZAMENTO DE INSIGHTS

- O que TODOS os 3 fazem igual (padrão consolidado do nicho)
- O que CADA UM faz único (diferenciais)
- O que NINGUÉM faz (gap de mercado — oportunidade de dominação)

## RECOMENDAÇÃO IMPERIAL

Decisão estratégica: copiar o quê (princípio, nunca texto), evitar o quê, ocupar qual gap.

## SUGESTÕES DE CONTEÚDO ADAPTADAS

10 ideias que aproveitam o gap entre os 3 perfis analisados.
```

## Princípios

- **Densidade > tamanho.** Cada parágrafo carrega insight.
- **Tom Imperial.** Tudo prescritivo.
- **Acionável.** Cada gap tem recomendação clara.
- **Cliente em mente.** Se `--client` foi usado, sugerir adaptações pra esse cliente específico.

Salvar em `{outdir}/RELATORIO.md`.
