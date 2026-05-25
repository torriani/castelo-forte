# Delete Conteudo Squad

## Task Anatomy

- **task_name:** Delete Conteudo Squad
- **executor:** content-chief (Tier 0)
- **elicit:** true
- **description:** Remover componentes do squad conteudo com seguranca (verificacao de dependencias antes da remocao)
- **pre_conditions:**
  - Squad conteudo existe
  - Usuario identifica o componente a remover
- **post_conditions:**
  - Componente removido do filesystem e do config.yaml
  - Nenhuma referencia orfao permanece
  - CHANGELOG.md atualizado
- **veto_conditions:**
  - Remover content-chief (Tier 0 orchestrador — squad fica inoperante)
  - Remover content-validator (sem validacao — qualidade comprometida)
  - Remover nucleo.md ou regras-inviolaveis.md (fundacao do squad)
  - Remover componente com dependentes ativos sem migrar dependencias primeiro
- **completion_criteria:**
  - Componente removido
  - config.yaml limpo (sem referencia ao componente removido)
  - Zero referencias orfaos em agents, tasks e workflows
  - CHANGELOG.md atualizado

## Steps

### 1. Identificar Alvo

Perguntar ao usuario:
1. **O que remover?** (agent, task, workflow, data, checklist)
2. **Qual componente?** (nome)
3. **Motivo?** (obsoleto, duplicado, substituido)

### 2. Analise de Impacto

**OBRIGATORIO antes de qualquer remocao:**

- Listar TODOS os agents que referenciam o componente
- Listar TODAS as tasks que usam o componente
- Listar TODOS os workflows que incluem o componente
- Classificar impacto: BAIXO (0 dependentes) / MEDIO (1-2) / ALTO (3+)

Se impacto ALTO → apresentar alternativas antes de prosseguir.

### 3. Migrar Dependencias (se necessario)

Se o componente tem dependentes:
- Propor componente substituto ou redistribuicao
- Atualizar cada dependente para apontar para o novo recurso
- Validar que dependentes continuam funcionais

### 4. Executar Remocao

- Remover arquivo do filesystem
- Remover entrada do config.yaml
- Limpar qualquer referencia remanescente

### 5. Validar

- config.yaml ↔ filesystem: zero orfaos
- Nenhum agent referencia arquivo inexistente
- Atualizar CHANGELOG.md
- Bump version no config.yaml

## Output Example

```
Remocao executada:
- Componente: agents/legacy-writer.md
- Motivo: Substituido por carousel-creator v2
- Dependentes migrados: 2 tasks (create-post → create-carousel, validate-post → validate-content)
- config.yaml: entrada removida
- Cross-refs: OK (zero orfaos)
- Version: 2.2 → 2.3
- CHANGELOG atualizado
```

### Veto Conditions

- id: "CONT_DELETE_CONTEUDO_001"
  condition: "Componente alvo nao identificado (agent, task, workflow, data)"
  check: "Verificar se o usuario especificou tipo e nome do componente a remover"
  result: "VETO - BLOCK. Solicitar tipo e nome do componente antes de iniciar analise de impacto"
  rationale: "Remocao sem alvo definido pode deletar componente errado"

- id: "CONT_DELETE_CONTEUDO_002"
  condition: "Componente tem dependentes ativos nao migrados"
  check: "Verificar lista de dependentes e se foram migrados para substituto"
  result: "VETO - BLOCK. Migrar dependencias antes de executar remocao"
  rationale: "Remover componente com dependentes ativos quebra workflows e tasks do squad"

### Completion Criteria

- [ ] Componente removido do filesystem e do config.yaml com zero referencias orfas
- [ ] Analise de impacto executada com lista completa de dependentes
- [ ] Dependencias migradas antes da remocao (se existiam dependentes)
- [ ] CHANGELOG.md atualizado e version bump aplicado no config.yaml
