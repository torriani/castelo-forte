#!/usr/bin/env python3
"""Limpeza final: remove header oficial duplicado das páginas internas que têm sidebar
(o branding já está na sidebar). Remove breadcrumbs migrados que confundem.
Garante consistência visual."""
import re
from pathlib import Path

ROOT = Path("conteudo/maio")

count_header = 0
count_breadcrumb_old = 0

for path in ROOT.rglob("*.html"):
    html = path.read_text()
    if 'class="has-sidebar"' not in html:
        continue

    orig = html

    # 1. Remove header.brand-header (já que sidebar mostra Castelo Forte)
    # Mantém apenas o title-block (h1 + sub) como subtítulo da página
    m = re.search(r'<header class="brand-header">(.*?)</header>', html, re.DOTALL)
    if m:
        header_html = m.group(1)
        # Extrai title-block do header
        tb = re.search(r'<div class="title-block">(.*?)</div>', header_html, re.DOTALL)
        title_h1 = ''
        title_sub = ''
        if tb:
            inner = tb.group(1)
            h1m = re.search(r'<h1[^>]*>(.*?)</h1>', inner, re.DOTALL)
            subm = re.search(r'<div class="sub">(.*?)</div>', inner, re.DOTALL)
            if h1m: title_h1 = h1m.group(1).strip()
            if subm: title_sub = subm.group(1).strip()
        # Remove o header inteiro
        html = html.replace(m.group(0), '')

        # Se o conteúdo da página não tem page-title já, injeta um logo no início do <main>
        if title_h1 and '<h2 class="page-title">' not in html and '<h1 class="page-title">' not in html:
            new_title_block = f'\n<h2 class="page-title">{title_h1}</h2>\n<p class="page-subtitle">{title_sub}</p>\n'
            html = re.sub(r'(<main class="page">\s*)', r'\1' + new_title_block, html, count=1)

        count_header += 1

    # 2. Remove breadcrumbs antigos do migrated-content que confundem (linha "← Briefing Maio")
    html = re.sub(r'<a[^>]*>← Briefing Maio</a>\s*/?\s*', '', html)
    html = re.sub(r'<a[^>]*>← Voltar</a>\s*/?\s*', '', html)

    if html != orig:
        path.write_text(html)

print(f"{count_header} headers removidos (sidebar agora é o branding único)")
