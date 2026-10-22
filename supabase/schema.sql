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

-- Pedidos de planejamento gratuito (formulário público em /planejamento).
-- Qualquer visitante pode enviar; só a administradora lê e atualiza.
create table if not exists public.pedidos_planejamento (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  nome text not null check (char_length(trim(nome)) > 0 and char_length(nome) <= 120),
  email text not null check (char_length(email) <= 200 and email like '%@%'),
  whatsapp text not null default '' check (char_length(whatsapp) <= 40),
  cidade text not null default '' check (char_length(cidade) <= 120),
  familia jsonb not null default '{}'::jsonb check (pg_column_size(familia) <= 8000),
  criancas jsonb not null default '[]'::jsonb check (jsonb_typeof(criancas) = 'array' and pg_column_size(criancas) <= 16000),
  disponibilidade jsonb not null default '{}'::jsonb check (pg_column_size(disponibilidade) <= 4000),
  observacoes text not null default '' check (char_length(observacoes) <= 2000),
  consentimento boolean not null check (consentimento),
  status text not null default 'novo' check (status in ('novo', 'contatado', 'agendado', 'concluido', 'arquivado'))
);

alter table public.pedidos_planejamento enable row level security;

create policy "qualquer pessoa envia pedido" on public.pedidos_planejamento
  for insert to anon, authenticated with check (status = 'novo');

create policy "administradora le pedidos" on public.pedidos_planejamento
  for select to authenticated using ((auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com');

create policy "administradora atualiza pedidos" on public.pedidos_planejamento
  for update to authenticated using ((auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com');

-- ============================================================
-- Contagem anônima (sem cookies): totais por dia, sem identificar ninguém.
-- O site chama public.contar(evento, detalhe, origem); ninguém lê a tabela pela API.
-- ============================================================
create table if not exists public.contagens (
  dia date not null,
  evento text not null,
  detalhe text not null default '',
  origem text not null default '',
  total integer not null default 0,
  primary key (dia, evento, detalhe, origem)
);
alter table public.contagens enable row level security;

create or replace function public.contar(p_evento text, p_detalhe text default '', p_origem text default '')
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.contagens (dia, evento, detalhe, origem, total)
  select (now() at time zone 'America/Fortaleza')::date, p_evento, left(coalesce(p_detalhe, ''), 80), left(coalesce(p_origem, ''), 80), 1
  where p_evento in ('visita','cadastro','pedido_planejamento','viu_apostila','comprar','afiliado','baixou',
                     'convite_visto','abriu_entrar','pediu_link','entrou','registrou_atividade','pedido_apostila')
  on conflict (dia, evento, detalhe, origem) do update set total = public.contagens.total + 1;
$$;
revoke all on function public.contar(text, text, text) from public;
grant execute on function public.contar(text, text, text) to anon, authenticated;

-- Pedidos de apostila sob medida (formulário em /apostilas). Também chegam por e-mail.
create table if not exists public.pedidos_apostila (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  nome text not null check (char_length(trim(nome)) > 0 and char_length(nome) <= 120),
  email text not null check (char_length(email) <= 200 and email like '%@%'),
  materia text not null check (char_length(materia) <= 40),
  serie text not null check (char_length(serie) <= 40),
  tema text not null check (char_length(trim(tema)) > 0 and char_length(tema) <= 160),
  detalhes text not null default '' check (char_length(detalhes) <= 1000),
  status text not null default 'novo' check (status in ('novo', 'em_preparo', 'entregue', 'arquivado'))
);
alter table public.pedidos_apostila enable row level security;
create policy "qualquer pessoa pede apostila" on public.pedidos_apostila
  for insert to anon, authenticated with check (status = 'novo');
create policy "administradora le pedidos de apostila" on public.pedidos_apostila
  for select to authenticated using ((auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com');
