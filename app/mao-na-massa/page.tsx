import type { Metadata } from "next";
import Mao from "./Mao";
import { temFoto } from "@/lib/fotosMaoNaMassa";
import { ATIVIDADES, numero } from "@/lib/maoNaMassa";
import { temasDaFicha } from "@/lib/maoNaMassaTemas";

export const metadata: Metadata = {
  title: "Experimentos, invenções e atividades mão na massa para crianças",
  description: "Experimentos de ciências, invenções de papelão e atividades práticas com material de casa para crianças da alfabetização ao 5º ano. Cada uma com palpite, passo a passo, explicação, desafio e cuidados.",
  alternates: { canonical: "/mao-na-massa" },
};

export default function Page() {
  const itens = ATIVIDADES.map((x) => ({ slug: x.slug, n: x.n, sub: x.sub, est: x.est, y: x.y, idade: x.idade, tm: x.tm, nivel: x.nivel, a: x.a, num: numero(x), foto: temFoto(x.slug), tema: temasDaFicha(x.slug).length > 0 }));
  return <Mao itens={itens} />;
}
