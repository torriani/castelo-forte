#!/usr/bin/env python3
"""Limpa páginas migradas: remove headers/navs/topbars antigos e CSS conflitante.
Garante que TODAS as páginas usem APENAS o header/menu/footer do padrão novo."""
import re
from pathlib import Path

ROOT = Path(__file__).parent
TARGETS = [
    *Path("conteudo/maio/inteligencia").rglob("index.html"),
    *Path("conteudo/maio/templates").rglob("index.html"),
]

# Resolve relative paths
TARGETS = [ROOT / t for t in TARGETS]

def clean(html):
    """Aplica regras de limpeza no HTML."""
    orig_len = len(html)

    # 1. Remove cf-brand-header e cf-main-menu (cabeçalho/menu DUPLICADOS dentro do conteúdo migrado)
    html = re.sub(
        r'<header class="cf-brand-header"[^>]*>.*?</header>',
        '', html, flags=re.DOTALL | re.IGNORECASE
    )
    html = re.sub(
        r'<div class="cf-brand-header"[^>]*>.*?</div>\s*(?=<nav|<main|<div class="cf-main-menu)',
        '', html, flags=re.DOTALL | re.IGNORECASE
    )
    # Captura possíveis variações soltas (div até próximo <main>/<section> de topo)
    html = re.sub(
        r'<div class="cf-brand-header"[^>]*>[\s\S]*?</div>\s*</div>',
        '', html, flags=re.IGNORECASE
    )
    # Remove menus duplicados
    html = re.sub(
        r'<nav class="cf-main-menu"[^>]*>.*?</nav>',
        '', html, flags=re.DOTALL | re.IGNORECASE
    )
    html = re.sub(
        r'<div class="cf-main-menu"[^>]*>.*?</div>\s*(?=<main|<section|<div class="container)',
        '', html, flags=re.DOTALL | re.IGNORECASE
    )
    # Topbar/main-nav antigos do padrão "briefing"
    html = re.sub(
        r'<div class="topbar"[^>]*>.*?</div>\s*</div>\s*</div>',
        '', html, flags=re.DOTALL | re.IGNORECASE
    )

    # 2. Remove CSS conflitante (position: fixed do topbar/header antigo e padding-top do body)
    # Remove blocos CSS de .cf-brand-header { ... }
    html = re.sub(
        r'\.cf-brand-header\s*\{[^}]*\}',
        '', html, flags=re.IGNORECASE
    )
    html = re.sub(
        r'\.cf-brand-header\s+[^{]+\{[^}]*\}',
        '', html, flags=re.IGNORECASE
    )
    # Remove blocos de .cf-main-menu
    html = re.sub(
        r'\.cf-main-menu\s*\{[^}]*\}',
        '', html, flags=re.IGNORECASE
    )
    html = re.sub(
        r'\.cf-main-menu\s+[^{]+\{[^}]*\}',
        '', html, flags=re.IGNORECASE
    )
    # Remove .topbar
    html = re.sub(
        r'\.topbar\s*\{[^}]*\}',
        '', html, flags=re.IGNORECASE
    )
    # Remove body { padding-top: 120px } e similares dos estilos antigos
    html = re.sub(
        r'body\s*\{\s*padding-top:\s*\d+px[^}]*\}',
        '', html, flags=re.IGNORECASE
    )

    # 3. Remove links de fonte duplicados dentro do <style> migrado (Google Fonts já está no <head> oficial)
    # Não toca no <head> oficial

    return html, len(html), orig_len

count = 0
for path in TARGETS:
    if not path.exists(): continue
    orig = path.read_text()
    new, new_len, orig_len = clean(orig)
    if new != orig:
        path.write_text(new)
        diff = orig_len - new_len
        rel = str(path).split("conteudo/maio/")[-1]
        print(f"✓ {rel} (–{diff} bytes)")
        count += 1

print(f"\n=== {count} páginas limpas ===")
