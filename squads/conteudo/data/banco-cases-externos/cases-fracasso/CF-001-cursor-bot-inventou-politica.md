# CF-001 — Cursor: bot de suporte inventou política que não existia e clientes começaram a cancelar em massa

**Status:** FRACASSO PÚBLICO
**Período:** Abril de 2025
**Categoria:** chatbot de suporte / SaaS / hallucination

## Resumo em 1 frase chocante (use no slide 1)

"A Cursor, IDE de IA usada por milhares de programadores, viu sua base cancelar assinaturas em massa porque o próprio bot de suporte inventou uma política de produto que nunca existiu."

## Fonte verificável

**Veículo principal:** Ars Technica
**URL:** https://arstechnica.com/ai/2025/04/cursor-ai-support-bot-invents-fake-policy-and-triggers-user-uproar/
**Veículos secundários:** The Verge, The Register, CX Today, AI Incident Database (Report 5167)
**Data publicação:** 17 de abril de 2025

## Trecho-chave (quote literal da matéria)

> "Hey! We have no such policy. You're of course free to use Cursor on multiple machines. Unfortunately, this is an incorrect response from a front-line AI support bot."
> — Michael Truell, co-fundador da Cursor (Anysphere), no Reddit

> "LLMs pretending to be people (you named it Sam!) and not labeled as such is clearly intended to be deceptive."
> — Comentário no Hacker News repercutindo o caso

## A história em 5 linhas
Um desenvolvedor percebeu que estava sendo deslogado da Cursor toda vez que trocava de máquina. Contatou o suporte e recebeu uma resposta de "Sam" dizendo que era uma nova política, "um dispositivo por assinatura". Postou no Reddit, viralizou no Hacker News, dezenas de devs anunciaram cancelamento. Três horas depois, o co-fundador apareceu pra dizer que a tal política nunca existiu, "Sam" era um bot, e ele tinha alucinado a regra do zero. Estrago feito.

## Causa raiz (a tese por trás do fracasso)

Substituição cega de suporte humano por LLM sem (a) rotular como IA, (b) treinar com base de conhecimento real e atualizada, (c) ter humano de plantão pra moderar respostas sensíveis. Pior: a Cursor vende ferramenta de IA pra dev e levou tiro no pé com a própria tecnologia que vende.

## Custo da bagunça (se há números)

- Cancelamentos públicos de assinatura documentados no Reddit
- Empresas anunciando "purga completa" da ferramenta nos times
- Reembolsos manuais para clientes afetados
- Dano reputacional crítico no público técnico (que é justamente o ICP da empresa)
- Mudança forçada na arquitetura de suporte (agora todo email de IA é rotulado como tal)

## Conexão com TESE CENTRAL

Movimento 1 — Fracasso da substituição total.
Este case prova que:
- Bot sem supervisão humana inventa fato e cria crise em menos de 3 horas
- O dano não é só atendimento ruim, é cancelamento real e churn medido
- Quem mais entende de IA (uma empresa de IA pra dev) também erra quando tira o humano do loop

## Ganchos prontos pra post

### Gancho 1 — Slide 1 direto
"A Cursor é uma empresa de IA. O bot de suporte dela inventou uma política do nada. E os clientes começaram a cancelar."

### Gancho 2 — Slide 1 invertido (provoca empresário)
"Se a empresa que vende IA pra programador não consegue rodar IA no suporte sem virar crise, por que a sua vai conseguir?"

### Gancho 3 — Em série com outros horror stories
"Air Canada pagou indenização. NYC deu conselho ilegal. Cursor perdeu cliente. Três empresas, três bots, mesmo erro: tirar o humano do loop."

## Como usar este case

- **Quando usar:** falando pra empresário de SaaS, tech ou serviço que pensa em automatizar suporte 100%
- **Quando NÃO usar:** público que ainda tem medo de IA básica, pode confundir mensagem
- **Combinar com:** cases BR de sucesso (Yampi, Magalu) pra contrastar "lá tiraram o humano e quebrou, aqui colocaram humano + IA juntos e escalou"

## Tags
#fracasso #horror-story #chatbot-falhou #substituicao-total #hallucination #cursor #saas
