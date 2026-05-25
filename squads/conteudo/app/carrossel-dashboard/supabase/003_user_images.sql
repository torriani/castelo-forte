-- ============================================
-- CD-04: Upload de Imagens — Migration v3
-- Tabela carrossel_user_images + RLS
-- ============================================

-- 1. Tabela de imagens do usuario
create table if not exists carrossel_user_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  filename text not null,
  original_name text not null,
  storage_path text not null,
  public_url text not null,
  mime_type text not null check (mime_type in ('image/png', 'image/jpeg', 'image/webp')),
  size_bytes integer not null,
  width integer,
  height integer,
  created_at timestamptz default now()
);

-- Indice para busca rapida por usuario
create index if not exists idx_user_images_user_id on carrossel_user_images(user_id);

-- 2. RLS — usuario so acessa suas proprias imagens
alter table carrossel_user_images enable row level security;

create policy "user_images_select_own" on carrossel_user_images
  for select using (auth.uid() = user_id);

create policy "user_images_insert_own" on carrossel_user_images
  for insert with check (auth.uid() = user_id);

create policy "user_images_delete_own" on carrossel_user_images
  for delete using (auth.uid() = user_id);

-- 3. Storage policies adicionais (update para o bucket carrossel-images)
-- O bucket ja existe (criado na migration 002)
-- A policy de insert ja existe, mas vamos adicionar path-based restriction

-- Policy: usuario so pode fazer upload dentro do seu folder (user_id/)
-- Dropar a policy generica anterior se existir
drop policy if exists "carrossel_images_insert" on storage.objects;

create policy "carrossel_images_insert_own_folder" on storage.objects
  for insert with check (
    bucket_id = 'carrossel-images'
    and auth.role() = 'authenticated'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: usuario pode fazer update dos seus proprios arquivos
create policy "carrossel_images_update_own" on storage.objects
  for update using (
    bucket_id = 'carrossel-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
