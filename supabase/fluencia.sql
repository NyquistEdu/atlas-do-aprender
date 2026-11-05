-- Teste de fluência leitora: histórico de cada criança.
-- Rode uma vez no Supabase: SQL Editor > New query > colar > Run.
create table if not exists public.fluencia (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  crianca text not null check (char_length(crianca) <= 50),
  data date not null default current_date,
  nivel text not null check (nivel in ('1','2','3')),
  forma text not null check (forma in ('A','B')),
  dados jsonb not null,
  criado_em timestamptz not null default now()
);
alter table public.fluencia enable row level security;
create policy "fluencia do proprio usuario" on public.fluencia
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
