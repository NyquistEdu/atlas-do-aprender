/**
 * Planejamento de estudos de uma família (mesmo formato do gerador em ferramentas/planejamento).
 * Fica na tabela public.planos, ligado ao e-mail da conta. A página /meu-plano mostra o dia, a semana e os temas.
 */
import { TRILHAS, SLUG, anoSlug, type Materia, type Tema } from "@/lib/data";
import { apostilaDoTema, type Apostila } from "@/lib/apostilas";

export type TemaPlano = { materia: Materia; ano: string; tema: number };
export type CriancaPlano = { nome: string; ano?: string; idade?: number; temas: TemaPlano[]; reforcar?: string };
export type ExtraPlano = { quem: string; texto: string; icone?: string; dias: string[]; de?: string; ate?: string; link?: string };
export type EventoPlano = { data: string; quem: string; texto: string; icone?: string; link?: string };
export type Plano = {
  familia: string;
  inicio: string; // AAAA-MM-DD
  dias?: number;
  objetivo?: string;
  como?: string;
  criancas: CriancaPlano[];
  juntos?: TemaPlano[];
  extras?: ExtraPlano[];
  eventos?: EventoPlano[];
  agenda?: Agenda;
};

/** Uma tarefa do dia. area/tipo/minutos são usados para registrar no diário quando a tarefa é marcada. */
export type Item = { id: string; quem: string; icone: string; texto: string; link?: string; destaque?: boolean; area: string; tipo: string; minutos: number };

/** Identificador estável da tarefa dentro do dia (o mesmo texto no mesmo dia é a mesma tarefa). */
const idDe = (texto: string) => texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
/** Área e tipo do diário a partir do ícone, para extras e eventos. */
function classifica(icone: string, texto: string): [string, string, number] {
  if (icone === "📚") return ["por", "Leitura", 15];
  if (icone === "🏅" || icone === "🏆") return ["por", /prova/i.test(texto) ? "Exercício" : "Exercício", 20];
  if (icone === "🧪") return ["cie", "Experimento", 30];
  if (icone === "🎲") return ["jog", "Jogo", 30];
  if (icone === "📺" || icone === "🎬") return ["out", "Filme ou documentário", icone === "🎬" ? 90 : 20];
  if (icone === "🔤") return ["por", "Exercício", 20];
  if (icone === "🔢") return ["mat", "Exercício", 20];
  if (icone === "🔭") return ["cie", "Exercício", 20];
  return ["out", "Estudo da trilha", 20];
}
const item = (quem: string, icone: string, texto: string, extra: Partial<Item> = {}): Item => {
  const [area, tipo, minutos] = classifica(icone, texto);
  return { id: idDe(texto), quem, icone, texto, area, tipo, minutos, ...extra };
};

export const DS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
export const DIAS_NOME = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
export const MAT_INFO: Record<Materia, [string, string]> = { por: ["Português", "🔤"], mat: ["Matemática", "🔢"], cie: ["Ciências", "🔭"] };
/** Padrão da semana do Atlas: Português seg/qua/sex, Matemática ter/qui, Ciências seg/qua. */
/** Em que dias entra cada matéria e cada momento da rotina. Dia fora da lista = não entra. */
export type Agenda = Partial<Record<"por" | "mat" | "cie" | "episodios" | "filme" | "mao" | "jogo", string[]>>;
export const AGENDA_PADRAO: Required<Agenda> = {
  por: ["Seg", "Qua", "Sex"], mat: ["Ter", "Qui"], cie: ["Seg", "Qua"],
  episodios: ["Ter"], filme: ["Sex"], mao: ["Sáb"], jogo: ["Dom"],
};
export const ROTINA: [Exclude<keyof Agenda, Materia>, string, string, string?][] = [
  ["episodios", "📺", "À noite: episódios curtos ou documentário"],
  ["filme", "🎬", "À noite: filme em família"],
  ["mao", "🧪", "Mão na massa", "/mao-na-massa"],
  ["jogo", "🎲", "Jogo em família", "/jogos"],
];

export const JUNTOS = "juntos";

/** Data local AAAA-MM-DD. */
export const iso = (d: Date) => { const x = new Date(d); x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); return x.toISOString().slice(0, 10); };
export const deISO = (s: string) => { const [a, m, d] = s.split("-").map(Number); return new Date(a, m - 1, d); };
export const somaDias = (s: string, n: number) => { const d = deISO(s); d.setDate(d.getDate() + n); return iso(d); };
export const ddmm = (s: string) => s.split("-").reverse().slice(0, 2).join("/");
/** 0 = segunda … 6 = domingo. */
export const diaSemana = (s: string) => (deISO(s).getDay() + 6) % 7;
export const fimDoPlano = (p: Plano) => somaDias(p.inicio, (p.dias || 30) - 1);

export function infoTema(t: TemaPlano): { tema: Tema | undefined; apostila: Apostila | undefined; link: string; nome: string } {
  const tema = TRILHAS[t.materia]?.[t.ano]?.[t.tema - 1];
  const apostila = apostilaDoTema(t.materia, t.ano, t.tema);
  return {
    tema, apostila,
    link: `/trilhas/${SLUG[t.materia]}/${anoSlug(t.ano)}#tema-${t.tema}`,
    nome: apostila ? `Apostila ${apostila.titulo}` : `Trilha: ${tema?.t || "tema"}`,
  };
}

const itemTema = (quem: string, t: TemaPlano): Item => {
  const i = infoTema(t);
  return item(quem, MAT_INFO[t.materia][1], i.nome, { link: i.apostila ? `/apostilas/${i.apostila.slug}` : i.link, area: t.materia, tipo: i.apostila ? "Exercício" : "Estudo da trilha" });
};

/** O que fazer num dia: apostilas do padrão da semana, extras, eventos com data e as atividades de fim de semana. */
export function itensDoDia(p: Plano, data: string): Item[] {
  const wd = diaSemana(data);
  const out: Item[] = [];
  for (const e of p.eventos || []) if (e.data === data) out.push(item(e.quem, e.icone || "📌", e.texto, { link: e.link, destaque: true }));
  const ag = { ...AGENDA_PADRAO, ...(p.agenda || {}) };
  const d = DS[wd];
  for (const m of (["por", "mat", "cie"] as Materia[]).filter((x) => ag[x].includes(d))) {
    for (const c of p.criancas) for (const t of c.temas) if (t.materia === m) out.push(itemTema(c.nome, t));
    for (const t of p.juntos || []) if (t.materia === m) out.push(itemTema(JUNTOS, t));
  }
  for (const e of p.extras || []) {
    if (!e.dias.includes(DS[wd])) continue;
    if (e.de && data < e.de) continue;
    if (e.ate && data > e.ate) continue;
    out.push(item(e.quem, e.icone || "⭐", e.texto, { link: e.link }));
  }
  for (const [k, ic, tx, link] of ROTINA) if (ag[k].includes(d)) out.push(item(JUNTOS, ic, tx, link ? { link } : undefined));
  return out;
}

/** Temas (individuais e de todos juntos) de uma criança. */
export const temasDe = (p: Plano, nome: string) => [
  ...(p.criancas.find((c) => c.nome === nome)?.temas || []).map((t) => ({ t, juntos: false })),
  ...(p.juntos || []).map((t) => ({ t, juntos: true })),
];

/** Chave da marcação de uma tarefa (tabela progresso, por criança). */
export const chaveTarefa = (data: string, it: Item) => `plano|${data}|${it.id}`.slice(0, 100);
/** Texto usado no diário para saber que o registro veio do plano (e poder desfazer ao desmarcar). */
export const MARCA_PLANO = "Feito pelo plano de estudos.";
