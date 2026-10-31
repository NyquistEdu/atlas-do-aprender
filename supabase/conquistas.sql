-- Mural de conquistas (página /mural).
-- Rode este arquivo uma vez no Supabase: SQL Editor > New query > colar > Run.
-- Quem tem conta compartilha uma vitória da criança, com foto opcional da atividade (nunca do rosto).
-- Nada aparece no mural antes da aprovação da administradora. Outras famílias com conta deixam 👏.

create table if not exists public.conquistas (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tema text not null default '' check (char_length(tema) <= 20),
  texto text not null check (char_length(trim(texto)) between 5 and 300),
  autor text not null check (char_length(trim(autor)) between 2 and 60),
  foto text not null default '' check (char_length(foto) <= 200),
  desafio text not null default '' check (char_length(desafio) <= 10),
  status text not null default 'pendente' check (status in ('pendente', 'aprovada', 'recusada'))
);
-- (para quem já tinha rodado uma versão anterior deste arquivo)
alter table public.conquistas add column if not exists desafio text not null default '' check (char_length(desafio) <= 10);
create index if not exists conquistas_desafio_idx on public.conquistas (desafio, status);
create index if not exists conquistas_status_idx on public.conquistas (status, criado_em desc);

create table if not exists public.palmas (
  conquista_id uuid not null references public.conquistas (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  primary key (conquista_id, user_id)
);

alter table public.conquistas enable row level security;
alter table public.palmas enable row level security;

-- Pela tabela: cada família vê e apaga as próprias; a administradora vê e modera todas.
drop policy if exists "familia le as proprias conquistas" on public.conquistas;
create policy "familia le as proprias conquistas" on public.conquistas for select to authenticated
  using (user_id = auth.uid() or (auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com');
drop policy if exists "familia compartilha conquista" on public.conquistas;
create policy "familia compartilha conquista" on public.conquistas for insert to authenticated
  with check (user_id = auth.uid() and status = 'pendente' and (foto = '' or foto like auth.uid()::text || '/%'));
drop policy if exists "administradora modera conquistas" on public.conquistas;
create policy "administradora modera conquistas" on public.conquistas for update to authenticated
  using ((auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com') with check ((auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com');
drop policy if exists "autora ou administradora apaga conquista" on public.conquistas;
create policy "autora ou administradora apaga conquista" on public.conquistas for delete to authenticated
  using (user_id = auth.uid() or (auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com');

revoke all on public.conquistas from anon;
grant select, insert, update, delete on public.conquistas to authenticated;
revoke all on public.palmas from anon, authenticated;

-- O mural público: só conquistas aprovadas, sem identificar a conta de quem postou.
-- p_desafio filtra as participações de um desafio do mês (ex.: '2026-11').
drop function if exists public.mural(integer, timestamptz);
drop function if exists public.mural(integer, timestamptz, text);
create or replace function public.mural(p_limite integer default 60, p_antes timestamptz default null, p_desafio text default null)
returns table (id uuid, criado_em timestamptz, tema text, texto text, autor text, foto text, desafio text, palmas integer, aplaudi boolean)
language sql stable security definer set search_path = public as $$
  select c.id, c.criado_em, c.tema, c.texto, c.autor, c.foto, c.desafio,
         (select count(*)::int from palmas p where p.conquista_id = c.id),
         exists (select 1 from palmas p where p.conquista_id = c.id and p.user_id = auth.uid())
  from conquistas c
  where c.status = 'aprovada' and (p_antes is null or c.criado_em < p_antes) and (p_desafio is null or c.desafio = p_desafio)
  order by c.criado_em desc
  limit least(greatest(coalesce(p_limite, 60), 1), 120);
$$;

-- Quantas famílias já participaram de um desafio (conquistas aprovadas).
create or replace function public.participantes_desafio(p_desafio text)
returns integer
language sql stable security definer set search_path = public as $$
  select count(distinct user_id)::int from conquistas where desafio = p_desafio and status = 'aprovada';
$$;

-- 👏: liga e desliga a palma de quem está logado. Devolve o novo total.
create or replace function public.aplaudir(p_id uuid)
returns integer
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'entre para aplaudir'; end if;
  if not exists (select 1 from conquistas where id = p_id and status = 'aprovada') then raise exception 'conquista não encontrada'; end if;
  if exists (select 1 from palmas where conquista_id = p_id and user_id = auth.uid()) then
    delete from palmas where conquista_id = p_id and user_id = auth.uid();
  else
    insert into palmas (conquista_id, user_id) values (p_id, auth.uid());
  end if;
  return (select count(*)::int from palmas where conquista_id = p_id);
end;
$$;

revoke all on function public.mural(integer, timestamptz, text) from public;
revoke all on function public.participantes_desafio(text) from public;
grant execute on function public.participantes_desafio(text) to anon, authenticated;
revoke all on function public.aplaudir(uuid) from public;
grant execute on function public.mural(integer, timestamptz, text) to anon, authenticated;
grant execute on function public.aplaudir(uuid) to authenticated;

-- Fotos: pasta de cada conta dentro do armazenamento "conquistas". Os nomes de arquivo são aleatórios
-- e a foto só aparece no mural depois da aprovação.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('conquistas', 'conquistas', true, 2097152, array['image/jpeg', 'image/webp', 'image/png'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/jpeg', 'image/webp', 'image/png'];

drop policy if exists "familia envia foto de conquista" on storage.objects;
create policy "familia envia foto de conquista" on storage.objects for insert to authenticated
  with check (bucket_id = 'conquistas' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "familia ou administradora apaga foto de conquista" on storage.objects;
create policy "familia ou administradora apaga foto de conquista" on storage.objects for delete to authenticated
  using (bucket_id = 'conquistas' and ((storage.foldername(name))[1] = auth.uid()::text or (auth.jwt() ->> 'email') = 'stephaniekamarryas@gmail.com'));
