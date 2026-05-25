# Onboarding — Configuração Inicial do Squad de Conteúdo

## Task Anatomy

- **task_name:** Onboarding
- **executor:** content-chief (Tier 0)
- **elicit:** true
- **description:** Configurar o squad de conteúdo para um novo usuário — identidade visual, diretório de output, informações da marca. Roda automaticamente na primeira ativação quando o usuário não é o owner.
- **pre_conditions:**
  - Squad de conteúdo ativado pela primeira vez por um novo usuário
  - data/visual-identity.yaml inexistente OU onboarding.completed = false
- **post_conditions:**
  - data/visual-identity.yaml criado com configuração válida
  - Diretório de output configurado e existente
  - Contraste WCAG AA validado
  - Preview visual aprovado
- **veto_conditions:**
  - Prosseguir sem pelo menos cor primária definida
  - Salvar sem preview visual
  - Sobrescrever visual-identity.yaml do owner sem confirmação explícita
- **completion_criteria:**
  - data/visual-identity.yaml existe com onboarding.completed = true
  - Pelo menos 1 template renderiza corretamente com as novas cores

## Detecção Automática

### Como saber se precisa de onboarding

O Content Chief verifica na ativação (antes do greeting):

```bash
# 1. Checar se visual-identity.yaml existe
if [ ! -f data/visual-identity.yaml ]; then
  → PRECISA de onboarding (primeira vez absoluta)
fi

# 2. Se existe, checar se onboarding foi completado
grep "completed: true" data/visual-identity.yaml
if [ $? -ne 0 ]; then
  → PRECISA de onboarding (iniciou mas não terminou)
fi

# 3. Se onboarding completado, checar se é o owner
CURRENT_USER=$(whoami)
CURRENT_EMAIL=$(git config user.email)
CURRENT_HOST=$(hostname)

# Comparar com data/owner.yaml
# Se NENHUM match → é outro usuário → SUGERIR onboarding
# Se algum match → é o owner → pular
```

### Mensagem de sugestão (não é o owner)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👋 Bem-vindo ao Squad de Conteúdo!

Percebi que você não é o Castelo Forte (owner original).
Este squad está configurado com as cores e templates dele.

Para usar com a SUA marca, recomendo rodar o onboarding:
  → *onboarding

Isso configura: cores, fontes, logo, @instagram, diretório de output.
Leva ~3 minutos e você só precisa fazer uma vez.

(ou digite *skip-onboarding para usar as configurações atuais)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Mensagem se é o owner

Não mostra nada. Segue direto para o greeting normal.

## Steps

### 1. Boas-vindas + Contexto

```
Vamos configurar o squad de conteúdo para a sua marca.
Preciso de algumas informações — responda o que souber,
o que não souber a gente define junto.
```

### 2. Informações da Marca

Perguntar uma por vez:

| # | Pergunta | Campo | Obrigatório |
|---|----------|-------|-------------|
| 1 | "Qual o nome da sua marca?" | brand.name | SIM |
| 2 | "Qual seu @ do Instagram?" | brand.handle | SIM |
| 3 | "Qual a cor principal da marca? (hex, ex: #2B7DE1)" | colors.primary | SIM |
| 4 | "Tem uma cor secundária/de acento?" | colors.secondary | NÃO (gera automaticamente) |
| 5 | "Prefere fundo escuro ou claro como padrão?" | colors.background_dark | NÃO (default: #000) |
| 6 | "Qual fonte preferida para títulos? (ou deixa Inter)" | fonts.title | NÃO (default: Inter) |
| 7 | "Tem logo? Se sim, cola o caminho do arquivo" | assets.logo | NÃO |
| 8 | "Tem fotos suas para usar nos carrosséis? (face swap)" | assets.face_reference | SIM (pelo menos 1 foto frontal) |
| 9 | "Onde quer que os carrosséis sejam salvos? (pasta)" | output.directory | NÃO (default: outputs/conteudo) |

### 3. Gerar Cores Derivadas

Se o usuário deu só a cor primária:

- **secondary:** Versão mais escura da primária (darken 30%)
- **accent:** Versão mais clara da primária (lighten 60%, desaturar 30%)
- **background_dark:** #000000 (padrão)
- **background_light:** #f5f5f5 (padrão)

Validar contraste WCAG AA (4.5:1) entre:
- text_light sobre background_dark
- text_dark sobre background_light
- primary sobre background_dark
- primary sobre background_light

### 4. Preview Visual

Gerar um slide de exemplo com as cores da pessoa usando o template twitter-dark:
- Substituir cores no HTML
- Renderizar via Playwright
- Mostrar screenshot para aprovação

```
Este é o visual com suas cores. Aprovar? (s/n/ajustar)
```

### 5. Salvar Configuração

Criar/atualizar `data/visual-identity.yaml` com todos os dados coletados.

Marcar `onboarding.completed: true` com timestamp e username.

### 6. Criar Diretório de Output

```bash
mkdir -p {output.directory}
```

### 7. Confirmação Final

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Onboarding concluído!

Marca: {brand.name}
Instagram: {brand.handle}
Cor principal: {colors.primary}
Output: {output.directory}

Todos os carrosséis agora saem com a sua identidade visual.
Para reconfigurar: *onboarding
Para ver templates: *templates

Content Chief pronto. O que vamos criar?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Comando *skip-onboarding

Se o usuário não quer fazer onboarding agora:
- Usa as configurações do owner (Castelo Forte) como estão
- Marca `onboarding.completed: false` no yaml
- Na próxima ativação, sugere novamente (1x por sessão)

## Comando *onboarding (re-execução)

Pode ser rodado a qualquer momento para:
- Mudar cores
- Mudar marca
- Reconfigurar output
- Atualizar fontes/logo

Não perde templates existentes — só atualiza o visual-identity.yaml.

### Veto Conditions

- id: "CONT_ONBOARDING_001"
  condition: "Cor primaria da marca nao definida"
  check: "Verificar se pelo menos a cor primaria foi fornecida ou selecionada"
  result: "VETO - BLOCK. Solicitar cor primaria antes de prosseguir (minimo absoluto para gerar identidade)"
  rationale: "Sem cor primaria, nao e possivel gerar preview visual nem salvar identidade"

- id: "CONT_ONBOARDING_002"
  condition: "visual-identity.yaml salvo sem preview visual aprovado pelo usuario"
  check: "Verificar se preview foi gerado e usuario deu aprovacao explicita (s/n)"
  result: "VETO - BLOCK. Gerar preview e obter aprovacao antes de salvar configuracao"
  rationale: "Salvar sem preview pode resultar em identidade visual inadequada usada em todos os carrosseis"

### Completion Criteria

- [ ] data/visual-identity.yaml criado com onboarding.completed = true
- [ ] Pelo menos 1 template renderiza corretamente com as cores configuradas
- [ ] Contraste WCAG AA validado para todas as combinacoes de cores
- [ ] Diretorio de output criado e usuario informado do proximo passo
