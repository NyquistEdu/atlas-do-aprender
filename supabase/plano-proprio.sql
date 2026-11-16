-- Plano que a própria família monta em /meu-plano/montar, partindo do formato padrão do Atlas.
-- Rodar no SQL Editor do Supabase. Sem isto o site continua funcionando, mas o plano montado pela família
-- fica só no navegador dela (o banco recusa a gravação).

-- 1) A família pode criar plano para o PRÓPRIO e-mail, do diagnóstico ou montado por ela.
drop policy if exists "familia cria o proprio plano do diagnostico" on public.planos;
drop policy if exists "familia cria o proprio plano" on public.planos;
create policy "familia cria o proprio plano" on public.planos
  for insert to authenticated
  with check (lower(email) = lower(auth.jwt() ->> 'email') and dados ->> 'origem' in ('diagnostico', 'familia'));

-- 2) Ao montar um plano novo, a família desativa o plano dela que cobre os mesmos dias.
--    Ela só pode mexer nos planos do próprio e-mail e não pode passá-los para outro e-mail.
drop policy if exists "familia desativa o proprio plano" on public.planos;
create policy "familia desativa o proprio plano" on public.planos
  for update to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'))
  with check (lower(email) = lower(auth.jwt() ->> 'email'));
