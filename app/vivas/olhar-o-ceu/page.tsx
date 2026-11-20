import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import SobreFase from "@/components/viva/SobreFase";
import { metaViva } from "@/lib/vivasSeo";
import OlharOCeuViva from "./OlharOCeuViva";

export const metadata: Metadata = metaViva("olhar-o-ceu");

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Olhar o Céu <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <OlharOCeuViva />
        <p className="meta" style={{ textAlign: "center" }}>Funciona no celular deitado, no computador e na TV. Use as setas do teclado ou o passador de slides para trocar de tela. O progresso do modo sozinho fica salvo neste aparelho.</p>
        <SobreFase slug="olhar-o-ceu" />
      </div>
    </div>
  );
}
