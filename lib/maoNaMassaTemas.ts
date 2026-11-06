import vinculos from "@/data/mao-na-massa-temas.json";
import { MATERIAS, SLUG, TRILHAS, anoSlug, type Materia } from "@/lib/data";

/** Texto da atividade no tema da trilha → slug da ficha em /mao-na-massa. */
const VINCULOS = vinculos as Record<string, string>;

export const fichaDoItem = (texto: string): string | undefined => VINCULOS[texto];

export type TemaDaFicha = { materia: Materia; ano: string; numero: number; titulo: string; href: string; rotulo: string };

/** Todos os temas das trilhas que sugerem esta atividade. */
export function temasDaFicha(slug: string): TemaDaFicha[] {
  const r: TemaDaFicha[] = [];
  for (const s of Object.keys(TRILHAS) as Materia[]) {
    for (const [ano, temas] of Object.entries(TRILHAS[s])) {
      temas.forEach((t, i) => {
        if ((t.p || []).some((x) => VINCULOS[x] === slug)) {
          r.push({
            materia: s, ano, numero: i + 1, titulo: t.t,
            href: `/trilhas/${SLUG[s]}/${anoSlug(ano)}#tema-${i + 1}`,
            rotulo: `${MATERIAS[s]} · ${ano}º ano · Tema ${i + 1}`,
          });
        }
      });
    }
  }
  return r;
}
