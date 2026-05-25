# Learned Heuristics
# Auto-atualizado pelo performance-tracker (wf-learning-loop)
# Ultima atualizacao: (pendente)

---

## Heuristicas Aprendidas
(nenhuma heuristica aprendida ainda — sera preenchido apos 30+ posts analisados)

---

## Regras Derivadas
(pendente — minimo 5 posts por padrao para registrar)

---

## Atualizacoes no Content Chief
(pendente — heuristicas serao injetadas no content-chief quando confirmadas)

---

## Estrutura de Registro

Quando o learning loop registrar heuristicas, cada entrada seguira este formato:

### Heuristica Aprendida
```
### H-[numero]: [Nome da Heuristica]
- **Baseada em:** N posts analisados
- **Confianca:** ALTA (10+ posts) / MEDIA (5-9 posts) / BAIXA (2-4 posts)
- **Descricao:** O que foi aprendido
- **Regra derivada:** SE [condicao] ENTAO [acao]
- **Impacto estimado:** +X% engagement / +X% saves / etc
- **Data de registro:** YYYY-MM-DD
- **Ultima validacao:** YYYY-MM-DD
```

### Regra Derivada
```
### R-[numero]: [Nome da Regra]
- **Derivada de:** H-[numero(s)]
- **Regra:** SE [condicao] ENTAO [acao]
- **Aplicacao:** Onde usar (formato, tipo de post, horario, etc)
- **Status:** ATIVA / EM TESTE / DESCONTINUADA
```

### Atualizacao no Content Chief
```
### U-[numero]: [Data]
- **Heuristicas injetadas:** H-[numeros]
- **Regras ativadas:** R-[numeros]
- **Impacto observado:** Descricao do efeito apos injecao
```

---

## Criterios de Promocao

| Nivel | Requisito | Acao |
|-------|----------|------|
| Observacao | 2-4 posts com padrao similar | Registrar como emergente em performance-patterns.md |
| Heuristica | 5+ posts confirmando padrao | Registrar aqui como heuristica |
| Regra | 10+ posts + confianca ALTA | Derivar regra formal |
| Injecao | Regra ATIVA por 2+ semanas | Injetar no content-chief |

---

## Criterios de Invalidacao

Uma heuristica e invalidada quando:
- 3+ posts recentes contradizem o padrao
- Mudanca de algoritmo torna o padrao obsoleto
- Performance cai consistentemente apos aplicar a regra

**Acao:** Marcar como DESCONTINUADA, nao deletar (manter historico).

---

## Integracao

- **performance-patterns.md:** Fonte primaria de dados para gerar heuristicas
- **benchmark-database.md:** Comparacao com medias do mercado
- **content-chief:** Destino final das heuristicas confirmadas
- **monitoring-signals.md:** Trends externos que podem invalidar heuristicas
