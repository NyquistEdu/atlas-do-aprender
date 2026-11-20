import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import TextosViva from "./TextosViva";

export const metadata: Metadata = {
  title: "Textos do Dia a Dia · Fase Viva de notícia, carta e receita (4º ano)",
  description: "Gêneros do cotidiano para mexer: monte uma notícia, uma carta e uma receita parte por parte numa mesa em 3D, separe trechos no correio da escola, treine fato e opinião, formal e informal, e enfrente o chefão.",
  alternates: { canonical: "/vivas/textos-do-dia-a-dia" },
  openGraph: { images: ["/apostilas/textos-do-dia-a-dia/capa.webp"] },
};

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Textos do Dia a Dia <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <TextosViva />
        <p className="meta" style={{ textAlign: "center" }}>A capa e o laboratório são abertos para todos; do treino em diante, entre na sua conta grátis do Atlas. Toque em 🔊 para ouvir. Funciona no celular deitado, no computador e na TV.</p>
      </div>
    </div>
  );
}
