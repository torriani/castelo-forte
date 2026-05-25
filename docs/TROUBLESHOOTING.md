# TROUBLESHOOTING — Erros Comuns

Cole o erro aqui (Ctrl+F) pra achar a solução rápido.

---

## Setup / Instalação

### "command not found: node"
Node não está instalado ou não está no PATH.
```bash
brew install node
# se já tinha, recarregue o shell:
source ~/.zshrc
```

### "command not found: claude"
Claude Code CLI não instalado. Veja https://claude.com/claude-code/quickstart

### "npm install" falha em squads/conteudo/app/image-generator/
Geralmente é versão de Node antiga ou problema com Sharp/Playwright nativo.
```bash
node --version    # precisa ser >= 18
# Se for menor, atualize:
brew upgrade node

# Limpe e reinstale
cd squads/conteudo/app/image-generator
rm -rf node_modules package-lock.json
npm install
```

### "Permission denied" ao tentar editar arquivo
```bash
# Confira permissões da pasta
ls -la
# Se necessário:
chmod -R u+w .
```

---

## .env / Credenciais

### "ERRO: .env não encontrado em /Users/.../castelo-forte/.env"
Você ainda não copiou `.env.example` pra `.env`.
```bash
cp .env.example .env
# Edite e preencha:
code .env
```

### "ERRO: variáveis ausentes no .env: SUPABASE_SERVICE_ROLE_KEY"
Falta variável obrigatória no `.env`. Aceita também `SUPABASE_SERVICE_KEY` (nome legado).

### "Supabase list falhou (401): JWT expired"
Token Supabase expirou. Service Key normalmente não expira, mas se mexerem nas keys do projeto, gera novo:
- https://app.supabase.com → projeto → Settings → API → service_role
- Atualize `.env` raiz e `.env` do apps/publisher-instagram

### "Graph error: ... access_token"
Token Instagram inválido ou expirado.

**Se for User Access Token comum:** expira em 60 dias. Gera novo no Graph API Explorer ou via curl:
```bash
# Long-lived token
curl "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=SHORT_TOKEN"
```

**Recomendado:** use System User Token (não expira). Ver `docs/PUBLICAR.md` seção "Como obter os tokens".

---

## Publisher Instagram

### "Publisher bloqueado" — Notificação Mac
O filtro Anti-IA reprovou. Veja o log:
```bash
/publicar-log
# ou
tail -50 apps/publisher-instagram/logs/publisher-$(date +%Y-%m-%d).log
```

Identifique qual regra violou, corrija a legenda, e rode de novo:
```bash
bash squads/conteudo/scripts/validate-anti-ia.sh apps/publisher-instagram/publicar/NN-.../legenda.md
```

### "Container error" do Instagram
Imagem inválida pelo padrão Meta. Causas comuns:
- Aspect ratio fora de 1:1 (1080x1080) ou 4:5 (1080x1350)
- Tamanho < 320px
- Formato não-suportado (use PNG ou JPG)
- Arquivo corrompido

Regenere o PNG:
```bash
cd squads/conteudo/app/image-generator
node generate.mjs --batch <post.json> --output <pasta>
```

### "Nenhum post na janela de publicacao agora"
O publisher só publica se horário agendado estiver entre [-5min, +10min] de agora. Se já passou, está perdido.

Solução: publique manualmente:
```bash
/publicar-agora N
# ou
cd apps/publisher-instagram
node publisher.mjs --force --only=N
```

### "Container error: status=ERROR"
A Meta API aceitou o container mas não conseguiu processar. Frequentemente é:
- URL da imagem inacessível (verifica que Supabase está OK)
- Caption muito longa (>2200 chars)
- Hashtag count > 30

Veja o log completo do publisher pra detalhes.

### LaunchAgent não dispara
```bash
# Confira se está carregado
launchctl list | grep castelo-forte
# Deve aparecer:
# -    0    com.castelo-forte.instagram-publisher

# Se não aparece, carregue:
launchctl load -w ~/Library/LaunchAgents/com.castelo-forte.instagram-publisher.plist

# Se aparece mas não dispara, ver erros:
cat apps/publisher-instagram/logs/launchd-err.log
```

Causas comuns:
- Path do node errado no plist (rode `which node` pra confirmar)
- Path do publisher.mjs errado
- WorkingDirectory errado (precisa ser `.../apps/publisher-instagram`)

### Apple bloqueia o LaunchAgent (Gatekeeper)
```bash
# Vá em Configurações > Privacidade e Segurança > permita o app
# Ou via terminal:
xattr -d com.apple.quarantine /usr/local/bin/node 2>/dev/null
```

---

## Anti-IA

### "validate-anti-ia.sh: command not found"
Script não é executável. Dê permissão:
```bash
chmod +x squads/conteudo/scripts/validate-anti-ia.sh
```

### Exit code 1 sem mensagem clara
O script é grep determinístico. Roda com `-v` (verboso) se quiser ver TODOS os checks:
```bash
bash -x squads/conteudo/scripts/validate-anti-ia.sh <arquivo>
```

Causas comuns de reprovação:
- **Travessão** (—, –) — substitua por vírgula, ponto, dois pontos, parênteses
- **Sequência "X, Y, Z"** genérica — varie a estrutura
- **Jargão IA** ("desbloqueie", "potencialize", "elevar ao próximo nível")
- **Frases tipo "imagine X, Y e Z"** — varie

Leia `squads/conteudo/checklists/filtro-anti-ia.md` pra lista completa.

---

## Archive Supabase

### "Upload falhou (413): Payload too large"
Arquivo individual maior que 50MB (limite padrão bucket Supabase). Reduza:
- PNG: comprima com `pngquant` ou `tinypng`
- MP4: re-encode com `ffmpeg -crf 28`

### Upload trava no meio sem erro
Provavelmente timeout silencioso. O `x-upsert: true` permite re-rodar sem duplicar:
```bash
node squads/conteudo/scripts/upload-archive.mjs <pasta> --prefix <nome>
# Repete os que falharam, pula os já enviados (na verdade sobrescreve)
```

### "pull-archive.mjs: prefix vazio"
Você passou um prefixo que não existe no archive.
```bash
# Confira primeiro com list:
node squads/conteudo/scripts/list-archive.mjs
node squads/conteudo/scripts/list-archive.mjs campanhas
# Use o nome exato que apareceu
```

### Download lento (< 100KB/s)
- Confira sua conexão
- Confira região do projeto Supabase (dashboard → Settings → General)
- Tente em horários de menor congestão

---

## Claude Code / Agentes

### `@content-chief` não responde
- Confira que está dentro de `squads/conteudo/` ou subpasta (CLAUDE.md carrega só lá)
- Reinicie sessão Claude Code: `/clear`
- Confira que `squads/conteudo/agents/content-chief.md` existe e está válido

### "Skill X not found"
Skill não está instalada na sua máquina. Skills do squad ficam em `squads/conteudo/skills/` (locais) ou em `~/.claude/skills/` (globais).

Pra recarregar:
```bash
# Dentro do Claude Code
/clear
@content-chief
```

### Agente fica em loop ou esquece contexto
Compactação automática descartou contexto importante. Soluções:
- Force compactação manual: `/compact`
- Limpe e recomece: `/clear`
- Cole o contexto crítico de novo

---

## Git

### "pre-commit hook bloqueou meu commit"
Provavelmente você está tentando commitar:
- `.env` (secrets)
- Arquivo >10MB
- `.onnx`, `.mp4`, `.mov`

Solução:
- Pra arquivos grandes: suba pro archive (`upload-archive.mjs`) em vez do Git
- Pra `.env`: nunca commite, é certo que está no `.gitignore`
- Pra falso positivo (raro): `git commit --no-verify` (NÃO faça isso sem entender por quê)

### "fatal: refusing to merge unrelated histories"
Você clonou e tentou puxar de outra branch divergente. Solução cuidadosa:
```bash
git fetch origin
git log origin/main..HEAD --oneline    # vê o que você tem que não está no remoto
git log HEAD..origin/main --oneline    # vê o que está no remoto que você não tem
```

Se quiser realmente forçar merge:
```bash
git pull origin main --allow-unrelated-histories
# Resolve conflitos manualmente
```

### Push rejeitado: "non-fast-forward"
Alguém pushou antes de você. Sincronize:
```bash
git pull --rebase origin main
# Resolve conflitos se houver
git push origin main
```

---

## Geral

### "Eu acidentalmente deletei um arquivo importante"

**Não panique.**

1. Não rode mais nada que possa sobrescrever
2. Veja se está no git:
   ```bash
   git status
   git log --diff-filter=D -- caminho/do/arquivo
   ```
3. Recupere:
   ```bash
   git checkout HEAD~1 -- caminho/do/arquivo
   ```

Se era arquivo no archive Supabase: dashboard Supabase tem backup automático (Point-in-Time se habilitado).

### "Estou perdido, não sei por onde começar"
1. Leia `README.md` da raiz
2. Leia `docs/SETUP.md` (se for primeiro dia)
3. Leia `docs/USO.md` (referência rápida)
4. Pergunte ao `@content-chief` no Claude Code: ele te orienta

### "Tem como reverter tudo que fiz hoje?"
```bash
git stash         # salva mudanças não-commitadas
git log --oneline -10   # vê últimos commits
git reset --hard <hash-de-onde-quer-voltar>    # CUIDADO: destrutivo
```

⚠️ `git reset --hard` apaga trabalho não-commitado. Sempre faça `git stash` ou backup antes.

---

## Quando nada funciona

1. Confira que está com último `git pull`
2. Confira `node --version >= 18`
3. Apague `node_modules/` e roda `npm install` de novo
4. Confira `.env` está preenchido
5. Reinicie Claude Code (`/clear`)
6. Se tudo falhar: abra issue no repo com o output completo do erro
