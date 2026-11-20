import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import SobreFase from "@/components/viva/SobreFase";
import { metaViva } from "@/lib/vivasSeo";
import DivideAiViva from "./DivideAiViva";

export const metadata: Metadata = metaViva("divide-ai");

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Divide Aí! <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <DivideAiViva />
        <p className="meta" style={{ textAlign: "center" }}>Funciona no celular deitado, no computador e na TV. Use as setas do teclado ou o passador de slides para trocar de tela. O progresso do modo sozinho fica salvo neste aparelho.</p>
        <SobreFase slug="divide-ai" />
      </div>
    </div>
  );
}
