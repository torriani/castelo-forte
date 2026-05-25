#!/usr/bin/env python3
"""Unifica sidebar em TODAS as páginas internas da campanha Em Cristo.
Estrutura nova da sidebar:
  - Logo + Castelo Forte (sempre)
  - Conteúdo: Hub / Cultos / Campanhas (Campanhas ativa)
  - Em Cristo: Dashboard / Calendário / Inteligência / Conteúdo / Templates / Plano
"""
import re
from pathlib import Path

ROOT = Path("conteudo/maio")

def build_sidebar(sub_active):
    """sub_active: dashboard, calendario, inteligencia, conteudo, templates, plano"""
    acts = {k: "" for k in ["dashboard", "calendario", "inteligencia", "conteudo", "templates", "plano"]}
    if sub_active in acts:
        acts[sub_active] = ' class="active"'
    return f'''<nav class="sub-menu">
  <div class="menu-inner">
    <div class="sidebar-brand">
      <div class="logo-mini"><img src="/img/logo-oficial.png" alt="Castelo Forte"></div>
      <div class="brand-text">
        Castelo Forte
        <small>Jurerê · SC</small>
      </div>
    </div>
    <span class="sub-label">Con<em>teúdo</em></span>
    <ul>
      <li><a href="/conteudo/">Hub</a></li>
      <li><a href="/conteudo/cultos/">Cultos</a></li>
      <li><a href="/conteudo/campanhas/" class="active">Campanhas</a></li>
    </ul>
    <span class="sub-label" style="margin-top:8px">Em <em>Cristo</em></span>
    <ul>
      <li><a href="/conteudo/maio/"{acts["dashboard"]}>Dashboard</a></li>
      <li><a href="/conteudo/maio/calendario/"{acts["calendario"]}>Calendário</a></li>
      <li><a href="/conteudo/maio/inteligencia/"{acts["inteligencia"]}>Inteligência</a></li>
      <li><a href="/conteudo/maio/conteudo/"{acts["conteudo"]}>Conteúdo</a></li>
      <li><a href="/conteudo/maio/templates/"{acts["templates"]}>Templates</a></li>
      <li><a href="/conteudo/maio/plano/"{acts["plano"]}>Plano</a></li>
    </ul>
  </div>
</nav>'''

def detect_sub(path):
    rel = str(path).split("conteudo/maio/", 1)[-1] if "conteudo/maio/" in str(path) else str(path)
    if rel.startswith("inteligencia"): return "inteligencia"
    if rel.startswith("templates"): return "templates"
    if rel.startswith("conteudo"): return "conteudo"
    if rel.startswith("calendario"): return "calendario"
    if rel.startswith("plano"): return "plano"
    return "dashboard"

# Regex pra substituir sub-menu existente
SUB_RE = re.compile(r'<nav class="sub-menu">.*?</nav>', re.DOTALL)
# Regex pra remover main-menu (que não usamos mais — sidebar unificada engole tudo)
MAIN_RE = re.compile(r'<nav class="main-menu">.*?</nav>\s*', re.DOTALL)

count_sub = 0
count_main = 0
for path in ROOT.rglob("*.html"):
    html = path.read_text()
    if 'class="sub-menu"' not in html:
        continue
    orig = html
    sub_active = detect_sub(path)
    new_sidebar = build_sidebar(sub_active)
    html = SUB_RE.sub(new_sidebar, html, count=1)
    if html != orig:
        count_sub += 1
    # Remove main-menu (topbar) — não usamos mais
    new_html, n = MAIN_RE.subn('', html, count=1)
    if n > 0:
        html = new_html
        count_main += 1
    if html != orig:
        path.write_text(html)

print(f"{count_sub} sidebars unificadas, {count_main} topbars removidas")
