-- ============================================
-- CD-01: Auth + Multi-tenant — Migration v2
-- Tabela profiles + RLS user_id + Storage bucket
-- ============================================

-- 1. Tabela de perfis (vinculada ao auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nome text,
  avatar_url text,
  plano text default 'free' check (plano in ('free', 'pro', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS para profiles
alter table profiles enable row level security;

create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

-- Trigger: criar profile automaticamente ao signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nome)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Dropar trigger se existir (idempotente)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Adicionar user_id nas tabelas carrossel_*
-- (condicional — so adiciona se nao existir)

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'carrossel_templates' and column_name = 'user_id'
  ) then
    alter table carrossel_templates add column user_id uuid references auth.users(id);
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'carrossel_brands' and column_name = 'user_id'
  ) then
    alter table carrossel_brands add column user_id uuid references auth.users(id);
  end if;
end $$;

-- 3. RLS user_id nas tabelas carrossel_*

-- Dropar policies antigas (leitura publica)
drop policy if exists "carrossel_templates_read" on carrossel_templates;
drop policy if exists "carrossel_templates_write" on carrossel_templates;
drop policy if exists "carrossel_brands_read" on carrossel_brands;
drop policy if exists "carrossel_brands_write" on carrossel_brands;

-- Novas policies: usuario ve seus proprios + templates publicos (user_id IS NULL)
create policy "carrossel_templates_select" on carrossel_templates
  for select using (user_id is null or user_id = auth.uid());

create policy "carrossel_templates_insert" on carrossel_templates
  for insert with check (auth.uid() = user_id);

create policy "carrossel_templates_update" on carrossel_templates
  for update using (auth.uid() = user_id);

create policy "carrossel_templates_delete" on carrossel_templates
  for delete using (auth.uid() = user_id);

create policy "carrossel_brands_select" on carrossel_brands
  for select using (user_id is null or user_id = auth.uid());

create policy "carrossel_brands_insert" on carrossel_brands
  for insert with check (auth.uid() = user_id);

create policy "carrossel_brands_update" on carrossel_brands
  for update using (auth.uid() = user_id);

create policy "carrossel_brands_delete" on carrossel_brands
  for delete using (auth.uid() = user_id);

-- 4. Storage bucket para imagens de carrossel
insert into storage.buckets (id, name, public)
values ('carrossel-images', 'carrossel-images', true)
on conflict (id) do nothing;

-- Policy: usuario autenticado pode fazer upload
create policy "carrossel_images_insert" on storage.objects
  for insert with check (
    bucket_id = 'carrossel-images'
    and auth.role() = 'authenticated'
  );

-- Policy: leitura publica
create policy "carrossel_images_select" on storage.objects
  for select using (bucket_id = 'carrossel-images');

-- Policy: usuario pode deletar seus proprios arquivos
create policy "carrossel_images_delete" on storage.objects
  for delete using (
    bucket_id = 'carrossel-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
