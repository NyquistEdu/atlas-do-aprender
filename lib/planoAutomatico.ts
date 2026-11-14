/**
 * Plano de 30 dias gerado automaticamente a partir do diagnóstico do site (/diagnostico).
 * Usa o mesmo modelo padrão do planejamento feito pela administradora: um tema por matéria, a agenda padrão da semana
 * e as folhas do treino diário. O resultado é gravado em public.planos, ligado ao e-mail da conta, e aparece em /meu-plano.
 */
import { supabase } from "@/lib/supabase";
import { SERIES, resultado, type Area, type Estado } from "@/lib/diagnostico";
import { MATERIAS, TRILHAS } from "@/lib/data";
import { AGENDA_PADRAO, DS, fimDoPlano, iso, somaDias, type Plano, type TemaPlano } from "@/lib/plano";
import { diasPorExtenso, novaCrianca, sugerir, type Ficha } from "@/lib/roteiro";

/** Mesma chave e formato que o diagnóstico grava no navegador (app/diagnostico/Diagnostico.tsx). */
const CHAVE_DIAGNOSTICO = "atlas-diagnostico";
const CHAVE_PLANO_PENDENTE = "atlas-plano-pendente";
const VALIDADE_PEDIDO = 7 * 86400000;
/** Guarda no navegador que a família pediu o plano, para criá-lo quando ela voltar pelo link do e-mail. */
export const marcarPedidoDePlano = () => { try { localStorage.setItem(CHAVE_PLANO_PENDENTE, String(Date.now())); } catch {} };
export const limparPedidoDePlano = () => { try { localStorage.removeItem(CHAVE_PLANO_PENDENTE); } catch {} };
export function pedidoDePlanoPendente(): boolean {
  try {
    if (new URLSearchParams(window.location.search).has("novo")) return true;
    return Date.now() - Number(localStorage.getItem(CHAVE_PLANO_PENDENTE) || 0) < VALIDADE_PEDIDO;
  } catch { return false; }
}
export type DiagnosticoSalvo = { v: 2; serie: string; nome: string; es: Record<Area, Estado>; quando: string };

export function lerDiagnostico(): DiagnosticoSalvo | null {
  try { const s = JSON.parse(localStorage.getItem(CHAVE_DIAGNOSTICO) || "null"); return s && s.v === 2 ? s : null; } catch { return null; }
}

const ORDEM: Area[] = ["por", "mat", "cie"];

/** Primeira lacuna da matéria; se está tudo firme, a próxima fase da trilha; se a trilha toda está firme, o começo do 5º ano para aprofundar. */
function temaAlvo(a: Area, es: Estado): TemaPlano {
  const r = resultado(a, es);
  const h = r.trabalhar[0]?.h ?? r.proximo;
  return h ? { materia: a, ano: h.ano, tema: h.tema } : { materia: a, ano: "5", tema: 1 };
}

const nomeTema = (t: TemaPlano) => TRILHAS[t.materia]?.[t.ano]?.[t.tema - 1]?.t || "";
const lista = (l: string[]) => (l.length > 1 ? `${l.slice(0, -1).join(", ")} e ${l[l.length - 1]}` : l[0] || "os temas do plano");

/** Texto "o que reforçar", a partir das lacunas do diagnóstico (e não das tarefas da videochamada). */
function reforcoDoDiagnostico(s: DiagnosticoSalvo, alvos: TemaPlano[]): string {
  const partes = ORDEM.map((a) => { const n = resultado(a, s.es[a]).trabalhar.length; return n ? `${MATERIAS[a]}: ${n} ${n === 1 ? "lacuna" : "lacunas"}` : ""; }).filter(Boolean);
  const comeco = lista(alvos.map(nomeTema).filter(Boolean));
  return partes.length
    ? `${partes.join(". ")}. Vamos começar por ${comeco}, um pouquinho por dia.`
    : `Os temas perguntados no diagnóstico estão firmes. Vamos aprofundar com ${comeco}, com leitura e desafios.`;
}

export function planoDoDiagnostico(s: DiagnosticoSalvo, nomeCrianca: string, inicio: string): Plano {
  const alvos = ORDEM.map((a) => temaAlvo(a, s.es[a]));
  const [por, mat, cie] = alvos;
  const materias = ORDEM;
  const serie = SERIES.find((x) => x[0] === s.serie)?.[1] || "";
  const ficha: Ficha = {
    id: "diagnostico", email: "", familia: "Minha família", inicio, dias: 30, acompanha: "", objetivo: "", como: "", obs: "", conversa: {},
    criancas: [novaCrianca({ nome: nomeCrianca, ano: serie, por, matT: mat, cie })],
    cieJuntos: false, extras: [], materias,
  };
  const sug = sugerir(ficha).criancas[0];
  const ag = { ...AGENDA_PADRAO };
  const diasEstudo = DS.filter((d) => materias.some((m) => ag[m].includes(d)));
  const como = [
    `Encontros de 15 minutos, ${diasPorExtenso(diasEstudo)}, sempre no mesmo horário.`,
    "Cada dia tem uma apostila e, em alguns dias, uma folha de treino: comece pela apostila e pare antes de cansar.",
    "Nos fins de semana, só atividades práticas e jogos.",
  ].join(" ");
  return {
    familia: "Minha família", inicio, dias: 30, origem: "diagnostico",
    objetivo: "Firmar as lacunas encontradas no diagnóstico, um pouquinho por dia, até a criança se apaixonar por aprender.",
    como,
    criancas: [{ nome: nomeCrianca, ano: serie || undefined, temas: alvos, reforcar: reforcoDoDiagnostico(s, alvos) }],
    extras: sug.extras, eventos: sug.eventos,
  };
}

export type ResultadoCriacao = { plano: Plano; guardado: boolean; jaTinha?: boolean };

/**
 * Cria o plano da família a partir do diagnóstico guardado no navegador.
 * - Se já existe um plano ativo cobrindo esses 30 dias, não cria outro.
 * - Se o banco recusar a gravação (ex.: regra de acesso ainda não liberada), devolve o plano mesmo assim, com guardado=false.
 */
export async function criarPlanoDoDiagnostico(email: string, nomeCrianca: string): Promise<ResultadoCriacao | null> {
  const s = lerDiagnostico();
  if (!s || !supabase) return null;
  const inicio = iso(new Date());
  const plano = planoDoDiagnostico(s, nomeCrianca, inicio);
  const fim = fimDoPlano(plano);
  const { data: ativos } = await supabase.from("planos").select("dados").eq("ativo", true);
  const sobrepoe = (ativos || []).map((x) => x.dados as Plano).find((d) => d.inicio <= fim && somaDias(d.inicio, (d.dias || 30) - 1) >= inicio);
  if (sobrepoe) return { plano: sobrepoe, guardado: true, jaTinha: true };
  const { error } = await supabase.from("planos").insert({ email: email.trim().toLowerCase(), dados: plano, ativo: true });
  return { plano, guardado: !error };
}
