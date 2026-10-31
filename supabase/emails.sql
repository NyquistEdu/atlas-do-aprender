-- E-mails para as famílias (boas-vindas, primeiros passos, novidade do mês e "sentimos sua falta").
-- Rode este arquivo uma vez no Supabase: SQL Editor > New query > colar > Run.
-- Guarda quem recebe e-mails (quem aceitou no cadastro e as contas criadas antes dos e-mails existirem), um código para descadastrar com um clique
-- e quais e-mails já foram enviados (para ninguém receber o mesmo e-mail duas vezes).
-- Quem envia é a rotina do site (com a chave de serviço, que fica só na Vercel).

create table if not exists public.preferencias_email (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  quer boolean not null default false,
  token uuid not null default gen_random_uuid() unique,
  atualizado_em timestamptz not null default now(),
  enviados jsonb not null default '{}'::jsonb check (pg_column_size(enviados) <= 20000),
  inicio timestamptz not null default now(), -- a sequência (boas-vindas, dia 2, 5 e 10) conta a partir daqui
  origem text not null default 'site' check (origem in ('site', 'conta_antiga'))
);
alter table public.preferencias_email add column if not exists inicio timestamptz not null default now();
alter table public.preferencias_email add column if not exists origem text not null default 'site';

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

-- Contas criadas antes dos e-mails existirem: entram na sequência a partir de hoje, com boas-vindas próprias.
-- Todo e-mail tem o link para parar de receber com um clique.
insert into public.preferencias_email (user_id, quer, origem, inicio)
select u.id, true, 'conta_antiga', now() from auth.users u
where u.email is not null and not exists (select 1 from public.preferencias_email p where p.user_id = u.id)
on conflict (user_id) do nothing;
