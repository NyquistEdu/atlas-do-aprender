import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import NomearViva from "./NomearViva";

export const metadata: Metadata = {
  title: "Nomear e Descrever · Fase Viva de substantivos e adjetivos (3º ano)",
  description: "Substantivos e adjetivos para mexer: uma fábrica de personagens em 3D em que cada adjetivo muda o monstro, a coruja ou o robô, com concordância de gênero e número, achados e perdidos, textos reais e o desafio do chefão.",
  alternates: { canonical: "/vivas/nomear-e-descrever" },
  openGraph: { images: ["/apostilas/nomear-e-descrever/capa.webp"] },
};

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Nomear e Descrever <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <NomearViva />
        <p className="meta" style={{ textAlign: "center" }}>A capa e o laboratório são abertos para todos; do treino em diante, entre na sua conta grátis do Atlas. Toque em 🔊 para ouvir. Funciona no celular deitado, no computador e na TV.</p>
      </div>
    </div>
  );
}
