import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import BrincarViva from "./BrincarViva";

export const metadata: Metadata = {
  title: "Brincar com as Palavras · Fase Viva de rimas e sílabas (Alfabetização)",
  description: "Consciência fonológica para brincar: o trem das sílabas em 3D, em que cada palma traz um vagão, a estação das rimas, parlendas e trava-línguas, com voz para quem ainda não lê.",
  alternates: { canonical: "/vivas/brincar-com-as-palavras" },
  openGraph: { images: ["/apostilas/brincar-com-as-palavras/capa.webp"] },
};

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Brincar com as Palavras <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <BrincarViva />
        <p className="meta" style={{ textAlign: "center" }}>Ligue o som: quase tudo aqui é para ouvir. A capa e o laboratório são abertos para todos; do treino em diante, entre na sua conta grátis do Atlas.</p>
      </div>
    </div>
  );
}
