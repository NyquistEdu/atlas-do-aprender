import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import DivideAiViva from "./DivideAiViva";

export const metadata: Metadata = {
  title: "Divide Aí! · Fase Viva de divisão (3º ano)",
  description: "Divisão para mexer, jogar e resolver: laboratório com biscoitos em 3D, 4 jogos relâmpago, a van do passeio, desafio do chefão e resumo. Modo sozinho com XP e modo juntos com placar. Grátis, no navegador.",
  alternates: { canonical: "/vivas/divide-ai" },
  openGraph: { images: ["/apostilas/divide-ai/capa.webp"] },
};

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Divide Aí! <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <DivideAiViva />
        <p className="meta" style={{ textAlign: "center" }}>Funciona no celular deitado, no computador e na TV. Use as setas do teclado ou o passador de slides para trocar de tela. O progresso do modo sozinho fica salvo neste aparelho.</p>
      </div>
    </div>
  );
}
