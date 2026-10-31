import { ANOS, MATERIAS, SLUG, TRILHAS, anoSlug, temaId, type Materia } from "@/lib/data";
import { anoNome } from "@/lib/apostilas";
import { EMOJI_FASE } from "@/lib/fases";

export type FaseInfo = { nome: string; rot: string; href: string; emoji: string; cor: string };

/** Nome, rótulo, link e desenho de todas as fases das trilhas (para listas e seletores). */
export function todasFases(): Record<string, FaseInfo> {
  const fases: Record<string, FaseInfo> = {};
  (Object.keys(MATERIAS) as Materia[]).forEach((m) => ANOS.forEach(([y]) => (TRILHAS[m][y] || []).forEach((t, i) => {
    const id = temaId(m, y, i);
    fases[id] = { nome: t.t, rot: `${MATERIAS[m]} · ${anoNome(y)}`, href: `/trilhas/${SLUG[m]}/${anoSlug(y)}#tema-${i + 1}`, emoji: EMOJI_FASE[id] || "📍", cor: m };
  })));
  return fases;
}
