/**
 * Planejamento de estudos de uma família (mesmo formato do gerador em ferramentas/planejamento).
 * Fica na tabela public.planos, ligado ao e-mail da conta. A página /meu-plano mostra o dia, a semana e os temas.
 */
import { TRILHAS, SLUG, anoSlug, type Materia, type Tema } from "@/lib/data";
import { apostilaDoTema, type Apostila } from "@/lib/apostilas";

export type TemaPlano = { materia: Materia; ano: string; tema: number };
export type CriancaPlano = { nome: string; ano?: string; idade?: number; temas: TemaPlano[] };
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
};

export type Item = { quem: string; icone: string; texto: string; link?: string; destaque?: boolean };

export const DS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
export const DIAS_NOME = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
export const MAT_INFO: Record<Materia, [string, string]> = { por: ["Português", "🔤"], mat: ["Matemática", "🔢"], cie: ["Ciências", "🔭"] };
/** Padrão da semana do Atlas: Português seg/qua/sex, Matemática ter/qui, Ciências seg/qua. */
const DIA_MATERIA: Record<number, Materia[]> = { 0: ["por", "cie"], 1: ["mat"], 2: ["por", "cie"], 3: ["mat"], 4: ["por"] };
const NOITE: Record<number, [string, string]> = { 1: ["📺", "À noite: episódios curtos ou documentário"], 4: ["🎬", "À noite: filme em família"] };

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
  return { quem, icone: MAT_INFO[t.materia][1], texto: i.nome, link: i.apostila ? `/apostilas/${i.apostila.slug}` : i.link };
};

/** O que fazer num dia: apostilas do padrão da semana, extras, eventos com data e as atividades de fim de semana. */
export function itensDoDia(p: Plano, data: string): Item[] {
  const wd = diaSemana(data);
  const out: Item[] = [];
  for (const e of p.eventos || []) if (e.data === data) out.push({ quem: e.quem, icone: e.icone || "📌", texto: e.texto, link: e.link, destaque: true });
  for (const m of DIA_MATERIA[wd] || []) {
    for (const c of p.criancas) for (const t of c.temas) if (t.materia === m) out.push(itemTema(c.nome, t));
    for (const t of p.juntos || []) if (t.materia === m) out.push(itemTema(JUNTOS, t));
  }
  for (const e of p.extras || []) {
    if (!e.dias.includes(DS[wd])) continue;
    if (e.de && data < e.de) continue;
    if (e.ate && data > e.ate) continue;
    out.push({ quem: e.quem, icone: e.icone || "⭐", texto: e.texto, link: e.link });
  }
  if (NOITE[wd]) out.push({ quem: JUNTOS, icone: NOITE[wd][0], texto: NOITE[wd][1] });
  if (wd === 5) out.push({ quem: JUNTOS, icone: "🧪", texto: "Mão na massa" , link: "/mao-na-massa" });
  if (wd === 6) out.push({ quem: JUNTOS, icone: "🎲", texto: "Jogo em família", link: "/jogos" });
  return out;
}

/** Temas (individuais e de todos juntos) de uma criança. */
export const temasDe = (p: Plano, nome: string) => [
  ...(p.criancas.find((c) => c.nome === nome)?.temas || []).map((t) => ({ t, juntos: false })),
  ...(p.juntos || []).map((t) => ({ t, juntos: true })),
];
