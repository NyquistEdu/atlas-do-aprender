import type { Metadata } from "next";
import { todasFases } from "@/lib/fasesInfo";
import Mural, { type DesafioInfo } from "./Mural";
import { DESAFIOS } from "@/lib/desafios";

export const metadata: Metadata = {
  title: "Mural de conquistas das famílias",
  description: "Pequenas grandes vitórias das crianças que estudam com o Atlas do Aprender: o primeiro livro lido sozinho, a tabuada que finalmente fixou, o experimento que deu certo.",
  alternates: { canonical: "/mural" },
};

export default function Pagina() {
  const fases = todasFases();
  return (
    <div className="wrap largo">
      <p className="eyebrow-i">Comunidade</p>
      <h1 className="hero-t">Mural de conquistas</h1>
      <p className="lead">Pequenas grandes vitórias das crianças que estudam com o Atlas: o primeiro livro lido sozinho, a tabuada que finalmente fixou, o experimento que deu certo. Comemore junto com um 👏.</p>
      <Mural fases={fases} desafios={Object.fromEntries(DESAFIOS.map((d) => [d.id, { id: d.id, titulo: d.titulo, emoji: d.emoji, mes: d.mes } as DesafioInfo]))} />
    </div>
  );
}
