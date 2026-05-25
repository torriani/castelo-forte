# Update Conteudo Squad

## Task Anatomy

- **task_name:** Update Conteudo Squad
- **executor:** content-chief (Tier 0)
- **elicit:** true
- **description:** Atualizar componentes do squad conteudo (agents, tasks, workflows, data, checklists)
- **pre_conditions:**
  - Squad conteudo existe e esta funcional
  - Usuario identifica o que precisa ser atualizado
- **post_conditions:**
  - Componente atualizado mantendo compatibilidade com o resto do squad
  - config.yaml atualizado se novos arquivos foram adicionados
  - Version bump no config.yaml
- **veto_conditions:**
  - Modificar nucleo.md ou regras-inviolaveis.md sem aprovacao explicita do usuario
  - Remover agent sem verificar dependencias em workflows e tasks
  - Alterar estrutura de output de agent sem atualizar content-validator
- **completion_criteria:**
  - Componente atualizado e funcional
  - Cross-references intactas (config ↔ filesystem)
  - CHANGELOG.md atualizado com a mudanca

## Steps

### 1. Diagnosticar Escopo

Perguntar ao usuario:
1. **O que atualizar?** (agent, task, workflow, data, checklist)
2. **Qual componente especifico?** (nome do arquivo)
3. **Qual a mudanca?** (adicionar, modificar, corrigir)

### 2. Verificar Dependencias

Antes de modificar qualquer componente:
- Verificar quais agents referenciam o componente
- Verificar quais tasks usam o componente
- Verificar quais workflows incluem o componente
- Listar impacto potencial

### 3. Executar Atualizacao

- Aplicar a mudanca no componente alvo
- Atualizar config.yaml se necessario (novo arquivo, remocao, renomeacao)
- Atualizar cross-references em agents/tasks afetados

### 4. Validar

- Verificar que config.yaml reflete o filesystem
- Verificar que nenhum agent perdeu referencia a data file
- Atualizar CHANGELOG.md com a mudanca
- Bump version no config.yaml

## Output Example

```
Update aplicado:
- Componente: data/hooks-bank.md
- Mudanca: Adicionados 15 novos hooks categoria "Autoridade"
- Impacto: carousel-creator, reels-creator (ambos referenciam hooks-bank)
- Cross-refs: OK (nenhuma quebra)
- Version: 2.2 → 2.3
- CHANGELOG atualizado
```

### Veto Conditions

- id: "CONT_UPDATE_CONTEUDO_001"
  condition: "Componente a atualizar nao identificado (tipo e nome)"
  check: "Verificar se usuario especificou tipo (agent, task, workflow, data) e nome do componente"
  result: "VETO - BLOCK. Solicitar tipo e nome do componente antes de iniciar atualizacao"
  rationale: "Atualizacao sem alvo definido pode modificar componente errado"

- id: "CONT_UPDATE_CONTEUDO_002"
  condition: "Modificacao em nucleo.md ou regras-inviolaveis.md sem aprovacao explicita"
  check: "Verificar se a mudanca afeta arquivos protegidos e se usuario aprovou explicitamente"
  result: "VETO - BLOCK. Solicitar aprovacao explicita antes de modificar arquivos fundamentais do squad"
  rationale: "Nucleo e regras inviolaveis sao a fundacao do squad — alteracao sem aprovacao e risco critico"

### Completion Criteria

- [ ] Componente atualizado e funcional com cross-references intactas (config ↔ filesystem)
- [ ] Dependencias verificadas e impacto potencial listado antes da mudanca
- [ ] config.yaml atualizado se necessario (novo arquivo, remocao, renomeacao)
- [ ] CHANGELOG.md atualizado com a mudanca e version bump aplicado
