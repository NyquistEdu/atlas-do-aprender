import type { Metadata } from "next";
import { ANOS, MATERIAS, SLUG, TRILHAS, anoSlug, temaId, type Materia } from "@/lib/data";
import { anoNome } from "@/lib/apostilas";
import { EMOJI_FASE } from "@/lib/fases";
import Mural, { type FaseInfo } from "./Mural";

export const metadata: Metadata = {
  title: "Mural de conquistas das famílias",
  description: "Pequenas grandes vitórias das crianças que estudam com o Atlas do Aprender: o primeiro livro lido sozinho, a tabuada que finalmente fixou, o experimento que deu certo.",
  alternates: { canonical: "/mural" },
};

export default function Pagina() {
  const fases: Record<string, FaseInfo> = {};
  (Object.keys(MATERIAS) as Materia[]).forEach((m) => ANOS.forEach(([y]) => (TRILHAS[m][y] || []).forEach((t, i) => {
    const id = temaId(m, y, i);
    fases[id] = { nome: t.t, rot: `${MATERIAS[m]} · ${anoNome(y)}`, href: `/trilhas/${SLUG[m]}/${anoSlug(y)}#tema-${i + 1}`, emoji: EMOJI_FASE[id] || "📍", cor: m };
  })));
  return (
    <div className="wrap largo">
      <p className="eyebrow-i">Comunidade</p>
      <h1 className="hero-t">Mural de conquistas</h1>
      <p className="lead">Pequenas grandes vitórias das crianças que estudam com o Atlas: o primeiro livro lido sozinho, a tabuada que finalmente fixou, o experimento que deu certo. Comemore junto com um 👏.</p>
      <Mural fases={fases} />
    </div>
  );
}
