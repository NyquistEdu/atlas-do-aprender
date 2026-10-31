import { admin } from "@/lib/emails/servidor";

export const dynamic = "force-dynamic";

async function descadastrar(t: string | null) {
  const db = admin();
  if (!db || !t || !/^[0-9a-f-]{36}$/i.test(t)) return false;
  const { data } = await db.from("preferencias_email").update({ quer: false, atualizado_em: new Date().toISOString() }).eq("token", t).select("user_id");
  return !!data?.length;
}

const pagina = (ok: boolean) => new Response(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>E-mails do Atlas</title></head>
<body style="margin:0;background:#FFF8EC;font-family:Arial,Helvetica,sans-serif;color:#1d2433">
<div style="max-width:520px;margin:60px auto;padding:28px;background:#fff;border:2px solid #1d2433;border-radius:20px;box-shadow:6px 6px 0 #F2B33D">
<p style="display:inline-block;background:#1d2433;color:#FFF8EC;border-radius:999px;padding:8px 16px;font-weight:700;margin:0 0 18px">● ● ● Atlas do Aprender</p>
<h1 style="font-size:24px;margin:0 0 10px">${ok ? "Pronto, você não vai mais receber nossos e-mails." : "Não encontramos este pedido."}</h1>
<p style="line-height:1.6">${ok ? "Sua conta e tudo o que vocês registraram continuam lá. Se mudar de ideia, é só ligar de novo em “E-mails do Atlas”, no site." : "O link pode estar incompleto. Se quiser parar de receber, entre no site e desligue em “E-mails do Atlas”, ou responda a qualquer e-mail nosso."}</p>
<p><a href="https://www.atlasdoaprender.com.br/emails" style="color:#1d2433;font-weight:700">Abrir as preferências de e-mail →</a></p></div></body></html>`, { headers: { "content-type": "text/html; charset=utf-8" } });

/** Link do rodapé dos e-mails: descadastra com um clique. */
export async function GET(req: Request) {
  return pagina(await descadastrar(new URL(req.url).searchParams.get("t")));
}

/** Descadastro de um clique pelo botão do próprio programa de e-mail (List-Unsubscribe-Post). */
export async function POST(req: Request) {
  const ok = await descadastrar(new URL(req.url).searchParams.get("t"));
  return new Response(ok ? "ok" : "nao encontrado", { status: ok ? 200 : 404 });
}
