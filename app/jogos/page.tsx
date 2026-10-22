import type { Metadata } from "next";
import Jogos from "./Jogos";
export const metadata: Metadata = {
  title: "Jogos educativos para crianças, por idade e habilidade",
  description: "Jogos de tabuleiro e de cartas que desenvolvem memória, atenção, lógica, linguagem e números, do jogo da memória ao xadrez, com o que cada um trabalha e como aproveitar em família.",
  alternates: { canonical: "/jogos" },
};
export default function Page() { return <Jogos />; }
