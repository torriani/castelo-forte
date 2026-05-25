-- ============================================
-- Carrossel Dashboard — Schema v1.0
-- Prefixo: carrossel_
-- ============================================

-- 1. Templates de slide
create table if not exists carrossel_templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nome text not null,
  familia text not null check (familia in ('twitter', 'editorial')),
  descricao text,

  -- Visual base
  background text default '#FFFFFF',
  proporcao text default '4:5',
  dark_mode boolean default false,

  -- Zonas configuráveis (JSONB para flexibilidade)
  -- Cada zona: { ativo: true, posicao: "top"|"center"|"bottom", config: {...} }
  zona_header jsonb,       -- avatar + nome + handle + verificado
  zona_header_bar jsonb,   -- barra editorial: marca esq + linha + categoria dir
  zona_titulo jsonb,       -- título principal (fonte, tamanho, cor, alinhamento)
  zona_subtitulo jsonb,    -- subtítulo / body secundário
  zona_body jsonb,         -- corpo de texto (parágrafos, bold parcial)
  zona_imagem jsonb,       -- imagem(ns): posição, formato, quantidade, overlay
  zona_footer_bar jsonb,   -- rodapé editorial: ícone + marca

  -- Ordenação
  ordem int default 0,
  ativo boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Perfis de marca (brand profiles)
create table if not exists carrossel_brands (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  handle text not null,
  avatar_url text,
  verificado boolean default false,

  -- Campos editorial
  marca_nome text,      -- "F2L", "Blank", "CSM"
  marca_icone_url text,  -- URL do ícone da marca
  tagline text,          -- "FAMÍLIA, LUCRO E LIBERDADE"
  categoria text,        -- "IA FIRST", "SOCIAL MEDIA"

  -- Cores
  cor_primaria text default '#000000',
  cor_secundaria text default '#666666',
  cor_accent text default '#d4b995',

  ativo boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. RLS
alter table carrossel_templates enable row level security;
alter table carrossel_brands enable row level security;

-- Policies: leitura pública, escrita via service_role
create policy "carrossel_templates_read" on carrossel_templates
  for select using (true);

create policy "carrossel_templates_write" on carrossel_templates
  for all using (auth.role() = 'service_role');

create policy "carrossel_brands_read" on carrossel_brands
  for select using (true);

create policy "carrossel_brands_write" on carrossel_brands
  for all using (auth.role() = 'service_role');

-- ============================================
-- SEED: 6 Templates iniciais
-- ============================================

-- FAMÍLIA TWITTER

insert into carrossel_templates (slug, nome, familia, descricao, background, dark_mode, ordem,
  zona_header, zona_titulo, zona_subtitulo, zona_imagem,
  zona_header_bar, zona_body, zona_footer_bar)
values
(
  'twitter-branco',
  'Twitter Branco',
  'twitter',
  'Tweet style fundo branco. Avatar + nome + título bold + subtítulo + imagem opcional.',
  '#FFFFFF', false, 1,
  '{"ativo": true, "tipo": "avatar", "posicao": "top-left"}'::jsonb,
  '{"ativo": true, "fonte": "Inter", "peso": "bold", "tamanho": 28, "cor": "#0f1419", "alinhamento": "left"}'::jsonb,
  '{"ativo": true, "fonte": "Inter", "peso": "regular", "tamanho": 18, "cor": "#536471", "alinhamento": "left"}'::jsonb,
  '{"ativo": true, "posicao": "bottom", "formato": "rounded-lg", "quantidade": 1, "overlay": false}'::jsonb,
  null, null, null
),
(
  'twitter-black',
  'Twitter Black',
  'twitter',
  'Tweet style fundo preto. Avatar + nome + título bold branco + subtítulo + imagem opcional.',
  '#000000', true, 2,
  '{"ativo": true, "tipo": "avatar", "posicao": "top-left"}'::jsonb,
  '{"ativo": true, "fonte": "Inter", "peso": "bold", "tamanho": 28, "cor": "#FFFFFF", "alinhamento": "left"}'::jsonb,
  '{"ativo": true, "fonte": "Inter", "peso": "regular", "tamanho": 18, "cor": "#71767b", "alinhamento": "left"}'::jsonb,
  '{"ativo": true, "posicao": "bottom", "formato": "rounded-lg", "quantidade": 1, "overlay": false}'::jsonb,
  null, null, null
),

-- FAMÍLIA EDITORIAL

(
  'post-imagem-capa',
  'Editorial Capa',
  'editorial',
  'Foto fullscreen + gradient escuro + marca top-left + título serifa grande bottom center + subtítulo.',
  '#000000', true, 3,
  null,
  '{"ativo": true, "fonte": "PT Serif", "peso": "bold", "tamanho": 36, "cor": "#FFFFFF", "alinhamento": "center", "posicao": "bottom"}'::jsonb,
  '{"ativo": true, "fonte": "Inter", "peso": "regular", "tamanho": 16, "cor": "#CCCCCC", "alinhamento": "center", "posicao": "bottom"}'::jsonb,
  '{"ativo": true, "posicao": "fullscreen", "formato": "none", "quantidade": 1, "overlay": true, "overlay_gradient": "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8) 100%)"}'::jsonb,
  '{"ativo": true, "marca_posicao": "top-left", "categoria_posicao": null}'::jsonb,
  null,
  null
),
(
  'f2l-interna-simples',
  'Editorial Interna Simples',
  'editorial',
  'Header bar (marca + categoria) + texto centro + footer com tagline. Sem imagem.',
  '#FFFFFF', false, 4,
  null,
  '{"ativo": true, "fonte": "PT Serif", "peso": "bold", "tamanho": 28, "cor": "#1a1a1a", "alinhamento": "left", "numerado": true}'::jsonb,
  null,
  null,
  '{"ativo": true, "marca_posicao": "top-left", "categoria_posicao": "top-right", "linha_separadora": true}'::jsonb,
  '{"ativo": true, "fonte": "Inter", "peso": "regular", "tamanho": 18, "cor": "#444444", "alinhamento": "left", "bold_parcial": true}'::jsonb,
  '{"ativo": true, "icone_posicao": "bottom-left", "marca_posicao": "bottom-right"}'::jsonb
),
(
  'post-imagem-interna-foto',
  'Editorial Interna com Foto',
  'editorial',
  'Header bar + 1 ou 2 fotos lado a lado (rounded) + título serifa + body + footer bar.',
  '#FFFFFF', false, 5,
  null,
  '{"ativo": true, "fonte": "PT Serif", "peso": "bold", "tamanho": 26, "cor": "#1a1a1a", "alinhamento": "left"}'::jsonb,
  null,
  '{"ativo": true, "posicao": "top", "formato": "rounded-lg", "quantidade": 2, "layout_fotos": "side-by-side", "overlay": false}'::jsonb,
  '{"ativo": true, "marca_posicao": "top-left", "categoria_posicao": "top-right", "linha_separadora": true}'::jsonb,
  '{"ativo": true, "fonte": "Inter", "peso": "regular", "tamanho": 16, "cor": "#444444", "alinhamento": "left", "bold_parcial": true}'::jsonb,
  '{"ativo": true, "icone_posicao": "bottom-left", "marca_posicao": "bottom-right"}'::jsonb
),
(
  'post-imagem-interna-texto',
  'Editorial Interna Texto',
  'editorial',
  'Header bar + título serifa numerado + body parágrafos (regular + bold) + footer bar. Sem imagem.',
  '#FFFFFF', false, 6,
  null,
  '{"ativo": true, "fonte": "PT Serif", "peso": "bold", "tamanho": 28, "cor": "#1a1a1a", "alinhamento": "left", "numerado": true}'::jsonb,
  null,
  null,
  '{"ativo": true, "marca_posicao": "top-left", "categoria_posicao": "top-right", "linha_separadora": true}'::jsonb,
  '{"ativo": true, "fonte": "Inter", "peso": "regular", "tamanho": 18, "cor": "#444444", "alinhamento": "left", "bold_parcial": true}'::jsonb,
  '{"ativo": true, "icone_posicao": "bottom-left", "marca_posicao": "bottom-right"}'::jsonb
);

-- SEED: Brand padrão (Castelo Forte)
insert into carrossel_brands (nome, handle, verificado, marca_nome, tagline, categoria)
values (
  'operador da Castelo Forte',
  'castelofortemandaqui',
  true,
  'F2L',
  'FAMÍLIA, LUCRO E LIBERDADE',
  'IA FIRST'
);
