#!/usr/bin/env python3
"""Substitui o menu antigo (Dashboard/Calendário/Inteligência/Conteúdo/Templates/Plano)
pelo PADRÃO DE 2 NÍVEIS:
  1) Menu global: Conteúdo · Cultos · Campanhas
  2) Submenu da campanha: Dashboard · Calendário · Inteligência · Conteúdo · Templates · Plano

Aplica em TODAS as páginas dentro de /conteudo/maio/."""
import re
from pathlib import Path

ROOT = Path(__file__).parent / "conteudo" / "maio"

# Detecta qual submenu marcar como active baseado na URL
def detect_sub_active(filepath):
    rel = str(filepath).split("conteudo/maio/")[-1] if "conteudo/maio/" in str(filepath) else str(filepath)
    if rel.startswith("inteligencia"): return "inteligencia"
    if rel.startswith("templates"): return "templates"
    if rel.startswith("conteudo"): return "conteudo"
    if rel.startswith("calendario"): return "calendario"
    if rel.startswith("plano"): return "plano"
    return "dashboard"

def build_menus(sub_active):
    actives = {k: "" for k in ["dashboard", "calendario", "inteligencia", "conteudo", "templates", "plano"]}
    if sub_active in actives:
        actives[sub_active] = ' class="active"'

    # Menu global: TODAS páginas da campanha ficam dentro de "Campanhas"
    global_menu = '''<nav class="main-menu">
  <div class="menu-inner">
    <ul>
      <li><a href="/conteudo/">Conteúdo</a></li>
      <li><a href="/conteudo/cultos/">Cultos</a></li>
      <li><a href="/conteudo/campanhas/" class="active">Campanhas</a></li>
    </ul>
  </div>
</nav>'''

    sub_menu = f'''<nav class="sub-menu">
  <div class="menu-inner">
    <span class="sub-label">Em <em>Cristo</em></span>
    <ul>
      <li><a href="/conteudo/maio/"{actives["dashboard"]}>Dashboard</a></li>
      <li><a href="/conteudo/maio/calendario/"{actives["calendario"]}>Calendário</a></li>
      <li><a href="/conteudo/maio/inteligencia/"{actives["inteligencia"]}>Inteligência</a></li>
      <li><a href="/conteudo/maio/conteudo/"{actives["conteudo"]}>Conteúdo</a></li>
      <li><a href="/conteudo/maio/templates/"{actives["templates"]}>Templates</a></li>
      <li><a href="/conteudo/maio/plano/"{actives["plano"]}>Plano</a></li>
    </ul>
  </div>
</nav>'''
    return global_menu + "\n\n" + sub_menu

# Regex pra detectar o bloco do menu antigo (que tem os 6 itens da campanha)
OLD_MENU_RE = re.compile(
    r'<nav class="main-menu">\s*<div class="menu-inner">\s*<ul>\s*'
    r'<li><a href="/conteudo/maio/"[^>]*>Dashboard</a></li>.*?</ul>\s*</div>\s*</nav>',
    re.DOTALL | re.IGNORECASE
)

count = 0
skipped = 0
files = list(ROOT.rglob("*.html"))
for path in files:
    html = path.read_text()
    if not OLD_MENU_RE.search(html):
        skipped += 1
        continue
    sub_active = detect_sub_active(path)
    new_menu = build_menus(sub_active)
    new_html = OLD_MENU_RE.sub(new_menu, html)
    path.write_text(new_html)
    rel = str(path).split("conteudo/maio/")[-1]
    count += 1
    print(f"✓ {rel}  (sub-active: {sub_active})")

print(f"\n=== {count} páginas migradas, {skipped} sem menu antigo ===")
