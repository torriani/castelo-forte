# Lições aprendidas — Squad Conteúdo

## 2026-05-16 — SHOWCASE deve mostrar PNG renderizado, não template Mustache

**Bug:** Apontei o catálogo (`templates/CATALOGO.html`) para `castelo-forte-editorial/capa.html`. HTTP respondia 200 mas o iframe renderizava branco.

**Causa raiz:** Os HTMLs em `templates/carousel/castelo-forte-*/` são **templates com placeholders Mustache** (`{{image_url}}`, `{{headline}}`, `{{accent_word}}`) — feitos pra serem hidratados pelo `scripts/render-carrossel.mjs`. Abrir direto = `background-image: url('{{image_url}}')` (string literal inválida) → fundo preto/branco sem conteúdo.

**Regra:** Antes de apontar um SHOWCASE pra qualquer template novo:
1. Abrir o HTML do template. Se contém `{{...}}` → é template Mustache, NÃO abre direto.
2. Procurar PNG renderizado em `legacy/outputs/copys/{cliente}/campanhas/*/preview/` ou em `legacy/outputs/copys/{cliente}/multiplicar/*/`
3. Copiar pra `templates/carousel/{template-pasta}/preview/*.png` (auto-contido no squad)
4. Criar `SHOWCASE.html` apontando pros PNGs locais com `<img>`, não pros HTMLs com `<iframe>`

**Anti-padrão:** Apontar iframe pra HTML com Mustache. Apontar caminho do outputs/ (frágil, depende de campanha existir).

**Onde aplicar:** Qualquer template novo no `catalog.yaml` que tenha pasta própria em `templates/carousel/`.
