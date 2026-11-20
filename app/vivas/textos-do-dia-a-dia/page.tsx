import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import SobreFase from "@/components/viva/SobreFase";
import { metaViva } from "@/lib/vivasSeo";
import TextosViva from "./TextosViva";

export const metadata: Metadata = metaViva("textos-do-dia-a-dia");

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Textos do Dia a Dia <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <TextosViva />
        <p className="meta" style={{ textAlign: "center" }}>A capa e o laboratório são abertos para todos; do treino em diante, entre na sua conta grátis do Atlas. Toque em 🔊 para ouvir. Funciona no celular deitado, no computador e na TV.</p>
        <SobreFase slug="textos-do-dia-a-dia" />
      </div>
    </div>
  );
}
