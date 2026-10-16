-- Atlas do Aprender: tabelas e regras de acesso.
-- Rode este arquivo uma vez no Supabase: SQL Editor > New query > colar > Run.
-- Cada pessoa logada só enxerga e altera os próprios registros.

create table if not exists public.criancas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  nome text not null,
  criado_em timestamptz not null default now(),
  unique (user_id, nome)
);

create table if not exists public.progresso (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  crianca text not null,
  chave text not null,
  feito_em date not null default current_date,
  primary key (user_id, crianca, chave)
);

create table if not exists public.diario (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  data date not null default current_date,
  crianca text not null,
  area text not null,
  tipo text not null,
  minutos integer not null default 0,
  titulo text not null,
  o_que text not null default '',
  descobertas text not null default '',
  envolvimento integer not null default 4 check (envolvimento between 1 and 5),
  proximo text not null default '',
  criado_em timestamptz not null default now()
);

alter table public.criancas enable row level security;
alter table public.progresso enable row level security;
alter table public.diario enable row level security;

create policy "criancas do proprio usuario" on public.criancas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "progresso do proprio usuario" on public.progresso
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "diario do proprio usuario" on public.diario
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
