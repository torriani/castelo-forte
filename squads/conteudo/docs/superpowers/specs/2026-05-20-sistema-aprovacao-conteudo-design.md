# Sistema de Aprovação de Conteúdo — Design

**Data:** 2026-05-20
**Cliente piloto:** Igreja Castelo Forte
**Status:** Design aprovado, aguardando review final do usuário antes do plano de implementação

---

## Objetivo

Permitir que um aprovador externo (1 por cliente) revise os posts criados pelo squad de conteúdo via uma interface web simples (link mágico, sem cadastro), aprove ou reprove cada peça com observação opcional, e que o admin (Juliano) puxe essas decisões via slash command no Claude Code local para aplicar as correções automaticamente. Zero custo de API, zero servidor 24/7.

## Restrições

- **Custo:** R$ 0/mês. Sem API paga, sem servidor dedicado.
- **Infra existente:** Aproveitar Vercel (portal já deployado) e Supabase free tier.
- **Aprovador:** 1 pessoa por cliente. Acesso via link mágico (token na URL), sem senha.
- **Admin:** Só Juliano. Login com email + senha em rota `/admin`.
- **Execução de correções:** Sempre disparada manualmente pelo Juliano via Claude Code local. Não roda autonomamente.

## Arquitetura

```
[Aprovador WhatsApp]
       ↓ clica link
[Vercel: /aprovar/{cliente}?token=xxx]
       ↓ fetch
[Supabase: tabela decisoes]
       ↑ leitura
[Vercel: /admin (login)]  ←  Juliano vê dashboard
       ↑ leitura
[Claude Code local: /aprovacoes {cliente}]
       ↓ aplica correções
[Vercel deploy atualizado]
```

## Componentes

### 1. Painel do aprovador (`/aprovar/{cliente}?token=xxx`)

- HTML estático no portal Vercel atual (`vercel-deploy/aprovar/index.html`)
- JavaScript vanilla: lê `?token=` da URL, chama Supabase pra validar token e listar posts do cliente
- UI: grade vertical (mobile-first), cada card mostra:
  - Imagem(ns) do post (linka direto pros PNGs já no Vercel)
  - Título e tipo
  - 2 botões: ✅ Aprovar | ❌ Reprovar
  - Se Reprovar: aparece textarea "o que precisa mudar?"
  - Estado salvo em tempo real no Supabase (sem botão "salvar tudo")
- Sem login. Token na URL é o único gate.

### 2. Painel admin (`/admin`)

- HTML no portal Vercel (`vercel-deploy/admin/index.html`)
- Login simples via Supabase Auth (email + senha, 1 usuário pré-cadastrado)
- Dashboard mostra, por cliente:
  - Totais: pendentes / aprovados / reprovados
  - Lista de reprovados com observações
  - Botão "Exportar reprovados" → baixa JSON

### 3. Supabase (banco)

3 tabelas (schema completo abaixo). RLS (Row-Level Security) ativado:
- Tabela `decisoes`: leitura/escrita pública APENAS via token válido
- Tabela `posts`: leitura pública via token, escrita só admin
- Tabela `clientes`: leitura pública (precisa pra validar token), escrita só admin

### 4. Slash command `/aprovacoes` (Claude Code local)

- Skill nova em `squads/conteudo/skills/aprovacoes/`
- Comandos:
  - `/aprovacoes-publicar {cliente}` — escaneia pasta do cliente, popula Supabase com posts novos
  - `/aprovacoes-status {cliente}` — mostra resumo (X pendentes, Y aprovados, Z reprovados)
  - `/aprovacoes-corrigir {cliente}` — lê reprovados, aplica correções, marca como corrigido, redeploy
  - `/aprovacoes-link {cliente}` — imprime link mágico pra copiar e mandar no WhatsApp

## Schema de dados (Supabase)

```sql
-- Clientes
CREATE TABLE clientes (
  slug TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  token_aprovador TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_slug TEXT REFERENCES clientes(slug) ON DELETE CASCADE,
  identificador TEXT NOT NULL,  -- ex: "dia-01-carrossel" (idempotência)
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL,           -- "carrossel" | "frase-literal" | "frase-autoral"
  imagens JSONB NOT NULL,        -- ["/conteudo/maio/conteudo/dia-01/01.png", ...]
  legenda TEXT,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (cliente_slug, identificador)
);

-- Decisões
CREATE TABLE decisoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('aprovado', 'reprovado')),
  observacao TEXT,
  corrigido BOOLEAN DEFAULT FALSE,
  decidido_em TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (post_id)              -- 1 decisão por post (upsert sobrescreve)
);
```

## Fluxo completo

1. **Setup inicial (1x por cliente)** — Juliano roda `/aprovacoes-publicar castelo-forte`. Script lê pastas `vercel-deploy/conteudo/maio/conteudo/dia-01/` … `dia-21/` + `frases-literais/` + `frases-autorais/`, gera identificadores, faz upsert no Supabase. Output: 63 posts cadastrados.

2. **Compartilhar link** — Juliano roda `/aprovacoes-link castelo-forte`. Output: URL pronta pra colar no WhatsApp.

3. **Aprovação** — Aprovador abre link no celular, vê 63 cards, vai marcando. Cada clique salva direto no Supabase. Se quiser pausar e voltar depois, basta reabrir o link — vê o que já marcou.

4. **Admin review** — Juliano abre `/admin`, loga, vê dashboard. Vê que tem (por exemplo) 50 aprovados, 8 reprovados, 5 pendentes. Lê as observações dos reprovados.

5. **Correção em batch** — Juliano roda `/aprovacoes-corrigir castelo-forte` no Claude Code local. A skill:
   - Puxa do Supabase os 8 reprovados com observação
   - Pra cada um, lê a observação e decide a ação (re-renderiza PNG com texto novo, ajusta legenda, troca imagem, etc)
   - Quando faz a correção, marca `corrigido=true` no Supabase
   - Roda `vercel --prod --yes` no final
   - Imprime resumo do que foi corrigido

6. **Re-aprovação dos corrigidos** — Juliano roda `/aprovacoes-link castelo-forte --apenas-corrigidos`. Link mágico abre painel filtrado só pros corrigidos. Aprovador revisa e aprova.

## Segurança

- **Token do aprovador:** 32 chars aleatórios (`crypto.randomBytes(16).toString('hex')`). Sem expiração — válido até Juliano regenerar manualmente.
- **RLS no Supabase:** policies garantem que com o token X só dá pra ler/escrever decisões dos posts do cliente X. Sem token válido, request retorna vazio.
- **Admin:** Supabase Auth padrão (email + senha bcrypt). 1 usuário pré-cadastrado, sem signup público.
- **Chave Supabase no frontend:** usar a chave `anon` (pública). Todas as proteções são via RLS, não via esconder a chave.

## Tratamento de erros

- **Token inválido:** painel mostra "Link inválido ou expirado, peça um novo ao admin."
- **Supabase offline:** painel mostra erro genérico + botão "tentar novamente". Decisões em memória não somem (sessionStorage local).
- **Post sem imagem (404 no Vercel):** card mostra placeholder + alerta no admin.
- **Correção falha (skill `/aprovacoes-corrigir`):** marca o post com `corrigido=false` + erro registrado num campo `erro_correcao` (campo a adicionar se necessário). Pula pro próximo, no final imprime relatório.

## Testes

- **Manual:** rodar fluxo completo de ponta a ponta com 2-3 posts de teste antes de subir os 63 reais.
- **Validação de token:** tentar acessar `/aprovar/castelo-forte?token=fake` e confirmar que lista retorna vazia.
- **Idempotência do publicar:** rodar `/aprovacoes-publicar castelo-forte` duas vezes seguidas, confirmar que não duplica.
- **RLS:** tentar via curl ler decisões de outro cliente com token errado, confirmar bloqueio.

## Fora de escopo (YAGNI)

- ❌ Multi-aprovador por cliente
- ❌ Notificações por email/WhatsApp quando aprovador termina
- ❌ Histórico de versões de cada post
- ❌ Aprovação parcial dentro de carrossel (slide por slide)
- ❌ Botão "corrigir agora" na própria interface web (sempre é o Juliano que dispara via CLI)
- ❌ Cadastro/gestão de clientes via UI (feito direto no Supabase ou via SQL no início)

## Arquivos novos previstos

```
vercel-deploy/
├── aprovar/
│   └── index.html              # painel do aprovador
├── admin/
│   └── index.html              # painel admin com login
└── assets/aprovacao/
    ├── app.js                  # JS vanilla compartilhado
    └── styles.css              # estilos

squads/conteudo/skills/aprovacoes/
├── SKILL.md                    # comandos /aprovacoes-*
├── scripts/
│   ├── publicar.mjs            # popular Supabase
│   ├── status.mjs              # ler resumo
│   ├── corrigir.mjs            # aplicar correções
│   └── link.mjs                # gerar link mágico
└── .env.example                # SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

squads/conteudo/migrations/
└── 001_aprovacao_schema.sql    # schema inicial
```

## Próximo passo

Após aprovação deste design pelo usuário, invocar `superpowers:writing-plans` pra detalhar tasks de implementação fase a fase.
