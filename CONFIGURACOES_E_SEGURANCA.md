# Configurações de Ambiente, Segurança e Infraestrutura — Atlas do Aprender

Este documento fornece o passo a passo completo para configurar e manter o **Atlas do Aprender** em produção, com o banco de dados **Supabase** e a hospedagem na **Vercel**.

---

## 1. Configuração do Supabase

### 1.1 Criação do Projeto
1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Crie uma nova organização e um novo projeto (ex.: `atlas-do-aprender`).
3. Guarde com segurança a senha do banco de dados definida no momento da criação.

### 1.2 Criação das Tabelas e Políticas de Acesso (RLS)
1. No menu lateral do Supabase, clique em **SQL Editor** > **New query**.
2. Abra o arquivo [`supabase/schema.sql`](./supabase/schema.sql), copie todo o seu conteúdo, cole no editor e clique em **Run**.
3. O script criará:
   - Tabela `criancas`: com restrição `CHECK` de tamanho do nome (1 a 50 caracteres).
   - Tabela `progresso`: com restrição `CHECK` na chave e na criança.
   - Tabela `diario`: com restrições `CHECK` em minutos (0 a 1440), título (1 a 150 caracteres), campos de texto (até 2000 caracteres) e envolvimento (1 a 5).
   - Políticas RLS (*Row Level Security*): garantem que cada usuário logado só enxergue e modifique seus próprios registros.

> [!TIP]
> **Já tem as tabelas criadas de uma versão anterior?**
> Para aplicar as restrições `CHECK` sem recriar as tabelas ou perder dados existentes, execute o seguinte script no SQL Editor:
> ```sql
> -- Atualização de restrições em tabelas existentes
> ALTER TABLE public.criancas
>   ADD CONSTRAINT check_criancas_nome
>   CHECK (char_length(trim(nome)) > 0 AND char_length(nome) <= 50);
>
> ALTER TABLE public.progresso
>   ADD CONSTRAINT check_progresso_crianca CHECK (char_length(crianca) <= 50),
>   ADD CONSTRAINT check_progresso_chave CHECK (char_length(chave) <= 100);
>
> ALTER TABLE public.diario
>   ADD CONSTRAINT check_diario_crianca CHECK (char_length(crianca) <= 50),
>   ADD CONSTRAINT check_diario_area CHECK (char_length(area) <= 20),
>   ADD CONSTRAINT check_diario_tipo CHECK (char_length(tipo) <= 50),
>   ADD CONSTRAINT check_diario_minutos CHECK (minutos >= 0 AND minutos <= 1440),
>   ADD CONSTRAINT check_diario_titulo CHECK (char_length(trim(titulo)) > 0 AND char_length(titulo) <= 150),
>   ADD CONSTRAINT check_diario_oque CHECK (char_length(o_que) <= 2000),
>   ADD CONSTRAINT check_diario_descobertas CHECK (char_length(descobertas) <= 2000),
>   ADD CONSTRAINT check_diario_proximo CHECK (char_length(proximo) <= 300);
> ```

### 1.3 Configuração de URLs e Autenticação
1. No menu lateral, acesse **Authentication** > **URL Configuration**.
2. **Site URL**: Defina como a URL oficial do site em produção (ex.: `https://atlasdoaprender.com.br` ou `https://seu-projeto.vercel.app`).
3. **Redirect URLs**: Adicione as seguintes URLs:
   - `https://seu-dominio.com.br/**`
   - `https://*.vercel.app/**`
   - `http://localhost:3000/**` (para desenvolvimento local)
4. Salve as alterações.

### 1.4 Configuração de SMTP Próprio (Recomendado para Produção)
O serviço padrão de e-mail do Supabase é limitado a poucas mensagens por hora e tem alto risco de cair na caixa de spam. Para produção:
1. Crie uma conta gratuita no [Resend](https://resend.com) ou [Brevo](https://brevo.com).
2. Valide o seu domínio (registros DNS SPF e DKIM).
3. No Supabase, vá em **Authentication** > **SMTP Settings** e ative **Enable Custom SMTP**:
   - **Sender email**: `login@seudominio.com.br` ou `contato@seudominio.com.br`
   - **Sender name**: `Atlas do Aprender`
   - **Host**: `smtp.resend.com` (porta 465 ou 587)
   - **User**: `resend`
   - **Password**: Sua chave de API gerada no Resend.

---

## 2. Configuração na Vercel

### 2.1 Variáveis de Ambiente
No painel do projeto na Vercel (**Settings** > **Environment Variables**), adicione:

| Nome da Variável | Onde Obter / Descrição |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Project Settings > API > Project API keys (`anon` `public`) |
| `CRON_SECRET` | Uma string segura gerada aleatoriamente (ex.: gere com `openssl rand -hex 32`) |

### 2.2 Cron Job de Prevenção de Inatividade (Keep-Alive)
O Supabase suspende projetos inativos após 7 dias no plano gratuito.
1. O repositório inclui o arquivo `vercel.json` configurado para executar diariamente às 12:00 UTC:
   ```json
   {
     "crons": [
       {
         "path": "/api/keep-alive",
         "schedule": "0 12 * * *"
       }
     ]
   }
   ```
2. A Vercel automaticamente envia o cabeçalho `Authorization: Bearer <CRON_SECRET>` se a variável `CRON_SECRET` estiver cadastrada.
3. Para testar o funcionamento após o deploy:
   - Na Vercel, acesse a aba **Cron Jobs** no painel do projeto.
   - Você verá a rota `/api/keep-alive` agendada e poderá disparar um teste manual (*Trigger*).

---

## 3. Segurança e Boas Práticas

### 3.1 Cabeçalhos HTTP de Segurança
Configurados em `next.config.mjs`:
- `X-Frame-Options: DENY`: Impede que o site seja embutido em iframes por terceiros (proteção contra Clickjacking).
- `X-Content-Type-Options: nosniff`: Força o navegador a respeitar os tipos MIME declarados.
- `Referrer-Policy: strict-origin-when-cross-origin`: Protege dados de navegação ao transitar para outros domínios.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`: Desativa permissões de hardware não utilizadas pela aplicação.

### 3.2 Validação Defensiva de Dados
- **Frontend (`Diario.tsx` e `Entrar.tsx`)**: Campos limitados via `maxLength` e minutos protegidos entre 0 e 1440.
- **Camada de Aplicação (`Providers.tsx`)**: Validações de integridade antes do envio de rede, retornando erros claros em português.
- **PostgreSQL (`schema.sql`)**: Restrições `CHECK` que impedem gravações inválidas mesmo se a API anônima for consumida diretamente.
