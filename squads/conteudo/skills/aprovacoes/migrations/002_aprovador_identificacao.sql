-- v2: identifica quem aprovou (nome + email) ao inves de token
-- mantem retrocompat com decisoes antigas (campos nullable)

alter table aprovacao_decisoes
  add column if not exists nome_aprovador text,
  add column if not exists email_aprovador text;

-- remove restricao de 1 decisao por post (agora pode ter varias por aprovador)
alter table aprovacao_decisoes drop constraint if exists aprovacao_decisoes_post_id_key;

-- garante unicidade post + email_aprovador (1 decisao por par)
create unique index if not exists uq_decisao_post_email
  on aprovacao_decisoes(post_id, coalesce(email_aprovador, ''));

-- RPC nova: sem token, com nome + email
create or replace function aprovacao_registrar_decisao_v2(
  p_cliente_slug text,
  p_post_id uuid,
  p_status text,
  p_observacao text,
  p_nome text,
  p_email text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_decisao_id uuid;
begin
  if p_status not in ('aprovado','reprovado') then
    raise exception 'status invalido: %', p_status;
  end if;

  if coalesce(trim(p_nome),'') = '' or coalesce(trim(p_email),'') = '' then
    raise exception 'nome e email obrigatorios';
  end if;

  if not exists(
    select 1 from aprovacao_posts
    where id = p_post_id and cliente_slug = p_cliente_slug
  ) then
    raise exception 'post nao pertence ao cliente';
  end if;

  insert into aprovacao_decisoes (post_id, status, observacao, corrigido, nome_aprovador, email_aprovador, decidido_em)
  values (p_post_id, p_status, nullif(p_observacao,''), false, p_nome, lower(p_email), now())
  on conflict (post_id, coalesce(email_aprovador, ''))
  do update set
    status = excluded.status,
    observacao = excluded.observacao,
    corrigido = false,
    decidido_em = now()
  returning id into v_decisao_id;

  return v_decisao_id;
end;
$$;

grant execute on function aprovacao_registrar_decisao_v2(text,uuid,text,text,text,text) to anon;
