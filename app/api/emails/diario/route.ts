import { NextResponse } from "next/server";
import { admin, enviar, linkDescadastro, proximaFase, ENVIO_LIGADO, LIMITE_DIARIO } from "@/lib/emails/servidor";
import { boasVindas, dia2, dia5, dia10, mensal, saudade, type Email } from "@/lib/emails/modelos";
import { desafioAtual } from "@/lib/desafios";
import { NOVIDADES } from "@/lib/novidades";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DIA = 86400000;
const dataFortaleza = (d = new Date()) => new Date(d.toLocaleString("en-US", { timeZone: "America/Fortaleza" }));
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const diasDesde = (s: string | null | undefined, agora: number) => (s ? Math.floor((agora - new Date(s).getTime()) / DIA) : Infinity);

/**
 * Rotina diária (Vercel Cron): decide qual e-mail cada família deve receber hoje (no máximo um por dia)
 * e envia pelo Brevo. Enquanto ENVIO_LIGADO for false, só calcula e devolve o que enviaria.
 */
export async function GET(req: Request) {
  const segredo = process.env.CRON_SECRET;
  if (segredo && req.headers.get("authorization") !== `Bearer ${segredo}`) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  const db = admin();
  if (!db) return NextResponse.json({ erro: "Falta SUPABASE_SERVICE_ROLE_KEY na Vercel." }, { status: 503 });
  if (ENVIO_LIGADO && !process.env.BREVO_API_KEY) return NextResponse.json({ erro: "Falta BREVO_API_KEY na Vercel." }, { status: 503 });

  const { data: prefs, error } = await db.from("preferencias_email").select("user_id,token,enviados,inicio,origem").eq("quer", true);
  if (error) return NextResponse.json({ erro: "Tabela de preferências indisponível. Rode supabase/emails.sql.", detalhe: error.message }, { status: 503 });
  if (!prefs?.length) return NextResponse.json({ ligado: ENVIO_LIGADO, familias: 0, plano: {} });

  // Contas (e-mail, data de criação e último acesso)
  const usuarios = new Map<string, { email?: string; created_at: string; last_sign_in_at?: string }>();
  for (let pagina = 1; pagina < 50; pagina++) {
    const { data } = await db.auth.admin.listUsers({ page: pagina, perPage: 1000 });
    data?.users.forEach((u) => usuarios.set(u.id, { email: u.email, created_at: u.created_at, last_sign_in_at: u.last_sign_in_at }));
    if (!data || data.users.length < 1000) break;
  }
  const ids = prefs.map((p) => p.user_id);
  const [{ data: criancas }, { data: progresso }, { data: diario }] = await Promise.all([
    db.from("criancas").select("user_id,nome,criado_em").in("user_id", ids).order("criado_em"),
    db.from("progresso").select("user_id,crianca,chave,feito_em").in("user_id", ids),
    db.from("diario").select("user_id,criado_em").in("user_id", ids).order("criado_em", { ascending: false }),
  ]);

  // Conteúdo do e-mail do mês (só busca se for usar)
  const hojeF = dataFortaleza();
  const hoje = iso(hojeF);
  const mesId = hoje.slice(0, 7);
  const agora = Date.now();
  let dadosMensal: Parameters<typeof mensal>[0] | null = null;
  const prepararMensal = async () => {
    if (dadosMensal) return dadosMensal;
    const d = desafioAtual();
    const desde = new Date(agora - 45 * DIA).toISOString();
    const { data: cs } = await db.from("conquistas").select("id,texto,autor").eq("status", "aprovada").gte("criado_em", desde).limit(200);
    const { data: ps } = cs?.length ? await db.from("palmas").select("conquista_id").in("conquista_id", cs.map((c) => c.id)) : { data: [] };
    const n = new Map<string, number>();
    (ps || []).forEach((p) => n.set(p.conquista_id, (n.get(p.conquista_id) || 0) + 1));
    const top = (cs || []).sort((a, b) => (n.get(b.id) || 0) - (n.get(a.id) || 0)).slice(0, 3).map((c) => ({ texto: c.texto, autor: c.autor }));
    const { data: r } = await db.from("perguntas").select("id,titulo").eq("publica", true).eq("status", "respondida").neq("titulo", "").order("respondida_em", { ascending: false }).limit(1);
    dadosMensal = { mes: d.mes, desafio: { titulo: d.titulo, resumo: d.resumo, emoji: d.emoji }, conquistas: top, novidades: NOVIDADES[mesId] || [], resposta: r?.[0] ? { id: r[0].id, titulo: r[0].titulo } : undefined };
    return dadosMensal;
  };

  const plano: Record<string, number> = {};
  let enviadosHoje = 0, falhas = 0;
  for (const pref of prefs) {
    if (enviadosHoje >= LIMITE_DIARIO) break;
    const u = usuarios.get(pref.user_id);
    if (!u?.email) continue;
    const env = (pref.enviados || {}) as Record<string, string>;
    if (env.ultimo === hoje) continue;
    const dias = diasDesde(pref.inicio || u.created_at, agora); // a sequência conta a partir do início dos e-mails
    const antiga = pref.origem === "conta_antiga";
    const desc = linkDescadastro(pref.token);
    let tipo = "", email: Email | null = null;

    const desdeBV = diasDesde(env.boas_vindas, agora); // a sequência conta a partir das boas-vindas
    if (!env.boas_vindas && dias <= 30) { tipo = "boas_vindas"; email = boasVindas(desc, antiga); }
    else if (hojeF.getDate() <= 5 && !env[`mensal_${mesId}`] && desdeBV >= 3) { tipo = `mensal_${mesId}`; email = mensal(await prepararMensal(), desc); }
    else if (!env.d2 && desdeBV >= 2 && desdeBV <= 20) { tipo = "d2"; email = dia2(desc); }
    else if (env.d2 && !env.d5 && desdeBV >= 5 && desdeBV <= 25) { tipo = "d5"; email = dia5(desc); }
    else if (env.d5 && !env.d10 && desdeBV >= 10 && desdeBV <= 35) { tipo = "d10"; email = dia10(desc); }
    else if (desdeBV >= 14 && diasDesde(u.created_at, agora) >= 14 && diasDesde(env.saudade, agora) >= 30 && diasDesde(env.ultimo, agora) >= 5) {
      const prog = (progresso || []).filter((p) => p.user_id === pref.user_id);
      const ultDiario = (diario || []).find((d) => d.user_id === pref.user_id)?.criado_em;
      const ultProg = prog.reduce((m, p) => (p.feito_em > m ? p.feito_em : m), "");
      const inativo = Math.min(diasDesde(u.last_sign_in_at, agora), diasDesde(ultDiario, agora), diasDesde(ultProg || null, agora));
      if (inativo >= 21) {
        // a criança com o progresso mais recente (ou a primeira cadastrada)
        const nomes = (criancas || []).filter((c) => c.user_id === pref.user_id).map((c) => c.nome);
        const recente = [...prog].sort((a, b) => b.feito_em.localeCompare(a.feito_em))[0]?.crianca;
        const crianca = recente || nomes[0];
        const fase = crianca ? proximaFase(prog.filter((p) => p.crianca === crianca)) : undefined;
        tipo = "saudade"; email = saudade({ crianca, fase }, desc);
      }
    }
    if (!email) continue;
    plano[tipo.startsWith("mensal") ? "mensal" : tipo] = (plano[tipo.startsWith("mensal") ? "mensal" : tipo] || 0) + 1;
    if (!ENVIO_LIGADO) continue;
    const ok = await enviar(u.email, email, tipo, pref.token);
    if (!ok) { falhas++; continue; }
    enviadosHoje++;
    const chave = tipo === "boas_vindas" ? "boas_vindas" : tipo;
    await db.from("preferencias_email").update({ enviados: { ...env, [chave]: hoje, ultimo: hoje, ...(tipo === "saudade" ? { saudade: hoje } : {}) } }).eq("user_id", pref.user_id);
  }
  return NextResponse.json({ ligado: ENVIO_LIGADO, familias: prefs.length, plano, enviados: enviadosHoje, falhas });
}
