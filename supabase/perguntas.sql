-- "Pergunte à professora" (página /duvidas).
-- Rode este arquivo uma vez no Supabase: SQL Editor > New query > colar > Run.
-- Quem tem conta manda uma pergunta. A administradora responde; se marcar "publicar",
-- a pergunta (com o título que ela escrever) e a resposta viram uma página pública, sem identificar a família.
-- Cada família vê as próprias perguntas e as respostas, publicadas ou não. O público vê só título e resposta das publicadas.

create table if not exists public.perguntas (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  pergunta text not null check (char_length(trim(pergunta)) between 10 and 800),
  ano text not null default '' check (ano in ('', '1', '2', '3', '4', '5')),
  assinatura text not null default '' check (char_length(assinatura) <= 60),
  status text not null default 'nova' check (status in ('nova', 'respondida', 'arquivada')),
  titulo text not null default '' check (char_length(titulo) <= 160),
  resposta text not null default '' check (char_length(resposta) <= 8000),
  publica boolean not null default false,
  respondida_em timestamptz
);
create index if not exists perguntas_publicas_idx on public.perguntas (publica, status, respondida_em desc);

alter table public.perguntas enable row level security;

-- Pela tabela, cada família lê só as próprias perguntas (e a administradora lê todas).
drop policy if exists "todos leem respostas publicadas" on public.perguntas;
drop policy if exists "familia le as proprias perguntas" on public.perguntas;
create policy "familia le as proprias perguntas" on public.perguntas for select to authenticated
  using (user_id = auth.uid() or (auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com');

drop policy if exists "familia pergunta" on public.perguntas;
create policy "familia pergunta" on public.perguntas for insert to authenticated
  with check (user_id = auth.uid() and status = 'nova' and resposta = '' and titulo = '' and not publica);

drop policy if exists "administradora responde" on public.perguntas;
create policy "administradora responde" on public.perguntas for update to authenticated
  using ((auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com');

drop policy if exists "familia apaga pergunta nova ou administradora apaga" on public.perguntas;
create policy "familia apaga pergunta nova ou administradora apaga" on public.perguntas for delete to authenticated
  using ((user_id = auth.uid() and status = 'nova') or (auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com');

revoke all on public.perguntas from anon;
grant select, insert, update, delete on public.perguntas to authenticated;

-- O público só vê as respostas publicadas por estas funções: título escrito pela administradora,
-- resposta, ano e data. O texto original da pergunta e quem perguntou nunca saem daqui.
create or replace function public.respostas_publicas()
returns table (id uuid, titulo text, resposta text, ano text, respondida_em timestamptz)
language sql stable security definer set search_path = public as $$
  select id, titulo, resposta, ano, respondida_em from perguntas
  where publica and status = 'respondida' and titulo <> '' order by respondida_em desc nulls last limit 300;
$$;
create or replace function public.resposta_publica(p_id uuid)
returns table (id uuid, titulo text, resposta text, ano text, respondida_em timestamptz)
language sql stable security definer set search_path = public as $$
  select id, titulo, resposta, ano, respondida_em from perguntas
  where id = p_id and publica and status = 'respondida' and titulo <> '';
$$;
revoke all on function public.respostas_publicas() from public;
revoke all on function public.resposta_publica(uuid) from public;
grant execute on function public.respostas_publicas() to anon, authenticated;
grant execute on function public.resposta_publica(uuid) to anon, authenticated;
