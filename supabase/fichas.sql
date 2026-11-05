-- Fichas do planejamento gratuito (página /planejamento/montar). Só a administradora lê e grava.
-- Rode uma vez no Supabase: SQL Editor > New query > colar > Run.
create table if not exists public.fichas_planejamento (
  id uuid primary key,
  pedido_id uuid references public.pedidos_planejamento on delete set null,
  email text not null default '' check (char_length(email) <= 200),
  dados jsonb not null check (pg_column_size(dados) <= 100000),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
alter table public.fichas_planejamento enable row level security;
create policy "administradora cuida das fichas" on public.fichas_planejamento for all to authenticated
  using ((auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com');
grant select, insert, update, delete on public.fichas_planejamento to authenticated;
