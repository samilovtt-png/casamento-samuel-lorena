create table public.confirmacoes_casamento (
 id text primary key check (length(id) between 8 and 100),
 criado_em timestamptz not null default now(),
 atualizado_em timestamptz not null default now(),
 nome text not null check (length(nome) between 2 and 120),
 adultos integer not null check (adultos between 0 and 30),
 criancas integer not null check (criancas between 0 and 30),
 pessoas jsonb not null default '[]' check (jsonb_typeof(pessoas) = 'array'),
 mensagem text not null default '' check (length(mensagem)<=1000),
 familia text not null default '' check (length(familia)<=120),
 origem text not null default 'site',
 status text not null default 'confirmado' check (status in ('confirmado','cancelado')),
 hash_conteudo text not null,
 check (adultos+criancas between 1 and 30)
);
alter table public.confirmacoes_casamento enable row level security;
revoke all on public.confirmacoes_casamento from anon, authenticated;
grant select,insert,update on public.confirmacoes_casamento to service_role;
create table public.confirmacoes_limites (chave text not null, hora timestamptz not null default date_trunc('hour',now()), quantidade integer not null default 0, primary key(chave,hora));
alter table public.confirmacoes_limites enable row level security;
revoke all on public.confirmacoes_limites from anon, authenticated;
grant all on public.confirmacoes_limites to service_role;
create function public.confirmacao_reservar_envio(p_chave text) returns boolean language plpgsql security invoker set search_path='' as $$
declare n integer;
begin
 insert into public.confirmacoes_limites(chave,hora,quantidade) values(p_chave,date_trunc('hour',now()),1)
 on conflict(chave,hora) do update set quantidade=public.confirmacoes_limites.quantidade+1
 returning quantidade into n;
 return n<=20;
end; $$;
revoke all on function public.confirmacao_reservar_envio(text) from public,anon,authenticated;
grant execute on function public.confirmacao_reservar_envio(text) to service_role;
