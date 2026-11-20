import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import SobreFase from "@/components/viva/SobreFase";
import { metaViva } from "@/lib/vivasSeo";
import DetetivesViva from "./DetetivesViva";

export const metadata: Metadata = metaViva("detetives-de-dados");

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Detetives de Dados <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <DetetivesViva />
        <p className="meta" style={{ textAlign: "center" }}>A capa e o laboratório são abertos para todos; do treino em diante, entre na sua conta grátis do Atlas. Funciona no celular deitado, no computador e na TV.</p>
        <SobreFase slug="detetives-de-dados" />
      </div>
    </div>
  );
}
