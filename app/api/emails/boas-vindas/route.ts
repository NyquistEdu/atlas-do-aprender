import { NextResponse } from "next/server";
import { admin, enviar, linkDescadastro, ENVIO_LIGADO } from "@/lib/emails/servidor";
import { boasVindas } from "@/lib/emails/modelos";

export const dynamic = "force-dynamic";

/** Chamado pelo site logo depois que a família aceita receber e-mails. Envia as boas-vindas uma única vez. */
export async function POST(req: Request) {
  const db = admin();
  const token = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
  if (!db || !token) return NextResponse.json({ ok: false, motivo: "indisponivel" });
  const { data: u } = await db.auth.getUser(token);
  const user = u?.user;
  if (!user?.email) return NextResponse.json({ ok: false, motivo: "sem_usuario" }, { status: 401 });
  const { data: pref } = await db.from("preferencias_email").select("quer,token,enviados").eq("user_id", user.id).maybeSingle();
  if (!pref?.quer) return NextResponse.json({ ok: false, motivo: "sem_consentimento" });
  const enviados = (pref.enviados || {}) as Record<string, string>;
  if (enviados.boas_vindas) return NextResponse.json({ ok: true, motivo: "ja_enviado" });
  if (!ENVIO_LIGADO) return NextResponse.json({ ok: false, motivo: "envio_desligado" });
  const ok = await enviar(user.email, boasVindas(linkDescadastro(pref.token)), "boas_vindas", pref.token);
  if (ok) {
    const hoje = new Date().toISOString().slice(0, 10);
    await db.from("preferencias_email").update({ enviados: { ...enviados, boas_vindas: hoje, ultimo: hoje } }).eq("user_id", user.id);
  }
  return NextResponse.json({ ok });
}
