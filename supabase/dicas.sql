-- Dicas das famílias, dentro de cada fase do mapa das trilhas.
-- Rode este arquivo uma vez no Supabase: SQL Editor > New query > colar > Run.
-- Quem tem conta envia uma dica; ela só aparece para todos depois que a administradora aprova.
-- Cada pessoa vê as dicas aprovadas e as suas próprias (com o aviso "aguardando aprovação").

create table if not exists public.dicas (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tema text not null check (char_length(tema) between 3 and 20),
  autor text not null check (char_length(trim(autor)) between 2 and 60),
  texto text not null check (char_length(trim(texto)) between 10 and 600),
  status text not null default 'pendente' check (status in ('pendente', 'aprovada', 'recusada')),
  resposta text not null default '' check (char_length(resposta) <= 600)
);
create index if not exists dicas_tema_idx on public.dicas (tema, status);

alter table public.dicas enable row level security;

drop policy if exists "todos leem dicas aprovadas" on public.dicas;
create policy "todos leem dicas aprovadas" on public.dicas for select to anon, authenticated
  using (status = 'aprovada' or user_id = auth.uid() or (auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com');

drop policy if exists "familia envia dica" on public.dicas;
create policy "familia envia dica" on public.dicas for insert to authenticated
  with check (user_id = auth.uid() and status = 'pendente' and resposta = '');

drop policy if exists "administradora modera dicas" on public.dicas;
create policy "administradora modera dicas" on public.dicas for update to authenticated
  using ((auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com');

drop policy if exists "autora ou administradora apaga dica" on public.dicas;
create policy "autora ou administradora apaga dica" on public.dicas for delete to authenticated
  using (user_id = auth.uid() or (auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com');

grant select on public.dicas to anon, authenticated;
grant insert, update, delete on public.dicas to authenticated;
