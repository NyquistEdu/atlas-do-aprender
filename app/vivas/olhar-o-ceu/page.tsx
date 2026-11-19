import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import OlharOCeuViva from "./OlharOCeuViva";

export const metadata: Metadata = {
  title: "Olhar o Céu · Fase Viva de Ciências (3º ano)",
  description: "O Sol, a Lua e as estrelas para mexer: Sol, Terra e Lua em 3D, dia e noite, fases da Lua, relógio de sol, Cruzeiro do Sul e desafio do chefão. Modo sozinho e modo juntos.",
  alternates: { canonical: "/vivas/olhar-o-ceu" },
  openGraph: { images: ["/apostilas/olhar-o-ceu/capa.webp"] },
};

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Olhar o Céu <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <OlharOCeuViva />
        <p className="meta" style={{ textAlign: "center" }}>Funciona no celular deitado, no computador e na TV. Use as setas do teclado ou o passador de slides para trocar de tela. O progresso do modo sozinho fica salvo neste aparelho.</p>
      </div>
    </div>
  );
}
