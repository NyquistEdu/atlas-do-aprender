import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import MedirViva from "./MedirViva";

export const metadata: Metadata = {
  title: "Medir o Mundo · Fase Viva de medidas (3º ano)",
  description: "Comprimento, massa e capacidade para mexer: régua de verdade, balança de pratos em 3D, jarra de 1 litro, a receita do bolo, estimativas e desafio do chefão. Modo sozinho e modo juntos.",
  alternates: { canonical: "/vivas/medir-o-mundo" },
  openGraph: { images: ["/apostilas/medir-o-mundo/capa.webp"] },
};

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Medir o Mundo <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <MedirViva />
        <p className="meta" style={{ textAlign: "center" }}>A capa e o laboratório são abertos para todos; do treino em diante, entre na sua conta grátis do Atlas. Funciona no celular deitado, no computador e na TV.</p>
      </div>
    </div>
  );
}
