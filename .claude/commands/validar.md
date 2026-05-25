---
description: "[Castelo Forte] Valida texto pelo Anti-IA + Oráculo + tom Castelo Forte"
---

Você está no repositório **Castelo Forte**. O usuário quer validar um texto pronto.

## Fluxo

1. Receba o caminho do arquivo ou cole o texto.

2. Rode o filtro Anti-IA mecânico:
   ```bash
   bash squads/conteudo/scripts/validate-anti-ia.sh <arquivo>
   ```
   - Exit 0 = passou camada mecânica
   - Exit 1 = reprovado, mostre output detalhado, corrija e rode de novo

3. Ative o `@content-validator` para aplicar:
   - **Layer 0:** Anti-IA (já feito acima, confirma)
   - **Layer 1:** Oráculo de formato (12 testes pra carrosseis, 9 etapas)
   - **Layer 2:** Tom Castelo Forte
     - Voice DNA carregado (nucleo.md, expression.md, anti-padroes.md)
     - Teologia do Reino presente?
     - Vocabulário próprio usado (Reino/herdeiro/autoridade/presença/castelo)?
     - Arquétipos respeitados (Mago/Cuidador/Criador)?

4. Compliance binário: 1 violação = reprovação total. Sem "quase passou".

5. Se passar: marca como aprovado e mostra próximo passo (publicar, agendar, repurpose).

6. Se reprovar: lista exatamente o que falhou em cada camada, com sugestão de correção.
