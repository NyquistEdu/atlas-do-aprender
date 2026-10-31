-- E-mails para as famílias (boas-vindas, primeiros passos, novidade do mês e "sentimos sua falta").
-- Rode este arquivo uma vez no Supabase: SQL Editor > New query > colar > Run.
-- Guarda só quem aceitou receber e-mails, um código para descadastrar com um clique
-- e quais e-mails já foram enviados (para ninguém receber o mesmo e-mail duas vezes).
-- Quem envia é a rotina do site (com a chave de serviço, que fica só na Vercel).

create table if not exists public.preferencias_email (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  quer boolean not null default false,
  token uuid not null default gen_random_uuid() unique,
  atualizado_em timestamptz not null default now(),
  enviados jsonb not null default '{}'::jsonb check (pg_column_size(enviados) <= 20000)
);

alter table public.preferencias_email enable row level security;

drop policy if exists "familia le a propria preferencia" on public.preferencias_email;
create policy "familia le a propria preferencia" on public.preferencias_email for select to authenticated
  using (user_id = auth.uid());
drop policy if exists "familia cria a propria preferencia" on public.preferencias_email;
create policy "familia cria a propria preferencia" on public.preferencias_email for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists "familia muda a propria preferencia" on public.preferencias_email;
create policy "familia muda a propria preferencia" on public.preferencias_email for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- A família só escolhe se quer ou não receber; o registro do que foi enviado e o código são do sistema.
revoke all on public.preferencias_email from anon, authenticated;
grant select (user_id, quer, atualizado_em) on public.preferencias_email to authenticated;
grant insert (user_id, quer) on public.preferencias_email to authenticated;
grant update (quer, atualizado_em) on public.preferencias_email to authenticated;
