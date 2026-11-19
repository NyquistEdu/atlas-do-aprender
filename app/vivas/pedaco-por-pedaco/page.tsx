import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import PedacoViva from "./PedacoViva";

export const metadata: Metadata = {
  title: "Pedaço por Pedaço · Fase Viva de frações (3º ano)",
  description: "Frações do dia a dia para mexer: pizza e chocolate em 3D cortados em partes iguais, a Pizzaria Atlas com pedidos por fração, meia dúzia, meia hora e meio litro, quatro jogos e o desafio do chefão.",
  alternates: { canonical: "/vivas/pedaco-por-pedaco" },
  openGraph: { images: ["/apostilas/pedaco-por-pedaco/capa.webp"] },
};

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Pedaço por Pedaço <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <PedacoViva />
        <p className="meta" style={{ textAlign: "center" }}>A capa e o laboratório são abertos para todos; do treino em diante, entre na sua conta grátis do Atlas. Funciona no celular deitado, no computador e na TV.</p>
      </div>
    </div>
  );
}
