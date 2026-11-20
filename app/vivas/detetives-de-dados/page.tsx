import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import DetetivesViva from "./DetetivesViva";

export const metadata: Metadata = {
  title: "Detetives de Dados · Fase Viva de tabelas e gráficos (3º ano)",
  description: "Tabelas e gráficos para mexer: faça uma pesquisa, marque os votos com risquinhos e veja o gráfico de barras crescer quadradinho por quadradinho. Monte o mural da cantina, leia pictogramas e tabelas de dupla entrada e enfrente o chefão.",
  alternates: { canonical: "/vivas/detetives-de-dados" },
  openGraph: { images: ["/apostilas/detetives-de-dados/capa.webp"] },
};

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Detetives de Dados <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <DetetivesViva />
        <p className="meta" style={{ textAlign: "center" }}>A capa e o laboratório são abertos para todos; do treino em diante, entre na sua conta grátis do Atlas. Funciona no celular deitado, no computador e na TV.</p>
      </div>
    </div>
  );
}
