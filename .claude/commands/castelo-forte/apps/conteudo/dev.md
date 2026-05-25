---
description: "Sobe o portal de aprovação localmente (apps/conteudo/) em http://localhost:8080"
---

Você está no repositório **Castelo Forte**. O usuário quer rodar o portal de aprovação localmente pra editar/testar.

## Execute

Suba o servidor estático na porta 8080 a partir de `apps/conteudo/`. O portal é HTML/CSS/JS puro (sem Node/React), então qualquer servidor estático funciona.

### Comando recomendado (Python, já vem no Mac)

```bash
cd ~/claude/castelo-forte/apps/conteudo && python3 -m http.server 8080
```

Use Bash com `run_in_background: true` pra o servidor ficar rodando enquanto o usuário trabalha.

### Após subir

1. Confirme que o servidor está no ar (Bash de validação rápida):
   ```bash
   sleep 1 && curl -s -o /dev/null -w "%{http_code}" http://localhost:8080
   ```
   Esperado: `200`.

2. Abra o navegador pro usuário ver imediatamente:
   ```bash
   open http://localhost:8080
   ```

3. Diga ao usuário:
   - **URL local:** http://localhost:8080
   - **Pra parar o servidor:** rode `lsof -ti:8080 | xargs kill` ou feche o terminal
   - **Pra editar:** os arquivos estão em `apps/conteudo/` (HTML, CSS, JS, imagens em `img/`)

## Alternativas (mencione só se Python falhar)

- **npx serve** (Node, sem instalar nada):
  ```bash
  cd ~/claude/castelo-forte/apps/conteudo && npx serve -p 8080
  ```

- **Vercel dev** (mais fiel à produção, respeita `vercel.json` com redirects/headers/cache):
  ```bash
  cd ~/claude/castelo-forte/apps/conteudo && vercel dev
  ```
  Use esta opção se o usuário quer testar redirects, headers ou cache de produção.

## Se a porta 8080 estiver ocupada

```bash
# Mata processo na porta
lsof -ti:8080 | xargs kill 2>/dev/null

# Ou usa outra porta
cd ~/claude/castelo-forte/apps/conteudo && python3 -m http.server 8081
```
