-- Painel da administradora (página /painel).
-- Rode este arquivo uma vez no Supabase: SQL Editor > New query > colar > Run.
-- Ele (1) atualiza a função de contagem para aceitar os eventos novos (loja e diagnóstico)
-- e (2) cria a função painel_dados, que só responde para o e-mail da administradora.
-- A função devolve apenas totais: nenhum e-mail, nome ou dado de família sai daqui.

create or replace function public.contar(p_evento text, p_detalhe text default '', p_origem text default '')
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.contagens (dia, evento, detalhe, origem, total)
  select (now() at time zone 'America/Fortaleza')::date, p_evento, left(coalesce(p_detalhe, ''), 80), left(coalesce(p_origem, ''), 80), 1
  where p_evento in ('visita','cadastro','pedido_planejamento','viu_apostila','comprar','afiliado','baixou',
                     'convite_visto','abriu_entrar','pediu_link','entrou','registrou_atividade','pedido_apostila',
                     'loja','diag_inicio','diag_fim')
  on conflict (dia, evento, detalhe, origem) do update set total = public.contagens.total + 1;
$$;
revoke all on function public.contar(text, text, text) from public;
grant execute on function public.contar(text, text, text) to anon, authenticated;

create or replace function public.painel_dados(p_dias integer default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, auth
as $$
declare
  hoje date := (now() at time zone 'America/Fortaleza')::date;
  ini date;
  ini_ant date;
  r jsonb;
begin
  if coalesce(auth.jwt() ->> 'email', '') <> 'stephaniekamarryas@gmail.com' then
    raise exception 'sem acesso';
  end if;
  p_dias := greatest(1, least(coalesce(p_dias, 30), 3650));
  ini := hoje - (p_dias - 1);
  ini_ant := ini - p_dias;

  select jsonb_build_object(
    'hoje', hoje,
    'inicio', ini,
    'dias', p_dias,
    'desde', (select min(dia) from contagens),
    -- totais por dia e evento (período atual + o anterior, para comparar)
    'serie', coalesce((select jsonb_agg(jsonb_build_object('d', dia, 'e', evento, 'n', n) order by dia)
      from (select dia, evento, sum(total)::int as n from contagens where dia >= ini_ant group by 1, 2) s), '[]'::jsonb),
    -- totais por origem e evento no período
    'origens', coalesce((select jsonb_agg(jsonb_build_object('o', o, 'e', evento, 'n', n))
      from (select coalesce(nullif(origem, ''), 'direto') as o, evento, sum(total)::int as n
            from contagens where dia >= ini group by 1, 2) s), '[]'::jsonb),
    -- totais por detalhe (apostila, arquivo, página de entrada...) no período
    'detalhes', coalesce((select jsonb_agg(jsonb_build_object('e', evento, 'k', detalhe, 'n', n))
      from (select evento, detalhe, sum(total)::int as n from contagens
            where dia >= ini and detalhe <> '' group by 1, 2 order by 3 desc limit 600) s), '[]'::jsonb),
    'contas', jsonb_build_object(
      'total', (select count(*) from auth.users),
      'entraram', (select count(*) from auth.users where last_sign_in_at is not null),
      'com_crianca', (select count(distinct user_id) from criancas),
      'ativas7', (select count(distinct user_id) from (
          select user_id from diario where criado_em >= now() - interval '7 days'
          union all select user_id from progresso where feito_em >= hoje - 6) x),
      'ativas30', (select count(distinct user_id) from (
          select user_id from diario where criado_em >= now() - interval '30 days'
          union all select user_id from progresso where feito_em >= hoje - 29) x),
      'por_dia', coalesce((select jsonb_agg(jsonb_build_object('d', d, 'n', n) order by d)
        from (select (created_at at time zone 'America/Fortaleza')::date as d, count(*)::int as n
              from auth.users where created_at >= ini_ant group by 1) s), '[]'::jsonb)
    ),
    'uso', jsonb_build_object(
      'criancas', (select count(*) from criancas),
      'temas', (select count(*) from progresso where chave ~ '^(por|mat|cie)[1-5]-[0-9]+$'),
      'temas_periodo', (select count(*) from progresso where chave ~ '^(por|mat|cie)[1-5]-[0-9]+$' and feito_em >= ini),
      'andamento', (select count(*) from progresso where chave like 'andamento|%'),
      'livros', (select count(*) from progresso where chave like 'livro|%'),
      'registros', (select count(*) from diario),
      'registros_periodo', (select count(*) from diario where data >= ini),
      'minutos_periodo', (select coalesce(sum(minutos), 0) from diario where data >= ini),
      'planos_ativos', (select count(*) from planos where ativo)
    ),
    'pedidos', jsonb_build_object(
      'planejamento', coalesce((select jsonb_object_agg(status, n) from (select status, count(*)::int as n from pedidos_planejamento group by 1) s), '{}'::jsonb),
      'apostila', coalesce((select jsonb_object_agg(status, n) from (select status, count(*)::int as n from pedidos_apostila group by 1) s), '{}'::jsonb)
    )
  ) into r;
  return r;
end;
$$;
revoke all on function public.painel_dados(integer) from public, anon;
grant execute on function public.painel_dados(integer) to authenticated;
