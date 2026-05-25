-- Sistema de Aprovacao de Conteudo
-- Schema inicial: clientes, posts, decisoes
-- Tabelas com prefixo aprovacao_ para nao conflitar

create extension if not exists pgcrypto;

create table if not exists aprovacao_clientes (
  slug text primary key,
  nome text not null,
  token_aprovador text unique not null,
  base_url text,
  created_at timestamptz default now()
);

create table if not exists aprovacao_posts (
  id uuid primary key default gen_random_uuid(),
  cliente_slug text not null references aprovacao_clientes(slug) on delete cascade,
  identificador text not null,
  titulo text not null,
  tipo text not null,
  imagens jsonb not null default '[]'::jsonb,
  legenda text,
  ordem int default 0,
  created_at timestamptz default now(),
  unique (cliente_slug, identificador)
);

create table if not exists aprovacao_decisoes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references aprovacao_posts(id) on delete cascade,
  status text not null check (status in ('aprovado','reprovado')),
  observacao text,
  corrigido boolean default false,
  erro_correcao text,
  decidido_em timestamptz default now(),
  unique (post_id)
);

create index if not exists idx_posts_cliente_ordem on aprovacao_posts(cliente_slug, ordem);
create index if not exists idx_decisoes_status on aprovacao_decisoes(status, corrigido);

-- RLS
alter table aprovacao_clientes enable row level security;
alter table aprovacao_posts enable row level security;
alter table aprovacao_decisoes enable row level security;

-- limpa policies antigas (idempotente)
drop policy if exists "clientes_select_by_token" on aprovacao_clientes;
drop policy if exists "posts_select_by_token" on aprovacao_posts;
drop policy if exists "decisoes_select_by_token" on aprovacao_decisoes;
drop policy if exists "decisoes_insert_by_token" on aprovacao_decisoes;
drop policy if exists "decisoes_update_by_token" on aprovacao_decisoes;

-- clientes: anon pode SELECT pra validar token (mas RPC publica e melhor pra producao)
create policy "clientes_select_anon"
  on aprovacao_clientes
  for select
  to anon
  using (true);

-- posts: anon pode SELECT (UI lista) - protecao real e via app passando token e filtrando
create policy "posts_select_anon"
  on aprovacao_posts
  for select
  to anon
  using (true);

-- decisoes: anon pode SELECT/INSERT/UPDATE livre. Protecao via RPC abaixo
create policy "decisoes_select_anon"
  on aprovacao_decisoes
  for select
  to anon
  using (true);

-- RPC autenticada por token (UNICO write path para anon)
create or replace function aprovacao_registrar_decisao(
  p_token text,
  p_cliente_slug text,
  p_post_id uuid,
  p_status text,
  p_observacao text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token_ok boolean;
  v_decisao_id uuid;
begin
  -- valida token bate com cliente
  select exists(
    select 1 from aprovacao_clientes
    where slug = p_cliente_slug and token_aprovador = p_token
  ) into v_token_ok;

  if not v_token_ok then
    raise exception 'token invalido para cliente %', p_cliente_slug;
  end if;

  -- valida post pertence ao cliente
  if not exists(
    select 1 from aprovacao_posts
    where id = p_post_id and cliente_slug = p_cliente_slug
  ) then
    raise exception 'post nao pertence ao cliente';
  end if;

  -- valida status
  if p_status not in ('aprovado','reprovado') then
    raise exception 'status invalido: %', p_status;
  end if;

  -- upsert
  insert into aprovacao_decisoes (post_id, status, observacao, corrigido, decidido_em)
  values (p_post_id, p_status, nullif(p_observacao,''), false, now())
  on conflict (post_id) do update
  set status = excluded.status,
      observacao = excluded.observacao,
      corrigido = false,
      decidido_em = now()
  returning id into v_decisao_id;

  return v_decisao_id;
end;
$$;

grant execute on function aprovacao_registrar_decisao(text,text,uuid,text,text) to anon;
