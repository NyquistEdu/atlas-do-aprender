# Atlas do Aprender

Sistema de formação infantil da alfabetização ao 5º ano: trilhas de Português, Matemática e Ciências, livros paradidáticos, jogos, experimentos mão na massa e diário de aprendizagem.

Criado por **Stephanie Kamarry**.

## Como funciona o acesso

- **Todo o conteúdo é público.** Qualquer pessoa vê trilhas, livros, jogos, experimentos e o guia, sem conta.
- **O login só é pedido para registrar**: marcar temas concluídos, marcar livros lidos e usar o diário.
- O login é por **link no e-mail** (sem senha), feito pelo Supabase.
- Cada pessoa só vê os próprios registros (regras de segurança no banco, em `supabase/schema.sql`).

## Rodar no computador

Requer Node.js 18.17 ou mais novo.

```bash
npm install
cp .env.example .env.local   # e preencha com os dados do Supabase
npm run dev                  # abre em http://localhost:3000
```

Sem o `.env.local`, o site funciona só para leitura (sem login nem diário).

## Ligar o Supabase (login e diário)

1. Crie uma conta gratuita em https://supabase.com e um projeto novo.
2. Em **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Em **Project Settings > API**, copie a **Project URL** e a chave **anon public** para o `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. Em **Authentication > URL Configuration**:
   - **Site URL**: o endereço do site publicado (ex.: `https://atlasdoaprender.com.br`).
   - **Redirect URLs**: acrescente `https://atlasdoaprender.com.br/**` e `http://localhost:3000/**`.
5. Opcional: em **Authentication > Email Templates**, traduza o e-mail do link de acesso para português.

O e-mail padrão do Supabase tem limite baixo de envios por hora. Para muitos usuários, configure um SMTP próprio (Authentication > SMTP Settings), por exemplo com Resend ou Brevo. Consulte o manual completo em [`CONFIGURACOES_E_SEGURANCA.md`](./CONFIGURACOES_E_SEGURANCA.md).

## Publicar na Vercel

1. Em https://vercel.com, **Add New > Project** e importe este repositório do GitHub.
2. Em **Environment Variables**, cadastre:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `CRON_SECRET` (gerado aleatoriamente para proteger a rota keep-alive)
3. Clique em **Deploy**.
4. O Cron diário (`vercel.json`) executará automaticamente a cada 24h para impedir a suspensão por inatividade do Supabase gratuito.
5. Para usar um domínio próprio: **Settings > Domains** e siga as instruções de DNS.
6. Detalhes completos de segurança e deploy no guia [`CONFIGURACOES_E_SEGURANCA.md`](./CONFIGURACOES_E_SEGURANCA.md).

## Onde fica cada coisa

| Caminho | O que é |
|---|---|
| `data/conteudo.json` | Todo o conteúdo: trilhas, livros, jogos, experimentos e estante de formação |
| `app/trilhas/[materia]/[ano]` | Páginas das trilhas (ex.: `/trilhas/matematica/3-ano`) |
| `app/livros`, `app/jogos`, `app/mao-na-massa` | Abas de consulta |
| `app/diario`, `app/entrar` | Diário e login |
| `app/api/keep-alive/route.ts` | Rota de ping para manter o Supabase ativo |
| `vercel.json` | Agendamento do Cron Job diário da Vercel |
| `components/Providers.tsx` | Sessão, crianças, progresso e diário (Supabase) |
| `app/globals.css` | Cores, tipografia e tema claro/escuro |
| `public/guia.pdf` | Guia de uso em PDF |
| `supabase/schema.sql` | Tabelas, regras de acesso (RLS) e restrições de integridade do banco |
| `CONFIGURACOES_E_SEGURANCA.md` | Manual de implantação, Vercel, Supabase, SMTP e segurança |

### Editar o conteúdo

Em `data/conteudo.json`, cada tema da trilha tem: `t` (título), `o` (objetivo), `l` (livros: `[título, motivo]`), `m` (material), `e` (exercícios), `f` (filmes), `a` (áudio), `j` (jogos) e `p` (mão na massa). A chave de progresso de um tema é `materia + ano + "-" + posição` (ex.: `por3-0`); mudar a ordem dos temas muda essa chave.
