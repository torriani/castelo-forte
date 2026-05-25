#!/usr/bin/env python3
"""Migra TODAS as páginas do /briefing/briefingmaio/ pro padrão novo /conteudo/maio/.
Preserva conteúdo (HTML do <body> ou <main>), descarta CSS antigo, aplica header/menu/footer oficial.
Caminho do CSS shared: /conteudo/maio/_shared.css
"""
import re
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).parent
SRC = ROOT / "briefing" / "briefingmaio"
DST = ROOT / "conteudo" / "maio"

# Mapeamento de paginas: src_relative -> (dst_path, page_title, page_subtitle, parent_label, parent_url)
PAGES = {
    "index.html": (
        "templates/index.html",
        "Templates",
        "9 versões testadas · Casa de Isabel · 21 frases · Capa Padrão A",
        None, None
    ),
    "casa-isabel/index.html": (
        "templates/casa-isabel/index.html",
        "Casa de <em>Isabel</em>",
        "Frases avulsas + carrosséis no estilo V-D",
        "Templates", "/conteudo/maio/templates/"
    ),
    "cta-finais/index.html": (
        "templates/cta-finais/index.html",
        "CTA <em>Finais</em>",
        "5 opções de chamada pra ação aprovadas",
        "Templates", "/conteudo/maio/templates/"
    ),
    "plano/index.html": None,  # Já migrado em /conteudo/maio/plano/

    # Inteligência hub
    "inteligencia/index.html": (
        "inteligencia/hub-pesquisa/index.html",
        "Hub de <em>Pesquisa</em>",
        "Atalhos para todos os relatórios da inteligência competitiva",
        "Inteligência", "/conteudo/maio/inteligencia/"
    ),

    # Relatórios principais
    "inteligencia/RELATORIO-V3-INTELIGENCIA-REAL.html": (
        "inteligencia/relatorio-v3/index.html",
        "Relatório <em>V3</em> · Inteligência Real",
        "Análise final com OCR de capas · 480 posts · 8 igrejas",
        "Inteligência", "/conteudo/maio/inteligencia/"
    ),
    "inteligencia/RELATORIO-V2-FRASES-REPLICAVEIS.html": (
        "inteligencia/frases-replicaveis/index.html",
        "Frases <em>Replicáveis</em>",
        "Top 30 frases prontas · banco V2",
        "Inteligência", "/conteudo/maio/inteligencia/"
    ),
    "inteligencia/RELATORIO-CONSOLIDADO.html": (
        "inteligencia/relatorio-consolidado/index.html",
        "Relatório <em>Consolidado</em>",
        "Visão estratégica V1 · descoberta-mãe e padrões",
        "Inteligência", "/conteudo/maio/inteligencia/"
    ),
    "inteligencia/PLAYBOOK-90-DIAS.html": (
        "inteligencia/playbook-90-dias/index.html",
        "Playbook <em>90 Dias</em>",
        "Como Castelo Forte vai escalar com o Código Maranata",
        "Inteligência", "/conteudo/maio/inteligencia/"
    ),
    "inteligencia/O-QUE-PEGAR-DE-CADA-IGREJA.html": (
        "inteligencia/o-que-pegar/index.html",
        "O Que <em>Pegar</em> de Cada Igreja",
        "Guia perfil-a-perfil clicável · 8 igrejas + Top 30",
        "Inteligência", "/conteudo/maio/inteligencia/"
    ),
    "inteligencia/painel-original.html": (
        "inteligencia/painel-visual/index.html",
        "Painel <em>Visual</em>",
        "480 capas com OCR · galeria completa por igreja",
        "Inteligência", "/conteudo/maio/inteligencia/"
    ),
    "inteligencia/dashboard-original.html": (
        "inteligencia/dashboard-analise/index.html",
        "Dashboard de <em>Análise</em>",
        "Top capas · palavras-tag · versículos · padrões",
        "Inteligência", "/conteudo/maio/inteligencia/"
    ),

    # Relatórios técnicos (subseção)
    "inteligencia/relatorios/01-ranking-perfis.html": (
        "inteligencia/relatorios/01-ranking-perfis/index.html",
        "01 · Ranking de <em>Perfis</em>",
        "35 igrejas analisadas por engagement rate", "Relatórios técnicos", "/conteudo/maio/inteligencia/hub-pesquisa/"
    ),
    "inteligencia/relatorios/02-top-posts-engajamento.html": (
        "inteligencia/relatorios/02-top-posts-engajamento/index.html",
        "02 · Top Posts por <em>Engajamento</em>", "Posts ranqueados por likes + comments",
        "Relatórios técnicos", "/conteudo/maio/inteligencia/hub-pesquisa/"
    ),
    "inteligencia/relatorios/03-top-reels-views.html": (
        "inteligencia/relatorios/03-top-reels-views/index.html",
        "03 · Top Reels por <em>Views</em>", "Reels ordenados por visualizações",
        "Relatórios técnicos", "/conteudo/maio/inteligencia/hub-pesquisa/"
    ),
    "inteligencia/relatorios/04-top-hooks-eng-absoluto.html": (
        "inteligencia/relatorios/04-top-hooks-eng-absoluto/index.html",
        "04 · Top Hooks <em>Engajamento</em>", "Primeira linha das captions vencedoras",
        "Relatórios técnicos", "/conteudo/maio/inteligencia/hub-pesquisa/"
    ),
    "inteligencia/relatorios/05-top-hooks-rate.html": (
        "inteligencia/relatorios/05-top-hooks-rate/index.html",
        "05 · Top Hooks por <em>Rate</em>", "Hooks ordenados por % sobre seguidores",
        "Relatórios técnicos", "/conteudo/maio/inteligencia/hub-pesquisa/"
    ),
    "inteligencia/relatorios/06-posts-efesios.html": (
        "inteligencia/relatorios/06-posts-efesios/index.html",
        "06 · Posts sobre <em>Efésios</em> ⭐",
        "Todos os posts que citam Efésios — gap descoberto",
        "Relatórios técnicos", "/conteudo/maio/inteligencia/hub-pesquisa/"
    ),
    "inteligencia/relatorios/07-posts-versiculos.html": (
        "inteligencia/relatorios/07-posts-versiculos/index.html",
        "07 · Posts com <em>Versículos</em>", "Top 30 versículos citados nas 8 igrejas",
        "Relatórios técnicos", "/conteudo/maio/inteligencia/hub-pesquisa/"
    ),
    "inteligencia/relatorios/08-replicaveis-top-eng.html": (
        "inteligencia/relatorios/08-replicaveis-top-eng/index.html",
        "08 · Replicáveis <em>Top Eng</em>", "Top engajamento, só posts replicáveis",
        "Relatórios técnicos", "/conteudo/maio/inteligencia/hub-pesquisa/"
    ),
    "inteligencia/relatorios/09-replicaveis-top-rate.html": (
        "inteligencia/relatorios/09-replicaveis-top-rate/index.html",
        "09 · Replicáveis <em>Top Rate</em>", "Top rate %, só posts replicáveis",
        "Relatórios técnicos", "/conteudo/maio/inteligencia/hub-pesquisa/"
    ),
    "inteligencia/relatorios/10-banco-tematico.html": (
        "inteligencia/relatorios/10-banco-tematico/index.html",
        "10 · Banco <em>Temático</em>", "486 posts agrupados em 9 temas teológicos",
        "Relatórios técnicos", "/conteudo/maio/inteligencia/hub-pesquisa/"
    ),
}

# Menu único centralizado
MENU_TEMPLATE = """<nav class="main-menu">
  <div class="menu-inner">
    <ul>
      <li><a href="/conteudo/maio/"{a_dashboard}>Dashboard</a></li>
      <li><a href="/conteudo/maio/calendario/"{a_calendario}>Calendário</a></li>
      <li><a href="/conteudo/maio/inteligencia/"{a_inteligencia}>Inteligência</a></li>
      <li><a href="/conteudo/maio/conteudo/"{a_conteudo}>Conteúdo</a></li>
      <li><a href="/conteudo/maio/templates/"{a_templates}>Templates</a></li>
      <li><a href="/conteudo/maio/plano/"{a_plano}>Plano</a></li>
    </ul>
  </div>
</nav>"""

def build_menu(active_section):
    actives = {
        "dashboard": "", "calendario": "", "inteligencia": "",
        "conteudo": "", "templates": "", "plano": "",
    }
    if active_section in actives:
        actives[active_section] = ' class="active"'
    return MENU_TEMPLATE.format(
        a_dashboard=actives["dashboard"],
        a_calendario=actives["calendario"],
        a_inteligencia=actives["inteligencia"],
        a_conteudo=actives["conteudo"],
        a_templates=actives["templates"],
        a_plano=actives["plano"],
    )

def detect_section(dst_relative):
    """Retorna qual menu deve ficar ativo."""
    if dst_relative.startswith("inteligencia"): return "inteligencia"
    if dst_relative.startswith("templates"): return "templates"
    if dst_relative.startswith("conteudo"): return "conteudo"
    if dst_relative.startswith("calendario"): return "calendario"
    if dst_relative.startswith("plano"): return "plano"
    return "dashboard"

def extract_body(html):
    """Extrai conteúdo do <body>, removendo <header>, <nav>, <footer>, <style> antigos."""
    # Pega só o body
    m = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
    if not m: return html
    body = m.group(1)
    # Remove headers antigos
    body = re.sub(r'<header\b[^>]*>.*?</header>', '', body, flags=re.DOTALL | re.IGNORECASE)
    # Remove navs antigos
    body = re.sub(r'<nav\b[^>]*>.*?</nav>', '', body, flags=re.DOTALL | re.IGNORECASE)
    # Remove footers antigos
    body = re.sub(r'<footer\b[^>]*>.*?</footer>', '', body, flags=re.DOTALL | re.IGNORECASE)
    return body.strip()

def extract_styles(html):
    """Extrai blocos <style> do head/body originais pra preservar estilos da página."""
    styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL | re.IGNORECASE)
    return "\n".join(styles).strip()

def fix_image_paths(body, src_relative):
    """Ajusta paths de imagens relativas baseado na nova localização."""
    # Conta níveis de profundidade do src antigo vs novo pra resolver ../
    # Estratégia simples: troca todas as referências ../../img/ por /img/
    body = re.sub(r'(src|href)="(\.\.\/)+img/', r'\1="/img/', body)
    body = re.sub(r'(src|href)="img/', r'\1="/img/', body)
    return body

def fix_internal_links(body):
    """Atualiza links internos das páginas antigas pros novos endereços."""
    replacements = {
        # Links do hub antigo
        'href="/briefing/briefingmaio/"': 'href="/conteudo/maio/templates/"',
        'href="/briefing/briefingmaio/inteligencia/"': 'href="/conteudo/maio/inteligencia/"',
        'href="/briefing/briefingmaio/casa-isabel/"': 'href="/conteudo/maio/templates/casa-isabel/"',
        'href="/briefing/briefingmaio/cta-finais/"': 'href="/conteudo/maio/templates/cta-finais/"',
        'href="/briefing/briefingmaio/plano/"': 'href="/conteudo/maio/plano/"',
        # Links relativos das relatorios sub
        'href="../"': 'href="/conteudo/maio/inteligencia/hub-pesquisa/"',
        'href="inteligencia/"': 'href="/conteudo/maio/inteligencia/"',
        'href="casa-isabel/"': 'href="/conteudo/maio/templates/casa-isabel/"',
        'href="cta-finais/"': 'href="/conteudo/maio/templates/cta-finais/"',
        'href="plano/"': 'href="/conteudo/maio/plano/"',
    }
    for old, new in replacements.items():
        body = body.replace(old, new)
    # Relatórios técnicos: links cross-relatorio
    body = re.sub(
        r'href="(\d{2})-([\w-]+)\.html"',
        r'href="/conteudo/maio/inteligencia/relatorios/\1-\2/"',
        body
    )
    return body

PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{plain_title} · Castelo Forte · Em Cristo</title>
<link rel="icon" href="/img/logo-castelo-forte.png" type="image/png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Archivo+Black&family=Playfair+Display:ital,wght@0,400;1,400;1,500&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/conteudo/maio/_shared.css">
<style>
/* ===== Estilos específicos preservados da página original ===== */
{custom_styles}

/* ===== Ajustes mínimos pra integração com padrão novo ===== */
.migrated-content {{ font-family: 'Inter', sans-serif; color: var(--midnight); }}
.migrated-content table {{ background: #fff; }}
.migrated-content img {{ max-width: 100%; height: auto; }}
.breadcrumb {{
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 12px;
}}
.breadcrumb a {{ color: var(--glory); text-decoration: none; }}
.breadcrumb a:hover {{ text-decoration: underline; }}
.breadcrumb .sep {{ margin: 0 8px; opacity: .4; }}
</style>
</head>
<body>

<header class="brand-header">
  <div class="logo-wrap">
    <div class="logo-oficial"><img src="/img/logo-oficial.png" alt="Castelo Forte"></div>
  </div>
  <div class="title-block">
    <h1>{page_title}</h1>
    <div class="sub">{page_subtitle}</div>
  </div>
</header>

{menu}

<main class="page">

{breadcrumb}

<div class="migrated-content">
{body}
</div>

</main>

<footer>
  <strong>Castelo Forte</strong> · Igreja em Jurerê · Pastor Israel Anijar &nbsp;·&nbsp; Em Cristo · 07.06 · 09H
</footer>

</body>
</html>
"""

def strip_html_tags(s):
    return re.sub(r'<[^>]+>', '', s)

def build_breadcrumb(parent_label, parent_url, page_title_plain):
    if not parent_label:
        return ""
    return f'<div class="breadcrumb"><a href="/conteudo/maio/">Dashboard</a><span class="sep">›</span><a href="{parent_url}">{parent_label}</a><span class="sep">›</span>{page_title_plain}</div>'

def migrate_page(src_rel, target):
    if target is None:
        return None
    dst_rel, page_title, page_subtitle, parent_label, parent_url = target
    src_path = SRC / src_rel
    dst_path = DST / dst_rel
    dst_path.parent.mkdir(parents=True, exist_ok=True)

    html = src_path.read_text()
    body = extract_body(html)
    body = fix_image_paths(body, src_rel)
    body = fix_internal_links(body)
    custom_styles = extract_styles(html)

    section = detect_section(dst_rel)
    menu = build_menu(section)
    plain_title = strip_html_tags(page_title)
    breadcrumb = build_breadcrumb(parent_label, parent_url, plain_title)

    out = PAGE_TEMPLATE.format(
        plain_title=plain_title,
        custom_styles=custom_styles,
        page_title=page_title,
        page_subtitle=page_subtitle,
        menu=menu,
        breadcrumb=breadcrumb,
        body=body,
    )
    dst_path.write_text(out)
    return f"✓ {src_rel} → /conteudo/maio/{dst_rel}"

# Executa migração
print("=== MIGRAÇÃO INICIADA ===\n")
results = []
for src, target in PAGES.items():
    res = migrate_page(src, target)
    if res: results.append(res)
    else: print(f"⊘ pulado: {src}")
for r in results:
    print(r)
print(f"\n=== {len(results)} páginas migradas ===")
