import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import ContarViva from "./ContarViva";

export const metadata: Metadata = {
  title: "Contar até Cem · Fase Viva de contagem (Alfabetização)",
  description: "Contagem e números até 100 para mexer: material dourado em 3D onde 10 cubinhos viram 1 dezena, quadro dos 100, o caminhão da feira com caixas de 10 laranjas, saltos de 2, 5 e 10 e o desafio do chefão. Com botão de ouvir para quem ainda está aprendendo a ler.",
  alternates: { canonical: "/vivas/contar-ate-cem" },
  openGraph: { images: ["/apostilas/contar-ate-cem/capa.webp"] },
};

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Contar até Cem <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <ContarViva />
        <p className="meta" style={{ textAlign: "center" }}>A capa e o laboratório são abertos para todos; do treino em diante, entre na sua conta grátis do Atlas. Toque em 🔊 para ouvir as perguntas. Funciona no celular deitado, no computador e na TV.</p>
      </div>
    </div>
  );
}
