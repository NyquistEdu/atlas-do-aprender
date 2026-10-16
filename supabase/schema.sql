-- Atlas do Aprender: tabelas, regras de acesso (RLS) e restrições de integridade.
-- Rode este arquivo uma vez no Supabase: SQL Editor > New query > colar > Run.
-- Cada pessoa logada só enxerga e altera os próprios registros.

create table if not exists public.criancas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  nome text not null check (char_length(trim(nome)) > 0 and char_length(nome) <= 50),
  criado_em timestamptz not null default now(),
  unique (user_id, nome)
);

create table if not exists public.progresso (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  crianca text not null check (char_length(crianca) <= 50),
  chave text not null check (char_length(chave) <= 100),
  feito_em date not null default current_date,
  primary key (user_id, crianca, chave)
);

create table if not exists public.diario (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  data date not null default current_date,
  crianca text not null check (char_length(crianca) <= 50),
  area text not null check (char_length(area) <= 20),
  tipo text not null check (char_length(tipo) <= 50),
  minutos integer not null default 0 check (minutos >= 0 and minutos <= 1440),
  titulo text not null check (char_length(trim(titulo)) > 0 and char_length(titulo) <= 150),
  o_que text not null default '' check (char_length(o_que) <= 2000),
  descobertas text not null default '' check (char_length(descobertas) <= 2000),
  envolvimento integer not null default 4 check (envolvimento between 1 and 5),
  proximo text not null default '' check (char_length(proximo) <= 300),
  criado_em timestamptz not null default now()
);

-- Ativação do Row Level Security (RLS)
alter table public.criancas enable row level security;
alter table public.progresso enable row level security;
alter table public.diario enable row level security;

-- Políticas de segurança
create policy "criancas do proprio usuario" on public.criancas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "progresso do proprio usuario" on public.progresso
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "diario do proprio usuario" on public.diario
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
