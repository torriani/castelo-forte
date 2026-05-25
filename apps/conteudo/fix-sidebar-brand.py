#!/usr/bin/env python3
"""Adiciona bloco sidebar-brand (logo + Castelo Forte) dentro de cada sub-menu
nas páginas internas. Não duplica se já existir."""
import re
from pathlib import Path

ROOT = Path("conteudo/maio")

SIDEBAR_BRAND = '''<div class="sidebar-brand">
      <div class="logo-mini"><img src="/img/logo-oficial.png" alt="Castelo Forte"></div>
      <div class="brand-text">
        Castelo Forte
        <small>Jurerê · SC</small>
      </div>
    </div>'''

count = 0
for path in ROOT.rglob("*.html"):
    html = path.read_text()
    if 'class="sub-menu"' not in html:
        continue
    if 'class="sidebar-brand"' in html:
        continue  # já tem
    # Insere o sidebar-brand logo após <div class="menu-inner"> dentro do sub-menu
    pattern = re.compile(
        r'(<nav class="sub-menu">\s*<div class="menu-inner">)',
        re.DOTALL
    )
    new = pattern.sub(r'\1\n    ' + SIDEBAR_BRAND, html, count=1)
    if new != html:
        path.write_text(new)
        count += 1
print(f"{count} páginas com sidebar-brand adicionado")
