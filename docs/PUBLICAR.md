# PUBLICAR — Pipeline Instagram

Manual completo da publicação automática no Instagram da Castelo Forte (@castelofortefloripa).

---

## Como funciona

Existe um `publisher.mjs` que:
1. Olha a fila em `apps/publisher-instagram/publicar/`
2. Pega o próximo post cujo horário agendado chegou
3. **Roda o filtro Anti-IA** (bloqueia se não passar)
4. Sobe a imagem pro Supabase Storage (pra ter URL pública)
5. Cria container Instagram via Meta Graph API
6. Publica o container
7. Move a pasta pra `publicado/` com `result.json` (media_id, timestamps)

O publisher é disparado automaticamente por um **LaunchAgent** (cron do macOS) nos horários configurados (padrão: 08:00 e 19:00 BRT).

---

## Setup do LaunchAgent (primeira vez)

### 1. Confira que o `.env` do apps/publisher-instagram está preenchido
```bash
cat apps/publisher-instagram/.env
```

Tem que ter:
```env
INSTAGRAM_ACCESS_TOKEN=EAAxxxxxxx
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841402079107066
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...
SUPABASE_BUCKET=carrossel-images
SUPABASE_FOLDER=instagram-posts
```

### 2. Crie o arquivo do LaunchAgent
Edite com seu editor preferido:
```bash
nano ~/Library/LaunchAgents/com.castelo-forte.instagram-publisher.plist
```

Cole (ajuste o **path** do repo no seu computador):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.castelo-forte.instagram-publisher</string>

  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>/Users/SEU_USUARIO/clientes/castelo-forte/apps/publisher-instagram/publisher.mjs</string>
  </array>

  <key>WorkingDirectory</key>
  <string>/Users/SEU_USUARIO/clientes/castelo-forte/apps/publisher-instagram</string>

  <key>StartCalendarInterval</key>
  <array>
    <dict>
      <key>Hour</key><integer>8</integer>
      <key>Minute</key><integer>0</integer>
    </dict>
    <dict>
      <key>Hour</key><integer>19</integer>
      <key>Minute</key><integer>0</integer>
    </dict>
  </array>

  <key>StandardOutPath</key>
  <string>/Users/SEU_USUARIO/clientes/castelo-forte/apps/publisher-instagram/logs/launchd-out.log</string>
  <key>StandardErrorPath</key>
  <string>/Users/SEU_USUARIO/clientes/castelo-forte/apps/publisher-instagram/logs/launchd-err.log</string>
</dict>
</plist>
```

> ⚠️ Substitua `SEU_USUARIO` em **4 lugares** (caminho do publisher.mjs, WorkingDirectory, e 2 paths de log).
> Confira o caminho do node com `which node`.

### 3. Carregue o LaunchAgent
```bash
launchctl load -w ~/Library/LaunchAgents/com.castelo-forte.instagram-publisher.plist
```

### 4. Verifique que está ativo
```bash
launchctl list | grep castelo-forte
# Deve mostrar:
# -    0    com.castelo-forte.instagram-publisher
```

---

## Adicionar post à fila

Cada post na fila é uma **pasta** com nome no formato:
```
NN-YYYY-MM-DD-HHMM-slug/
```
- `NN` = ordem (01, 02, 03...)
- `YYYY-MM-DD-HHMM` = data e hora de publicação (BRT)
- `slug` = identificador curto

Exemplo: `15-2026-05-25-1900-domingo-pentecostes/`

Dentro da pasta, exatamente 3 arquivos:

### `post.png` — a imagem do post
Gere com o `image-generator` ou renderize com o `render-carrossel.mjs`.

### `post.json` — metadados estruturados
```json
{
  "tipo": "single",
  "slug": "domingo-pentecostes",
  "agendado_para": "2026-05-25T19:00:00-03:00",
  "campanha": "em-cristo-antecipacao"
}
```

### `legenda.md` — caption do Instagram
```markdown
# Título interno (opcional, será removido)

Texto que vai pro Instagram.

Múltiplos parágrafos.

#castelo #igreja #hashtags
```

> O publisher remove a primeira linha que começa com `#` (título interno) e limita a 2200 caracteres (regra do IG).

### Recriar a queue.json
```bash
rm apps/publisher-instagram/queue.json
# O publisher regenera sozinho na próxima execução
```

---

## Comandos do dia a dia

### Ver status da fila
```bash
/publicar-status
```
Mostra:
- Quantos posts na fila
- Próximo agendado (data/hora)
- Quantos já publicados
- Falhas (se houver)

### Ver log do dia
```bash
/publicar-log
```
Mostra o log das últimas execuções do publisher.

### Publicar AGORA (sem esperar cron)
Manual de um post específico:
```bash
/publicar-agora 15
# publica o post #15 da fila independente do horário
```

Manual de um post AVULSO (não está na fila):
```bash
/publicar
# segue dry-run + aprovação interativa
```

### Pausar / retomar o cron
```bash
/publicar-pause
# desativa o LaunchAgent

/publicar-resume
# reativa
```

Equivalente manual:
```bash
launchctl unload ~/Library/LaunchAgents/com.castelo-forte.instagram-publisher.plist
launchctl load -w ~/Library/LaunchAgents/com.castelo-forte.instagram-publisher.plist
```

---

## Dry run (testar sem publicar)

Antes de soltar post real, sempre teste:
```bash
cd apps/publisher-instagram
node publisher.mjs --dry-run --only=15
```

Mostra:
- Tamanho da legenda
- Preview dos primeiros 200 chars
- Se passaria no filtro Anti-IA
- Não chama Meta API (não publica)

---

## Filtro Anti-IA bloqueante

Antes de tentar publicar, o publisher roda:
```bash
bash squads/conteudo/scripts/validate-anti-ia.sh legenda.md
bash squads/conteudo/scripts/validate-anti-ia.sh post.json --json
```

Se algum falhar: **publicação BLOQUEADA**. Você vê notificação macOS + erro no log.

Para bypassar em emergência (NÃO recomendado):
```bash
node publisher.mjs --skip-anti-ia --only=15
```

Esse bypass gera log explícito de override e deve ser usado só em última instância.

---

## Estrutura completa do pipeline

```
apps/publisher-instagram/
├── .env                          # secrets (NÃO commitado)
├── .env.example
├── publisher.mjs                 # motor
├── package.json
├── README.md
├── queue.json                    # regerado dinamicamente
├── publicar/                     # fila (pendentes)
│   ├── 01-2026-05-25-0800-slug/
│   │   ├── post.png
│   │   ├── post.json
│   │   └── legenda.md
│   └── 02-...
├── publicado/                    # já publicados (movidos pra cá)
│   └── 01-2026-05-25-0800-slug/
│       ├── post.png
│       ├── post.json
│       ├── legenda.md
│       └── result.json           # media_id + timestamp + container_id
└── logs/
    ├── publisher-2026-05-24.log
    ├── launchd-out.log
    └── launchd-err.log
```

---

## Como obter os tokens (primeira vez)

### Instagram Access Token (System User)
**System User não expira**, recomendado pra produção.

1. Vá em https://business.facebook.com → Configurações de negócios
2. Usuários do sistema → Adicionar
3. Nome: "Publisher Castelo Forte" → Função: Admin
4. Atribuir ativos → Página Facebook da igreja → permissão Total
5. Gerar token → Páginas + `instagram_basic` + `instagram_content_publish` + `pages_show_list`
6. Copia o token (começa com `EAA...`)

### Instagram Business Account ID
```bash
curl "https://graph.facebook.com/v21.0/me/accounts?access_token=SEU_TOKEN" | jq
# Pega o "id" da página Facebook da Castelo Forte
curl "https://graph.facebook.com/v21.0/PAGE_ID?fields=instagram_business_account&access_token=SEU_TOKEN" | jq
# Retorna o instagram_business_account.id — esse é o INSTAGRAM_BUSINESS_ACCOUNT_ID
```

### Supabase Service Key
1. https://app.supabase.com → projeto compartilhado da Castelo Forte
2. Settings → API → `service_role` key (NÃO a anon)
3. Copia (começa com `eyJhbGci...`)

---

## Troubleshooting básico de publicação

| Sintoma | Causa provável | Solução |
|---|---|---|
| Notificação "Publisher bloqueado" | Filtro Anti-IA reprovou | Veja o log, corrija a legenda, rode `validate-anti-ia.sh` |
| Erro "Supabase upload falhou (401)" | Service Key errado ou expirado | Gere novo, atualize `.env` |
| Erro "Graph error: ... access_token" | Token Instagram expirou | Gere novo System User Token |
| Erro "Container ERROR" | Imagem inválida (aspect ratio, formato) | Confira PNG: 1080x1350 ou 1080x1080 |
| LaunchAgent não dispara | plist mal configurado | `launchctl list \| grep castelo-forte` para confirmar |
| "queue.json: nenhum post na janela" | Horário não bateu (±5min antes / +10min depois) | Use `/publicar-agora N` |

Mais em `docs/TROUBLESHOOTING.md`.
