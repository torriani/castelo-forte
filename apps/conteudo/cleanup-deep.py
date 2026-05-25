#!/usr/bin/env python3
"""Limpeza profunda: remove .cf-title, .cf-nav, .cf-rebrand padding,
e tags duplicadas dentro do migrated-content que confundem o layout."""
import re
from pathlib import Path

ROOT = Path("conteudo/maio")

count = 0
for path in ROOT.rglob("*.html"):
    html = path.read_text()
    if 'class="has-sidebar"' not in html:
        continue

    orig = html

    # 1. Remove regras CSS de cf-rebrand padding-top (que força gap no topo)
    html = re.sub(r'body\.cf-rebrand\s*\{[^}]*padding-top[^}]*\}', '', html)
    html = re.sub(r'body\.cf-rebrand\s*\{[^}]*\}', '', html)

    # 2. Remove divs duplicadas DENTRO do migrated-content (título e nav antigos)
    html = re.sub(r'<div class="cf-title">.*?</div>', '', html, flags=re.DOTALL)
    html = re.sub(r'<div class="cf-nav">.*?</div>', '', html, flags=re.DOTALL)
    html = re.sub(r'<div class="cf-subtitle">.*?</div>', '', html, flags=re.DOTALL)

    # 3. Remove regras CSS de cf-title/cf-nav/cf-subtitle restantes
    html = re.sub(r'\.cf-title[^{]*\{[^}]*\}', '', html)
    html = re.sub(r'\.cf-nav[^{]*\{[^}]*\}', '', html)
    html = re.sub(r'\.cf-subtitle[^{]*\{[^}]*\}', '', html)

    # 4. Remove page-subtitle VAZIO (que aparece quando header foi removido sem sub)
    html = re.sub(r'<p class="page-subtitle">\s*</p>\s*', '', html)

    # 5. Remove breadcrumb migrado vazio ("← Voltar" / "← Briefing Maio")
    html = re.sub(r'<a[^>]*>← Briefing Maio</a>\s*/?\s*', '', html)
    html = re.sub(r'<a[^>]*>← Voltar</a>\s*/?\s*', '', html)

    # 6. Remove regras de body com padding-top forçado (que causa gap no topo)
    html = re.sub(r'body\s*\{\s*padding-top:\s*\d+px[^}]*\}', '', html)
    html = re.sub(r'body\s*\{\s*padding:\s*[\d\s]+px[^}]*\}', '', html)

    if html != orig:
        path.write_text(html)
        count += 1

print(f"{count} páginas limpas profundamente")
