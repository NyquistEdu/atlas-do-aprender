import vinculos from "@/data/mao-na-massa-temas.json";
import { MATERIAS, SLUG, TRILHAS, anoSlug, type Materia } from "@/lib/data";
import { ATIVIDADES } from "@/lib/maoNaMassa";

/** Texto da atividade sugerida no tema da trilha → slug da ficha em /mao-na-massa. */
const VINCULOS = vinculos as Record<string, string>;

export const fichaDoItem = (texto: string): string | undefined => VINCULOS[texto];

export type TemaDaFicha = { materia: Materia; ano: string; numero: number; titulo: string; href: string; rotulo: string };

/** Todos os temas das trilhas com que esta atividade se relaciona (campo `temas` da ficha). */
export function temasDaFicha(slug: string): TemaDaFicha[] {
  const x = ATIVIDADES.find((a) => a.slug === slug);
  if (!x) return [];
  return x.temas.flatMap((id) => {
    const m = id.match(/^(por|mat|cie)(\d)-(\d+)$/);
    if (!m) return [];
    const s = m[1] as Materia, ano = m[2], numero = +m[3];
    const t = TRILHAS[s]?.[ano]?.[numero - 1];
    if (!t) return [];
    return [{ materia: s, ano, numero, titulo: t.t, href: `/trilhas/${SLUG[s]}/${anoSlug(ano)}#tema-${numero}`, rotulo: `${MATERIAS[s]} · ${ano}º ano · Tema ${numero}` }];
  });
}

/** Fichas ligadas a um tema (índice do tema contando de 0, como nas páginas das trilhas). */
export const fichasDoTema = (s: Materia, ano: string, i: number) =>
  ATIVIDADES.filter((x) => x.temas.includes(`${s}${ano}-${i + 1}`));
