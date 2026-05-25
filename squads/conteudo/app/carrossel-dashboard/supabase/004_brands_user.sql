-- ============================================
-- CD-05: Brand Picker — RLS e ajustes para brands por usuario
-- A coluna user_id ja foi adicionada na migration 002.
-- Esta migration apenas garante que as policies estejam corretas.
-- ============================================

-- Dropar policies antigas caso existam (idempotente)
drop policy if exists "carrossel_brands_select" on carrossel_brands;
drop policy if exists "carrossel_brands_insert" on carrossel_brands;
drop policy if exists "carrossel_brands_update" on carrossel_brands;
drop policy if exists "carrossel_brands_delete" on carrossel_brands;

-- Recriar policies:
-- SELECT: usuario ve seus brands + brands publicos (user_id IS NULL)
create policy "carrossel_brands_select" on carrossel_brands
  for select using (user_id is null or user_id = auth.uid());

-- INSERT: usuario so cria brands vinculados ao seu id
create policy "carrossel_brands_insert" on carrossel_brands
  for insert with check (auth.uid() = user_id);

-- UPDATE: usuario so edita seus proprios brands
create policy "carrossel_brands_update" on carrossel_brands
  for update using (auth.uid() = user_id);

-- DELETE: usuario so deleta seus proprios brands
create policy "carrossel_brands_delete" on carrossel_brands
  for delete using (auth.uid() = user_id);

-- Indice para busca por user_id (performance)
create index if not exists idx_carrossel_brands_user_id
  on carrossel_brands(user_id);
