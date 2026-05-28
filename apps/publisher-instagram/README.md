# Plano de Conteúdo 2026 — Pipeline de Publicação Automática

Sistema de publicação automática no Instagram (@castelofortefloripa) com agendamento via LaunchAgent do macOS e hosting de imagens no Supabase Storage.

---

## Estrutura

```
apps/publisher-instagram-2026/
├── .env                       Credenciais Meta + Supabase (não commitar)
├── .gitignore
├── package.json               Sem deps externas (só Node nativo)
├── publisher.mjs              Script principal de publicação
├── queue.json                 Estado da fila (gerado automaticamente)
├── README.md                  Este arquivo
├── CALENDARIO-10-DIAS/        Fonte original dos posts (não mexer)
├── publicar/                  Fila ativa — posts agendados pendentes
│   └── NN-YYYY-MM-DD-HHMM-slug/
│       ├── post.png           Imagem do print-tweet
│       ├── post.json          Body + metadata
│       └── legenda.md         Texto que vai na caption do Instagram
├── publicado/                 Arquivo histórico — posts já publicados
│   └── NN-.../
│       ├── post.png
│       ├── post.json
│       ├── legenda.md
│       └── result.json        media_id, container_id, image_url, timestamps
├── logs/                      Logs por dia (publisher-YYYY-MM-DD.log)
└── dashboard/                 (futuro — métricas em tempo real)
```

---

## Como funciona

1. **LaunchAgent** (`com.castelo-forte.instagram-publisher`) dispara `node publisher.mjs` às **08:00** e **19:00** todos os dias.
2. Publisher lê `queue.json`, acha o próximo post `pending` cuja hora cai na janela (5min antes / 10min depois).
3. Faz **upload do PNG pro Supabase Storage** (bucket `carrossel-images`, pasta `instagram-posts/`).
4. Cria container no Instagram via Graph API (`POST /{ig-user-id}/media`).
5. Aguarda status `FINISHED` (até 60s).
6. Publica container (`POST /{ig-user-id}/media_publish`).
7. Move pasta de `publicar/` → `publicado/`.
8. Salva `result.json` com `media_id` e timestamps.
9. Atualiza `queue.json` (status `published`).

Hosting via **Supabase Storage** (URL pública estável, sem dependência de túnel local).

---

## Convenção de nomeação

Cada post fica numa subpasta com nome:

```
NN-YYYY-MM-DD-HHMM-slug/
```

- `NN` = ordem (01, 02, ...)
- `YYYY-MM-DD-HHMM` = data e hora de publicação (BRT, fuso -03:00)
- `slug` = identificador curto (ex: `ia-repertorio`, `tese-final-imperador`)

Exemplos:
- `01-2026-05-14-0800-ia-repertorio` (14/05 às 08:00)
- `02-2026-05-14-1900-tempo-crescimento` (14/05 às 19:00)

---

## Comandos

```bash
cd /Users/castelofortefloripa/claude/apps/publisher-instagram-2026

# Modo dry-run (mostra o que faria, sem postar)
node publisher.mjs --dry-run --only=1

# Forçar publicação manual de um post específico
node publisher.mjs --only=5

# Rodar manualmente (vai postar se houver post na janela de horário)
node publisher.mjs

# Reconstruir queue.json a partir das pastas em publicar/
rm queue.json && node publisher.mjs --dry-run --only=1

# Ver fila atual
cat queue.json | python3 -m json.tool

# Ver log do dia
cat logs/publisher-$(date +%Y-%m-%d).log

# Desativar agendamento
launchctl unload ~/Library/LaunchAgents/com.castelo-forte.instagram-publisher.plist

# Reativar agendamento
launchctl load -w ~/Library/LaunchAgents/com.castelo-forte.instagram-publisher.plist

# Verificar se está ativo
launchctl list | grep castelo-forte.instagram
```

---

## Adicionar novos posts

Pra adicionar um novo post à fila:

1. Criar pasta em `publicar/` seguindo o padrão `NN-YYYY-MM-DD-HHMM-slug/`
2. Colocar dentro:
   - `post.png` (imagem 1080x1350)
   - `post.json` (formato do gerador de imagens)
   - `legenda.md` (texto da caption)
3. Apagar `queue.json` (será regenerado na próxima execução)

Pode também copiar PNG + JSON existentes da pasta `CALENDARIO-10-DIAS/` e adicionar manualmente a `legenda.md`.

---

## Credenciais

Tudo em `.env`. Já configurado:

- `INSTAGRAM_ACCESS_TOKEN` — System User Token (não expira)
- `INSTAGRAM_BUSINESS_ACCOUNT_ID` — ID da conta @castelofortefloripa
- `FACEBOOK_PAGE_ID` — Página Facebook vinculada
- `GRAPH_API_VERSION` — v21.0
- `SUPABASE_URL` — projeto Castelo Forte
- `SUPABASE_SERVICE_KEY` — service role key (não expor)
- `SUPABASE_BUCKET` — `carrossel-images` (já existe, público)
- `SUPABASE_FOLDER` — `instagram-posts` (subpasta dentro do bucket)

Permissões Meta validadas:
- `instagram_basic`
- `instagram_content_publish` (essencial)
- `instagram_manage_insights` (para métricas futuras)
- `pages_show_list`
- `read_insights`

---

## Status atual

- 12 posts organizados em `publicar/` (14/05 a 19/05)
- LaunchAgent ativo rodando 08:00 e 19:00
- Hosting via Supabase Storage (URL pública estável)
- Sistema de logs por dia em `logs/`
- Arquivamento automático em `publicado/` após sucesso

Próximos posts (13-32) serão adicionados conforme bodies forem revisados e legendas geradas.

---

## Requisitos pro Mac

- Mac ligado e online nos horários 08:00 e 19:00
- Usuário com sessão ativa (não precisa estar logado, basta estar bootado)
- Recomendado: System Settings → Lock Screen → Never sleep when plugged in

Se o Mac estiver desligado/offline no horário, o LaunchAgent não enfileira o disparo — ele apenas dispara no próximo horário agendado. Posts perdidos ficam como `pending` em `queue.json` e podem ser publicados manualmente com `--only=N --force`.

---

## Roadmap

- [ ] Adicionar posts 13-32 conforme revisão dos bodies
- [ ] Dashboard vivo lendo métricas via Graph API (likes, comments, saves, reach)
- [ ] Sistema de aprendizado: cruzar métricas com tipo de post / framework / horário / dia
- [ ] Notificação Telegram quando post publica (sucesso ou erro)
- [ ] Pipeline de Stories vinculados a cada post de feed
