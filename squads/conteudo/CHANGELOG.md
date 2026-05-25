# Changelog — Squad Conteudo

## [3.2] - 2026-03-30

### Added — Visual Pipeline
- **3 novas tasks:** gerar-imagem-ia.md, criar-template-visual.md, publicar-instagram.md (todas do publishing-manager)
- **3 scripts funcionais:** gerar-imagem-ia.sh (IA via Gemini/OpenRouter), criar-template-visual.sh (preview de templates), publicar-instagram.js (Graph API com dry-run)
- **.env.example** com todas as chaves necessarias (Instagram, imgBB, Gemini, OpenRouter)
- **3 novos comandos** no publishing-manager: *gerar-imagem, *criar-template, *publicar
- **Scope atualizado** do publishing-manager com novas capacidades

### Changed
- config.yaml v3.1 → v3.2 (36 tasks, 14 workflows)
- squad-io.yaml atualizado com comandos visual_pipeline
- publishing-manager.md scope expandido

### Fontes
- Adaptado de opensquads/conteudo/skills/instagram-publisher (publicacao)
- Adaptado de opensquads/conteudo/skills/image-ai-generator (geracao IA)
- Adaptado de opensquads/conteudo/skills/template-designer (templates visuais)
- Padrao SCDS/PRIO de squads/design/agents/nano-banana-generator

## [3.1] - 2026-03-30

### Added
- 3 tasks standalone para agents do ciclo autonomo: suggest-daily.md, monitor-daily.md, track-performance.md
- quality_gates em wf-daily-monitor.yaml (4 gates: Data Completeness, Trend Confidence, Opportunity Integrity, Report Consistency)
- quality_gates em wf-suggest-daily.yaml (4 gates: Data Freshness, Suggestion Grounding, Proportion Compliance, Briefing Completeness)
- executor_profile no config.yaml (hybrid: 3 workers + 11 agents)
- squad-io.yaml (interface AIOX padrao com inputs, outputs, commands, quality gates, dependencies)

### Changed
- config.yaml v3.0 → v3.1 (14 agents, 33 tasks, 14 workflows)
- README.md reescrito para v3.1 (contagens corretas, ciclo autonomo documentado, quality gates, dependencies)

### Fixed
- 3 agents sem tasks standalone (content-suggester, daily-monitor, performance-tracker) agora tem acesso direto

## [3.0] - 2026-03-23

### Added — Ciclo Autonomo Completo
- **4 novos agents:** daily-monitor, content-suggester, publishing-manager, performance-tracker
- **5 novos workflows:** wf-daily-monitor, wf-suggest-daily, wf-publish, wf-analytics-review, wf-daily-cycle
- **2 novas tasks:** extract-template, render-slides
- **8 novos data files:** monitoring-signals, trend-detection-rules, platform-guidelines, hashtag-strategy, caption-templates, benchmark-database, performance-patterns, learned-heuristics
- **5 templates HTML de carrossel:** minimal-dark, editorial-clean, bold-gradient, brand-bar, split-accent
- **Template extractor:** task para extrair templates visuais de carrosseis existentes
- **Slide renderer:** pipeline HTML → Playwright → PNG (1080x1350)
- **Dependencies declaradas:** Playwright MCP, ig-mcp, Apify
- **Learning loop:** performance-tracker atualiza heuristicas automaticamente

### Changed
- config.yaml v2.2 → v3.0 (14 agents, 30 tasks, 14 workflows)
- description atualizada para refletir ciclo autonomo completo

## [2.2] - 2026-03-23

### Added
- `tested: true` flag no config.yaml
- `entry_agent: content-chief` explicito no config.yaml
- `activation-instructions` no content-chief.md (entry agent boot sequence)
- CHANGELOG.md (este arquivo)
- ARCHITECTURE.md (documentacao de tiers, fluxo e dependencias)
- tasks/update-conteudo.md (task de manutencao)
- tasks/delete-conteudo.md (task de remocao)
- Registro de update-conteudo e delete-conteudo no config.yaml

### Fixed
- SC_STRUCT_001 compliance: 9/9 itens estruturais atendidos

## [2.1] - 2026-03

### Added
- wf-multiplicar: pipeline de atomizacao 1 conteudo → 30+ pecas
- tasks/ingest-pillar.md, tasks/create-impact-phrases.md, tasks/atomize-content.md
- content-repurposer agent (Tier 2)
- 9 workflows completos com checkpoints e veto conditions

## [2.0] - 2026-02

### Added
- 10 agents (Tier 0-2) baseados em 3 fontes (Imperador, Blaze, BrandContent)
- 26 tasks cobrindo criacao, planejamento, validacao e pesquisa
- 10 checklists (Oraculo Posts, Oraculo Reels, content-rules, etc.)
- 35 data files (nucleo, expression, frameworks, hooks, CTAs, etc.)
- App Next.js (carrossel-dashboard + image-generator)
- Script transcribe.sh para YouTube → texto

## [1.0] - 2026-01

### Added
- Squad inicial com carousel-creator e content-chief
- Sistema Imperador como fonte primaria
