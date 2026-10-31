/** Peças do envio de e-mails (só roda no servidor: usa a chave de serviço do Supabase e a do Brevo). */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SITE, type Email } from "./modelos";
import { TRILHAS, SLUG, anoSlug, type Materia } from "@/lib/data";
import { EMOJI_FASE } from "@/lib/fases";

/** Chave geral: enquanto for false, nada é enviado (a rotina só calcula e mostra o que enviaria). */
export const ENVIO_LIGADO = false;

export const REMETENTE = { name: "Atlas do Aprender", email: "contato@atlasdoaprender.com.br" };
export const RESPONDER_PARA = { name: "Stephanie Kamarry", email: "stephaniekamarryas@gmail.com" };
export const LIMITE_DIARIO = 150; // o plano grátis do Brevo envia até 300 por dia; começar devagar protege o domínio novo

export function admin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}

export const linkDescadastro = (token: string) => `${SITE}/api/descadastrar?t=${token}`;

/** Envia pelo Brevo. Devolve true se o Brevo aceitou. */
export async function enviar(para: string, email: Email, tipo: string, token: string): Promise<boolean> {
  const key = process.env.BREVO_API_KEY;
  if (!key || !ENVIO_LIGADO) return false;
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: REMETENTE, replyTo: RESPONDER_PARA, to: [{ email: para }],
      subject: email.assunto, htmlContent: email.html, tags: [tipo.split("_")[0]],
      headers: { "List-Unsubscribe": `<${linkDescadastro(token)}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    }),
  });
  return r.ok;
}

type Prog = { crianca: string; chave: string; feito_em: string };

/** Próxima fase da criança (a mesma lógica do "Você está aqui" do mapa), a partir do progresso marcado. */
export function proximaFase(prog: Prog[]): { nome: string; href: string; emoji: string } | undefined {
  const feito = new Set(prog.map((p) => p.chave));
  const fase = (m: Materia, y: string, i: number) => {
    const t = TRILHAS[m]?.[y]?.[i];
    return t ? { nome: t.t, href: `/trilhas/${SLUG[m]}/${anoSlug(y)}#tema-${i + 1}`, emoji: EMOJI_FASE[`${m}${y}-${i}`] || "📍" } : undefined;
  };
  const ordem = [...prog].sort((a, b) => b.feito_em.localeCompare(a.feito_em));
  // 1) tema marcado como "estamos trabalhando" e ainda não concluído
  for (const p of ordem) {
    const m = p.chave.match(/^andamento\|(por|mat|cie)(\d)-(\d+)$/);
    if (m && !feito.has(`${m[1]}${m[2]}-${m[3]}`)) return fase(m[1] as Materia, m[2], Number(m[3]));
  }
  // 2) a partir do último tema concluído: o próximo que falta naquele ano, ou a fase 1 do ano seguinte
  for (const p of ordem) {
    const m = p.chave.match(/^(por|mat|cie)(\d)-(\d+)$/);
    if (!m) continue;
    const s = m[1] as Materia, y = m[2];
    const lista = TRILHAS[s]?.[y] || [];
    const i = lista.findIndex((_, k) => !feito.has(`${s}${y}-${k}`));
    if (i >= 0) return fase(s, y, i);
    const prox = String(Number(y) + 1);
    if (TRILHAS[s]?.[prox]) return fase(s, prox, 0);
    return undefined;
  }
  return undefined;
}
