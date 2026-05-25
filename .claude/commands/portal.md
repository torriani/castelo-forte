---
description: "[Castelo Forte] Operações do portal de aprovação (sync, status, link, corrigir)"
---

Você está no repositório **Castelo Forte**. O usuário quer fazer alguma operação no portal de aprovação.

## Diagnóstico rápido

Pergunte ao usuário o que ele quer:

1. **Sincronizar conteúdo novo pro portal** → rode:
   ```bash
   node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/publicar.mjs castelo-forte
   ```

2. **Ver status da fila** (pendentes/aprovados/reprovados) → rode:
   ```bash
   node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/status.mjs castelo-forte
   ```

3. **Gerar link mágico pro aprovador** → rode:
   ```bash
   node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/link.mjs castelo-forte
   ```
   - Se quiser link só dos corrigidos: adicione `--corrigidos`

4. **Aplicar correções dos reprovados** → rode:
   ```bash
   node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/corrigir.mjs castelo-forte
   ```
   - Você (Claude Code) lê reprovados, mostra observações, edita arquivos, marca como corrigido, e redeploya Vercel.

5. **Editar portal localmente** → rode:
   ```bash
   cd apps/conteudo && python3 -m http.server 8080
   # abre http://localhost:8080
   ```

6. **Deploy do portal** → rode:
   ```bash
   cd apps/conteudo && vercel --prod --yes
   ```

## URLs em produção

- Portal aprovador: `https://castelo-forte-ten.vercel.app/aprovar/?cliente=castelo-forte&token={TOKEN}`
- Painel admin: `https://castelo-forte-ten.vercel.app/admin/`

## Estrutura do portal

```
apps/conteudo/
├── aprovar/      # interface do aprovador externo
├── admin/        # painel admin
├── conteudo/     # material publicável (por mês)
├── img/          # 1750 imagens
└── vercel.json
```
