-- Plano de 30 dias criado pela própria família a partir do diagnóstico (/diagnostico → /meu-plano).
-- Rodar no SQL Editor do Supabase. Sem isto o site continua funcionando, mas o plano criado pela família
-- fica só no navegador dela (o banco recusa a gravação) e some ao trocar de aparelho.

-- 1) A família pode criar plano para o PRÓPRIO e-mail, e só do tipo "diagnostico". Alterar planos continua só com a administradora.
drop policy if exists "familia cria o proprio plano do diagnostico" on public.planos;
create policy "familia cria o proprio plano do diagnostico" on public.planos
  for insert to authenticated
  with check (lower(email) = lower(auth.jwt() ->> 'email') and dados ->> 'origem' = 'diagnostico');

-- 2) Novos eventos da contagem anônima: primeira atividade de 15 minutos, pedido do plano e plano criado.
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
                     'loja','diag_inicio','diag_fim','primeira_atividade','plano_pedido','plano_criado')
  on conflict (dia, evento, detalhe, origem) do update set total = public.contagens.total + 1;
$$;
revoke all on function public.contar(text, text, text) from public;
grant execute on function public.contar(text, text, text) to anon, authenticated;
