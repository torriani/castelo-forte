# ARCHIVE — Histórico de Mídia no Supabase

Por que existe, como funciona, e como usar.

---

## Por que separamos Git e Mídia

Git é ótimo pra texto, péssimo pra binário. 835MB de PNG/MP4 no repo:
- `git clone` levaria 20-40 minutos
- Cada `git pull` baixaria megabytes de blob inúteis
- GitHub rejeita arquivos individuais >100MB
- Histórico do Git incharia exponencialmente

**Solução:** texto fica no Git, mídia fica no Supabase Storage. Os scripts buscam sob demanda.

---

## Onde mora

**Bucket Supabase:** `carrossel-images` (compartilhado com o publisher)
**Pasta dentro do bucket:** `castelo-forte-archive/`

Estrutura:
```
carrossel-images/                   ← bucket
├── instagram-posts/                ← usado pelo publisher.mjs (não mexer)
│   └── (PNGs de posts já publicados)
└── castelo-forte-archive/          ← histórico de produção
    ├── campanhas/
    │   └── em-cristo-antecipacao/
    │       ├── carrossel-01.png
    │       └── ...
    ├── inteligencia/
    │   └── (PDFs, screenshots de concorrentes)
    ├── multiplicar/
    │   └── efesios-encarnado/
    │       └── (capas geradas, assets visuais)
    ├── conteudo-cultos/
    ├── reunioes/
    └── vercel-deploy/
        └── (dashboard estático, screenshots, HTML)
```

---

## Operações disponíveis

### 1. Listar o que existe no archive

```bash
# Raiz (pastas top-level)
node squads/conteudo/scripts/list-archive.mjs

# Dentro de uma pasta específica
node squads/conteudo/scripts/list-archive.mjs campanhas
node squads/conteudo/scripts/list-archive.mjs campanhas/em-cristo-antecipacao
node squads/conteudo/scripts/list-archive.mjs multiplicar/efesios-encarnado
```

Saída exemplo:
```
Bucket: carrossel-images
Pasta archive: castelo-forte-archive/campanhas/em-cristo-antecipacao

PASTAS (3):
  carrosseis/
  reels/
  inteligencia/

ARQUIVOS (12):
  PLANO.md                                                       8.4 KB
  HANDOFF.md                                                     2.1 KB
  ...

Total nesta pasta: 124.5 MB
```

### 2. Baixar uma pasta sob demanda

```bash
# Padrão: baixa pra outputs/<prefixo>
node squads/conteudo/scripts/pull-archive.mjs campanhas/em-cristo-antecipacao

# Destino customizado
node squads/conteudo/scripts/pull-archive.mjs multiplicar --out /tmp/teste
```

Saída exemplo:
```
Prefixo remoto: castelo-forte-archive/campanhas/em-cristo-antecipacao/
Destino local : outputs/campanhas/em-cristo-antecipacao

Listando arquivos remotos...
Encontrados 87 arquivos, 124.5 MB

[100.0%] 87/87 (124.5 MB/124.5 MB) - 142s

Concluído: 87 ok, 0 falhas em 142s.
Arquivos salvos em: outputs/campanhas/em-cristo-antecipacao
```

### 3. Subir pasta nova pro archive

```bash
node squads/conteudo/scripts/upload-archive.mjs <pasta-local> --prefix <nome-remoto>

# Exemplos
node squads/conteudo/scripts/upload-archive.mjs outputs/campanhas/nova-campanha --prefix campanhas/nova-campanha
node squads/conteudo/scripts/upload-archive.mjs /tmp/sessao-de-fotos-pascoa --prefix inteligencia/fotos/pascoa
```

Modo dry-run (lista sem subir):
```bash
node squads/conteudo/scripts/upload-archive.mjs <pasta> --prefix <nome> --dry-run
```

---

## Casos de uso comuns

### "Preciso ver o carrossel #3 da campanha Em Cristo pra referência"
```bash
node squads/conteudo/scripts/list-archive.mjs campanhas/em-cristo-antecipacao
# vê o nome da pasta
node squads/conteudo/scripts/pull-archive.mjs campanhas/em-cristo-antecipacao
# baixa tudo
open outputs/campanhas/em-cristo-antecipacao/carrosseis/03/
```

### "Vou começar nova campanha, mas quero o material da inteligência"
```bash
node squads/conteudo/scripts/pull-archive.mjs inteligencia/concorrentes-igrejas
# baixa só essa subpasta
```

### "Acabei de criar 20 PNGs grandes, quero salvar no archive antes de apagar local"
```bash
node squads/conteudo/scripts/upload-archive.mjs outputs/multiplicar/live-pentecostes --prefix multiplicar/live-pentecostes
# confirma upload
node squads/conteudo/scripts/list-archive.mjs multiplicar/live-pentecostes
# agora pode apagar local pra liberar espaço, sempre pode baixar de volta
```

### "Quero ver quanto espaço estou usando"
```bash
node squads/conteudo/scripts/list-archive.mjs
# mostra pastas top-level
# pra ver o total, lista cada uma:
for dir in campanhas inteligencia multiplicar vercel-deploy; do
  node squads/conteudo/scripts/list-archive.mjs $dir | grep "Total nesta pasta"
done
```

---

## O que vai (e o que NÃO vai) pro archive

### VAI pro archive
- PNGs de carrosseis publicados
- MP4s de reels
- Screenshots de concorrentes
- PDFs de pesquisa
- Assets visuais (logos, capas, fundos)
- HTML estático de deploys (vercel-deploy/)
- Qualquer arquivo binário >1MB

### NÃO vai pro archive (fica no Git)
- MDs (texto, planejamento, roteiros, briefs)
- JSONs (post.json, configs)
- YAMLs (configs, brand tokens)
- Scripts (.mjs, .sh, .js)
- Pequenos PNGs do brand/identidade (<100KB)
- Documentação (docs/)

---

## Quem pode fazer o quê

Toda pessoa do time tem o **mesmo nível de acesso** ao archive — não tem ACL por usuário no bucket. Implicações:

- **Qualquer um pode subir/baixar/sobrescrever**
- **Atenção:** o `upload-archive.mjs` usa flag `x-upsert: true` (sobrescreve se já existir)
- Não tem versionamento automático — se você sobrescrever, perde a versão antiga
- Recomendação: nunca subir num prefixo que já existe SEM antes baixar/conferir

### Boa prática
1. Antes de subir pasta nova com nome igual, baixe a antiga primeiro
2. Use prefixos com data se for versão (`campanhas/nova-2026-05/`)
3. Documente o que subiu no commit Git correspondente

---

## Credenciais necessárias

`.env` raiz precisa de:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

Aceita também o nome legado `SUPABASE_SERVICE_KEY` (caso seu .env venha do apps/publisher-instagram).

Bucket é fixo: `carrossel-images`. Pra trocar (se algum dia mudar de projeto Supabase):
```bash
SUPABASE_ARCHIVE_BUCKET=novo-bucket node squads/conteudo/scripts/list-archive.mjs
```

---

## Performance esperada

Conexão típica (50Mbps upload):
- Upload: ~0.5-1 MB/s
- Download: ~3-5 MB/s
- 100 arquivos pequenos (~5MB total): ~30s upload, ~10s download
- 1 GB total: ~20-30min upload, ~5-7min download

Se estiver muito lento:
- Confira sua conexão (`speedtest-cli`)
- Confira região do projeto Supabase (mais próximo = mais rápido)
- Para uploads grandes, deixe rodando em background (`nohup` ou tela separada)

---

## Troubleshooting

### "ERRO: .env não encontrado"
Crie `.env` na raiz com `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (ver `docs/SETUP.md` passo 3).

### "Supabase list falhou (401)"
Service Key errado, expirado, ou sem permissão. Peça novo ao administrador.

### "Supabase list falhou (404)"
Bucket errado. Confira que `carrossel-images` existe no projeto (provavelmente sim, é o mesmo do publisher).

### "fetch failed"
- Sem internet
- Supabase temporariamente fora (raro, mas acontece)
- VPN/firewall bloqueando

### "Upload falhou (413)"
Arquivo individual maior que limite do bucket. Limite padrão Supabase é 50MB por arquivo. Se for problema recorrente, peça pra aumentar no dashboard ou divida o arquivo.

### Upload trava no meio
Provavelmente timeout. O script continua com os próximos. Rode de novo, o `x-upsert: true` vai re-tentar (não duplica).

---

## Limpeza periódica

Periodicamente, alguém do time deve:
1. Listar o que está em cada pasta
2. Avaliar se algum material muito antigo pode ser deletado
3. Deletar via dashboard Supabase (não tem CLI de delete neste squad por segurança)

Boa prática: documentar o que foi deletado em `outputs/HANDOFF.md`.
